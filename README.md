# RADIO HORIZONTES FM 91.3 – AM 1440

Sitio web de Radio Horizontes con Next.js 15, React 19 y TypeScript. Incluye reproductor de radio online, televisión HLS, diseño adaptable y el logotipo oficial entregado.

## Estructura

La raíz de este proyecto contiene directamente `app/`, `components/`, `public/` y `package.json`. No subas una carpeta contenedora adicional a GitHub.

## Ejecutar localmente

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Publicar en Vercel

1. Crea un repositorio vacío en GitHub.
2. Sube el CONTENIDO de esta carpeta directamente a la raíz del repositorio: `app`, `components`, `public`, `package.json` y los demás archivos.
3. En Vercel importa el repositorio.
4. En Settings → Build and Deployment deja Root Directory en `./`.
5. Framework Preset: Next.js. Build Command: `npm run build`. Output Directory: predeterminado.
6. Configura las variables de entorno y despliega.

## Variables de entorno

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_RADIO_STREAM_URL` | `https://ares.disfrutaenlared.com:9060/stream` |
| `NEXT_PUBLIC_TV_STREAM_URL` | `https://ares.disfrutaenlared.com:1936/htv/htv/playlist.m3u8` |
| `NEXT_PUBLIC_TV_PLAYER_URL` | `https://ares.disfrutaenlared.com/VideoPlayer/htv` |
| `NEXT_PUBLIC_FACEBOOK_URL` | `https://www.facebook.com/` |
| `NEXT_PUBLIC_WHATSAPP_URL` | `https://wa.me/` |

Tras modificar variables, realiza un nuevo Deploy. La reproducción depende de que el servidor de streaming esté activo y permita solicitudes desde el dominio web (CORS). La URL RTMP sirve para enviar señal al servidor, no para reproducirla en el navegador.
