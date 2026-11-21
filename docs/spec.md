# Spec – Cuarto de Máquinas

**Objetivo:** que el cliente arme un setup compatible y lo reserve sin que otro se lleve las piezas.
**Roles:** Cliente (sin cuenta).
**Alcance:** catálogo, armador, compatibilidad, reservas con vencimiento, descuento y confirmación.

## Reglas de negocio
- **RN1** El socket de la CPU debe ser igual al de la placa madre.
- **RN2** El tipo de memoria (DDR4/DDR5) debe coincidir con el de la placa madre.
- **RN3** Potencia de la fuente ≥ (TDP CPU + TDP GPU + 100 W) × 1,2.
- **RN4** Largo de la placa de video (mm) ≤ largo máximo del gabinete.
- **RN5** Elegir una pieza la reserva 10 minutos, con un solo vencimiento por setup. Al vencer se liberan todas.
- **RN6** Una pieza sin unidades libres (por reservas de otros clientes) no se puede reservar.
- **RN7** 8% de descuento si el setup tiene las 6 categorías y cumple RN1 a RN4.
- **RN8** Solo se confirma con setup completo, compatible y reserva vigente.

## Historias de usuario
- **HU1** Dado un setup con CPU AM5, cuando elijo una placa LGA1700, entonces veo el aviso de RN1.
- **HU2** Dado que queda una unidad de una pieza, cuando otro cliente la reserva, entonces no puedo reservarla (RN6).
- **HU3** Dado un setup completo y compatible, cuando lo confirmo, entonces se descuenta el stock y se aplica RN7 (RN8).
- **HU4** Dado que pasaron 10 minutos, entonces mi reserva se libera y la pieza vuelve al stock (RN5).
- **HU5** Dado que miro el catálogo, entonces veo cuántas unidades puedo reservar de cada pieza (RN6).

## Casos borde
Fuente justa en el límite (RN3 usa ≥). Largo de la placa igual al máximo (RN4 usa ≤). Cambiar una pieza por otra de la misma categoría no reinicia el vencimiento.

## Pendientes
Ninguno dentro del alcance. Lo que quedó afuera está en `preguntas-abiertas.md`.
