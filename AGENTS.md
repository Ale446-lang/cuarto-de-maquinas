# AGENTS.md

## El proyecto
Cuarto de Máquinas: tienda de hardware con armador de setups. Ver `README.md`.

## Fuente de verdad
- `docs/spec.md` manda sobre cualquier otro documento: reglas RN y historias HU.
- Si algo no está en la spec, se anota en `docs/preguntas-abiertas.md` y no se inventa.
- Orden de lectura: idea, decisiones, glosario, spec, plan, tasks.

## Stack
Node.js + Express (`server.js`), reglas puras en `rules.js`, PostgreSQL (Neon), frontend en `public/index.html`, tests con `node --test`.

## Reglas generales
- Ningún secreto en el código: la cadena de conexión va en `.env` (ignorado por Git) y en variables de entorno de Render.
- Las reglas de negocio se escriben solo en `rules.js` y `server.js`, nunca en el frontend. El frontend muestra lo que responde la API.
- Un commit por tarea de `docs/tasks.md`, con el mensaje "Tarea N: ...".
- Una tarea está terminada cuando pasan sus tests y el revisor la aprobó.

## Agentes
- **Analista:** convierte lo que pide el cliente en reglas y historias sin huecos.
- **Arquitecto:** decide estructura, base de datos y dónde vive cada regla (`docs/plan.md`).
- **Backend:** implementa API y reglas, sin modificar los tests.
- **Frontend:** implementa las pantallas y consume la API.
- **Tester:** escribe los tests a partir de la spec antes de implementar.
- **Revisor:** verifica que cada tarea cumpla su RN, HU y criterio de terminado antes del commit.
