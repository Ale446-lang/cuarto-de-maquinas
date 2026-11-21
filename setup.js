// Crea las tablas en Neon y carga el catálogo. Se corre una vez: node setup.js
require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const P = [
  ["cpu", "Ryzen 5 7600", 210, 5, { sock: "AM5", tdp: 65 }],
  ["cpu", "Ryzen 7 7800X3D", 400, 1, { sock: "AM5", tdp: 120 }],
  ["cpu", "Core i5-13400F", 190, 4, { sock: "LGA1700", tdp: 65 }],
  ["mb", "B650M", 150, 4, { sock: "AM5", ram: "DDR5" }],
  ["mb", "B760M", 120, 3, { sock: "LGA1700", ram: "DDR4" }],
  ["mb", "Z790", 230, 2, { sock: "LGA1700", ram: "DDR5" }],
  ["ram", "32 GB 6000 MHz", 120, 5, { ram: "DDR5" }],
  ["ram", "16 GB 3200 MHz", 50, 6, { ram: "DDR4" }],
  ["gpu", "RTX 4060", 300, 4, { tdp: 115, len: 240 }],
  ["gpu", "RX 7800 XT", 500, 2, { tdp: 263, len: 267 }],
  ["gpu", "RTX 4070 Ti Super", 800, 1, { tdp: 285, len: 305 }],
  ["psu", "550 W 80+ Bronze", 70, 6, { w: 550 }],
  ["psu", "750 W 80+ Gold", 110, 4, { w: 750 }],
  ["psu", "1000 W 80+ Gold", 170, 2, { w: 1000 }],
  ["case", "Compacto", 80, 5, { max: 250 }],
  ["case", "Mid tower ventilado", 110, 3, { max: 340 }],
];

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL,
      price INT NOT NULL, stock INT NOT NULL CHECK (stock >= 0), specs JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS holds (
      id SERIAL PRIMARY KEY, session_id TEXT NOT NULL,
      product_id INT NOT NULL REFERENCES products(id), expires_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, session_id TEXT NOT NULL, subtotal INT NOT NULL,
      discount INT NOT NULL, total INT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());
    CREATE TABLE IF NOT EXISTS order_items (
      order_id INT REFERENCES orders(id), product_id INT REFERENCES products(id), price INT NOT NULL);`);
  const { rows } = await pool.query("SELECT count(*)::int n FROM products");
  if (rows[0].n === 0) {
    for (const [c, n, p, s, sp] of P)
      await pool.query("INSERT INTO products(category,name,price,stock,specs) VALUES($1,$2,$3,$4,$5)", [c, n, p, s, sp]);
    console.log("Catálogo cargado.");
  } else console.log("El catálogo ya existía.");
  console.log("Tablas listas.");
  await pool.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
