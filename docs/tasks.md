# Tareas
Estado: todas hechas.

| N.º | Título | Agente | Qué hacer | RN / HU | Depende de | Terminado cuando | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Inicializar proyecto | Arquitecto | Git, Node, `.gitignore`, base en Neon | – | – | `git log` muestra el commit y `.env` no se sube | Hecha |
| 2 | Backend y base de datos | Backend | `rules.js`, `setup.js`, `server.js` | RN1-8 / HU1-4 | 1 | `/api/products` devuelve el catálogo | Hecha |
| 3 | Frontend conectado | Frontend | Pantalla de catálogo, armador y confirmación | RN5-7 / HU5 | 2 | Las reservas persisten al recargar | Hecha |
| 4 | Tests de reglas | Tester | `rules.test.js` | RN1-4, RN7 / HU1, HU3 | 2 | `npm test` pasa los 7 tests | Hecha |
| 5 | Publicación | Arquitecto | Render con `DATABASE_URL` | – | 3 | La página funciona desde internet | Hecha |
| 6 | Documentación | Analista | README, spec, plan, informe | – | 5 | Documentos en el repositorio | Hecha |
