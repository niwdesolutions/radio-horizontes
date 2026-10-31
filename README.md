# RADIO HORIZONTES FM 91.3 – AM 1440 · Versión 2

Sitio web de Radio Horizontes con Next.js 15.5.28, React 19 y TypeScript. Conserva los reproductores existentes de radio y televisión e incorpora clima de Sucre, cotización oficial del dólar BCB, calendario de feriados nacionales y enlaces oficiales a redes sociales.

## Novedades de la Versión 2

- Visualizador de audio con Web Audio API. Si el servidor de streaming no permite análisis por CORS, se mantiene la reproducción y se utiliza una animación alternativa.
- Clima actual de Sucre mediante Open-Meteo (actualización periódica).
- Cotización USD/BOB consultada desde una API pública que replica los datos publicados por el BCB; el sitio enlaza directamente al gráfico oficial del Banco Central. Si la cotización no está disponible, no inventa ni muestra un valor.
- Calendario mensual con el día actual y fechas de feriados nacionales 2026 marcadas como referencia.
- Facebook, YouTube y WhatsApp oficiales de Radio Horizontes.

## Ejecutar localmente

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Publicar en Vercel

1. Sube el contenido de esta carpeta directamente a la raíz del repositorio GitHub.
2. En Vercel importa el repositorio.
3. Deja Root Directory en `./` y Build Command `npm run build`.
4. Framework Preset: Next.js. Output Directory: predeterminado.
5. Configura las variables de entorno opcionales indicadas abajo y despliega.

## Variables de entorno

| Variable | Valor predeterminado |
|---|---|
| `NEXT_PUBLIC_RADIO_STREAM_URL` | `https://ares.disfrutaenlared.com:9060/stream` |
| `NEXT_PUBLIC_TV_STREAM_URL` | `https://ares.disfrutaenlared.com:1936/htv/htv/playlist.m3u8` |
| `NEXT_PUBLIC_TV_PLAYER_URL` | `https://ares.disfrutaenlared.com/VideoPlayer/htv` |
| `NEXT_PUBLIC_FACEBOOK_URL` | `https://www.facebook.com/RadioTvHorizontesSucre` |
| `NEXT_PUBLIC_YOUTUBE_URL` | `https://www.youtube.com/@horizontessucre` |
| `NEXT_PUBLIC_WHATSAPP_URL` | `https://wa.me/59172886676` |

La radio y la televisión dependen de que el servidor de streaming esté activo. El análisis real del audio requiere que el proveedor permita Web Audio/CORS; si no, se conserva la reproducción con visualización animada alternativa. La URL RTMP sirve para enviar señal al servidor, no para reproducirla en el navegador.
