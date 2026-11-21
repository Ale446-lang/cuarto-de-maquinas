# Cuarto de Máquinas

Tienda de hardware donde el cliente arma un setup de 6 piezas (procesador, placa madre, memoria, placa de video, fuente y gabinete). El sistema valida la compatibilidad, reserva las piezas por 10 minutos y confirma el pedido.

**Aplicación publicada:** https://cuarto-de-maquinas.onrender.com
(El plan gratuito de Render duerme el servidor: el primer pedido puede tardar hasta un minuto.)

## Tecnologías
Node.js + Express, PostgreSQL en Neon, HTML/CSS/JavaScript en `public/`, publicado en Render.

## Reglas de negocio
RN1 a RN8 están descriptas en [`docs/spec.md`](docs/spec.md). La lógica de compatibilidad vive en `rules.js` y las reservas en `server.js`.

## Correrlo en tu compu
1. `npm install`
2. Crear un archivo `.env` con `DATABASE_URL=<cadena de conexión de Neon>`
3. `npm run setup` (crea las tablas y carga el catálogo, una sola vez)
4. `npm start` y abrir http://localhost:3000

## Tests
`npm test` corre los tests de las reglas RN1 a RN4 y RN7.

## Documentación
`AGENTS.md`, y en `docs/`: idea, decisiones, glosario, preguntas abiertas, spec, plan, tasks e informe.
