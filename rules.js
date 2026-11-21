// Reglas de negocio RN1 a RN4 y RN7. Reciben las piezas elegidas.
const CATS = ["cpu", "mb", "ram", "gpu", "psu", "case"];

function evaluate(items) {
  const g = (c) => (items.find((i) => i.category === c) || {}).specs;
  const cpu = g("cpu"), mb = g("mb"), ram = g("ram"), gpu = g("gpu"), psu = g("psu"), cs = g("case");
  const need = cpu && gpu ? Math.ceil((cpu.tdp + gpu.tdp + 100) * 1.2) : 0;
  const rule = (rn, ready, ok, msg) => ({ rn, status: !ready ? "pending" : ok ? "ok" : "bad", msg });
  const checks = [
    rule("RN1", cpu && mb, cpu && mb && cpu.sock === mb.sock, "El socket de la CPU y de la placa madre no coinciden."),
    rule("RN2", mb && ram, mb && ram && mb.ram === ram.ram, "El tipo de memoria no coincide con la placa madre."),
    rule("RN3", psu && need, psu && psu.w >= need, `La fuente debe ser de al menos ${need} W.`),
    rule("RN4", gpu && cs, gpu && cs && gpu.len <= cs.max, "La placa de video no entra en el gabinete."),
  ];
  const complete = CATS.every((c) => items.some((i) => i.category === c));
  const compatible = checks.every((c) => c.status === "ok");
  const subtotal = items.reduce((a, i) => a + i.price, 0);
  const discount = complete && compatible ? Math.round(subtotal * 0.08) : 0; // RN7
  return { checks, complete, compatible, subtotal, discount, total: subtotal - discount };
}
module.exports = { evaluate, CATS };
