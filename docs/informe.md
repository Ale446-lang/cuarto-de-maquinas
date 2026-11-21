# Informe del proyecto

Plan técnico: ver [`plan.md`](plan.md). Tareas: ver [`tasks.md`](tasks.md).

## Pruebas realizadas
**Automáticas** (`npm test`, 7 tests, todos pasan): RN1, RN2, RN3 (en el límite exacto de 360 W), RN4 (largo igual y largo mayor), reglas pendientes cuando falta una pieza, y RN7 con setup completo, incompleto e incompatible.

**Manuales** (local y en https://cuarto-de-maquinas.onrender.com):
| Prueba | Resultado esperado | Resultado |
|---|---|---|
| `GET /api/products` | Lista de 16 piezas | Correcto |
| Reservar y recargar la página (HU5, RN5) | La reserva sigue ahí | Correcto |
| CPU AM5 con placa LGA1700 (HU1) | Aviso rojo de RN1 | Correcto |
| Dos clientes y la última unidad, con una ventana de incógnito (HU2) | El segundo ve «Reservado por otro cliente» | Correcto |
| Setup completo y compatible, confirmar (HU3) | Descuento del 8% y stock que baja | Correcto |

## Orden de las tareas y por qué
1. **Proyecto y base primero:** sin repositorio ni base no hay dónde guardar nada, y Git protege cada avance.
2. **Backend antes que el frontend:** las reglas y las reservas concurrentes son la parte más difícil y de la que dependen las demás. Si fallaban, había que rediseñar todo.
3. **Frontend después:** consume la API, así que no necesita decidir ninguna regla.
4. **Tests y publicación al final:** una vez estable el comportamiento.

## Limitaciones
Los tests se escribieron después de implementar. En el ciclo ideal el tester los escribe antes y el desarrollador no los modifica. Tampoco hay tests automáticos de las reservas (RN5, RN6, RN8): se probaron a mano porque requieren una base de datos.
