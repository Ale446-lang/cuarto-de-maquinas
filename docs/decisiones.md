# Decisiones

## Catálogo
- **¿Cuántas piezas y categorías?** 16 piezas en 6 categorías. Alcanza para probar todas las reglas.
- **¿Cuántas piezas por categoría?** Una sola por setup. Elegir otra reemplaza la anterior.
- **¿En qué moneda?** Dólares, que es como se cotiza el hardware.

## Compatibilidad
- **¿Qué se valida?** Socket CPU-placa, tipo de memoria, potencia de la fuente y largo de la placa de video (RN1 a RN4).
- **¿Cómo se calcula la fuente?** (TDP CPU + TDP GPU + 100 W) × 1,2. El margen del 20% evita fuentes justas.
- **¿Qué pasa en el límite exacto?** Se acepta (≥ y ≤).

## Reservas y stock
- **¿Cuánto dura una reserva?** 10 minutos, un único vencimiento para todo el setup.
- **¿Qué pasa si dos clientes quieren la última unidad?** Gana el primero; el otro ve «Reservado por otro cliente».
- **¿Cómo se identifica al cliente?** Con un ID aleatorio guardado en el navegador, sin login.

## Descuento y confirmación
- **¿Hay descuento?** 8% si el setup tiene las 6 piezas y es compatible.
- **¿Cuándo se puede confirmar?** Solo con setup completo, compatible y reserva vigente.

## Técnicas
- Express + PostgreSQL: las reservas necesitan transacciones para evitar que dos clientes se lleven la última unidad.
- Un solo servicio en Render sirve la API y la página.
