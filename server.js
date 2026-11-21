require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const { evaluate } = require("./rules");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(express.json());
app.use(express.static("public"));

const heldBy = (db, session) =>
  db.query(
    `SELECT p.*, h.expires_at FROM holds h JOIN products p ON p.id = h.product_id
     WHERE h.session_id = $1 AND h.expires_at > now()`, [session]);

// Catálogo. "free" = unidades que este cliente podría reservar (RN6).
app.get("/api/products", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, p.stock - (SELECT count(*) FROM holds h WHERE h.product_id = p.id
        AND h.expires_at > now() AND h.session_id <> $1)::int AS free,
        EXISTS (SELECT 1 FROM holds h WHERE h.product_id = p.id AND h.session_id = $1
        AND h.expires_at > now()) AS mine
     FROM products p ORDER BY p.id`, [req.query.session || ""]);
  res.json(rows);
});

// Setup actual del cliente: piezas, vencimiento, chequeos y total.
app.get("/api/setup", async (req, res) => {
  const { rows } = await heldBy(pool, req.query.session || "");
  res.json({ items: rows, expiresAt: rows[0] ? rows[0].expires_at : null, ...evaluate(rows) });
});

// RN5 y RN6: reservar una pieza por 10 minutos.
app.post("/api/holds", async (req, res) => {
  const { session, productId } = req.body;
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const { rows: [p] } = await c.query("SELECT * FROM products WHERE id = $1 FOR UPDATE", [productId]);
    if (!p) { await c.query("ROLLBACK"); return res.status(404).json({ error: "La pieza no existe." }); }
    await c.query("DELETE FROM holds WHERE expires_at <= now()");
    await c.query(
      `DELETE FROM holds h USING products q WHERE h.product_id = q.id
       AND h.session_id = $1 AND q.category = $2`, [session, p.category]);
    const { rows: [{ n }] } = await c.query("SELECT count(*)::int n FROM holds WHERE product_id = $1", [productId]);
    if (p.stock - n < 1) {
      await c.query("ROLLBACK");
      return res.status(409).json({ error: "Esa pieza ya está reservada por otro cliente." });
    }
    await c.query(
      `INSERT INTO holds(session_id, product_id, expires_at) VALUES($1, $2,
       COALESCE((SELECT max(expires_at) FROM holds WHERE session_id = $1 AND expires_at > now()),
       now() + interval '10 minutes'))`, [session, productId]);
    await c.query("COMMIT");
    res.status(201).json({ ok: true });
  } catch (e) { await c.query("ROLLBACK"); res.status(500).json({ error: e.message }); }
  finally { c.release(); }
});

app.delete("/api/holds/:productId", async (req, res) => {
  await pool.query("DELETE FROM holds WHERE session_id = $1 AND product_id = $2", [req.query.session, req.params.productId]);
  res.json({ ok: true });
});

app.delete("/api/holds", async (req, res) => {
  await pool.query("DELETE FROM holds WHERE session_id = $1", [req.query.session]);
  res.json({ ok: true });
});

// RN8: confirmar solo con setup completo, compatible y reserva vigente.
app.post("/api/orders", async (req, res) => {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const { rows: items } = await heldBy(c, req.body.session);
    for (const i of items) await c.query("SELECT 1 FROM products WHERE id = $1 FOR UPDATE", [i.id]);
    const r = evaluate(items);
    if (!r.complete || !r.compatible) {
      await c.query("ROLLBACK");
      return res.status(422).json({ error: "El setup debe estar completo y ser compatible (RN8).", ...r });
    }
    const { rows: [o] } = await c.query(
      "INSERT INTO orders(session_id, subtotal, discount, total) VALUES($1,$2,$3,$4) RETURNING id",
      [req.body.session, r.subtotal, r.discount, r.total]);
    for (const i of items) {
      await c.query("UPDATE products SET stock = stock - 1 WHERE id = $1", [i.id]);
      await c.query("INSERT INTO order_items VALUES($1,$2,$3)", [o.id, i.id, i.price]);
    }
    await c.query("DELETE FROM holds WHERE session_id = $1", [req.body.session]);
    await c.query("COMMIT");
    res.status(201).json({ orderId: o.id, total: r.total });
  } catch (e) { await c.query("ROLLBACK"); res.status(500).json({ error: e.message }); }
  finally { c.release(); }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor en http://localhost:" + port));
