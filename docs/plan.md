# Plan técnico

## Arquitectura
Un servidor Express que expone la API y sirve `public/index.html`. La base es PostgreSQL en Neon. Todo se publica como un único Web Service en Render.

## Base de datos y justificación
PostgreSQL, porque las reservas necesitan transacciones y bloqueo de filas (`FOR UPDATE`) para que dos clientes no reserven la última unidad a la vez.

## Modelo de datos
- `products(id, category, name, price, stock, specs)`: `specs` es JSON con socket, TDP, memoria, largo, etc.
- `holds(id, session_id, product_id, expires_at)`: reservas temporales.
- `orders(id, session_id, subtotal, discount, total, created_at)` y `order_items(order_id, product_id, price)`.

## API
- `GET /api/products?session=` catálogo con stock libre (RN6).
- `GET /api/setup?session=` piezas del cliente, chequeos y total (RN1-4, RN7).
- `POST /api/holds`, `DELETE /api/holds/:id`, `DELETE /api/holds` reservas (RN5, RN6).
- `POST /api/orders` confirmación (RN8).

## Dónde vive cada regla
RN1-4 y RN7 en `rules.js` (funciones puras, testeables). RN5, RN6 y RN8 en `server.js`, dentro de transacciones. El frontend no decide nada: muestra lo que responde la API.

## Decisiones técnicas
ID de sesión aleatorio en `localStorage` en vez de login. Vencimiento único por setup. Secretos solo en `.env` y variables de Render.

## Preguntas para el analista
Ver `preguntas-abiertas.md`: pago, login, vencimiento durante la confirmación.
