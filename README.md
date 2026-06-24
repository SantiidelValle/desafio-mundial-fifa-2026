# Desafío Mundial FIFA 2026

Juego web en React, TypeScript, Tailwind CSS y Framer Motion para adivinar resultados, goleadores y minutos de los partidos jugados del Mundial 2026.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrí la URL que muestra Vite, normalmente `http://127.0.0.1:5173`.

En Windows, si PowerShell bloquea `npm`, usá:

```bash
npm.cmd install
npm.cmd run dev
```

## Compilar

```bash
npm run build
```

## Actualizar partidos

La base editable está en `src/data/matches2026.json`. Para sumar un nuevo partido:

1. Agregá el objeto al final del archivo.
2. Incluí `fecha`, `hora`, equipos, banderas, resultado y lista `goles`.
3. Si no hubo goles, usá `"goles": []`.

La app filtra solo partidos con resultado numérico y los ordena por fecha/hora.

## Base inicial

La base local incluye partidos jugables hasta el 23 de junio de 2026 con marcadores publicados por SB Nation y FourFourTwo, más reportes de The Guardian para partidos del día 23. El archivo está preparado para reemplazar o completar goles/minutos desde una planilla oficial o API externa sin tocar la lógica del juego.

Fuentes consultadas:

- https://www.sbnation.com/soccer/1117513/world-cup-schedule-2026-how-to-watch-every-match-scores-and-more
- https://www.fourfourtwo.com/competition/all-of-the-world-cup-scores-so-far-at-the-2026-tournament
- https://www.theguardian.com/football/live/2026/jun/23/portugal-v-uzbekistan-world-cup-2026-live
- https://www.theguardian.com/football/live/2026/jun/23/england-v-ghana-world-cup-2026-live

## Assets visuales

Los archivos en `src/assets` reemplazan los dibujos iniciales por imágenes reales:

- `world-cup-26-emblem.webp`: emblema FIFA World Cup 26.
- `trionda-ball.jpg`: foto del balón Adidas Trionda.
- `world-cup-trophy.jpg`: foto real de la Copa Mundial de la FIFA.

Si tenés los archivos oficiales provistos por FIFA/Adidas, podés reemplazar esos tres archivos manteniendo los mismos nombres y la app los tomará automáticamente.
