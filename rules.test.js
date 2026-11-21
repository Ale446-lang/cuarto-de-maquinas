// Tests de las reglas RN1 a RN4 y RN7. Se corren con: npm test
const test = require("node:test");
const assert = require("node:assert");
const { evaluate } = require("./rules");

const it = (category, price, specs) => ({ category, price, specs });
const cpu = (sock = "AM5", tdp = 65) => it("cpu", 210, { sock, tdp });
const mb = (sock = "AM5", ram = "DDR5") => it("mb", 150, { sock, ram });
const ram = (type = "DDR5") => it("ram", 120, { ram: type });
const gpu = (tdp = 115, len = 240) => it("gpu", 300, { tdp, len });
const psu = (w = 550) => it("psu", 70, { w });
const cs = (max = 340) => it("case", 110, { max });
const status = (items, rn) => evaluate(items).checks.find((c) => c.rn === rn).status;

test("RN1: socket igual es compatible, distinto no", () => {
  assert.equal(status([cpu("AM5"), mb("AM5")], "RN1"), "ok");
  assert.equal(status([cpu("AM5"), mb("LGA1700")], "RN1"), "bad");
});
test("RN2: el tipo de memoria debe coincidir con la placa", () => {
  assert.equal(status([mb("AM5", "DDR5"), ram("DDR5")], "RN2"), "ok");
  assert.equal(status([mb("AM5", "DDR5"), ram("DDR4")], "RN2"), "bad");
});
test("RN3: la fuente cubre (TDP CPU + TDP GPU + 100) x 1,2, justo en el límite", () => {
  const base = [cpu("AM5", 100), gpu(100, 200)]; // (100+100+100)*1,2 = 360
  assert.equal(status([...base, psu(360)], "RN3"), "ok");
  assert.equal(status([...base, psu(359)], "RN3"), "bad");
});
test("RN4: la placa de video entra si su largo es menor o igual al máximo", () => {
  assert.equal(status([gpu(115, 340), cs(340)], "RN4"), "ok");
  assert.equal(status([gpu(115, 341), cs(340)], "RN4"), "bad");
});
test("Una regla queda pendiente si falta alguna de sus piezas", () => {
  assert.equal(status([cpu()], "RN1"), "pending");
  assert.equal(status([], "RN3"), "pending");
});
test("RN7: setup completo y compatible tiene 8% de descuento", () => {
  const r = evaluate([cpu(), mb(), ram(), gpu(), psu(), cs()]);
  assert.equal(r.complete, true);
  assert.equal(r.compatible, true);
  assert.equal(r.subtotal, 960);
  assert.equal(r.discount, 77);
  assert.equal(r.total, 883);
});
test("RN7: sin descuento si está incompleto o es incompatible", () => {
  assert.equal(evaluate([cpu(), mb(), ram(), gpu(), psu()]).discount, 0);
  assert.equal(evaluate([cpu("AM5"), mb("LGA1700"), ram(), gpu(), psu(), cs()]).discount, 0);
});
