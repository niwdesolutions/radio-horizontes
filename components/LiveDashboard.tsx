"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const radioUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL || "https://ares.disfrutaenlared.com:9060/stream";
const tvUrl = process.env.NEXT_PUBLIC_TV_STREAM_URL || "https://ares.disfrutaenlared.com:1936/htv/htv/playlist.m3u8";
const tvPlayerUrl = process.env.NEXT_PUBLIC_TV_PLAYER_URL || "https://ares.disfrutaenlared.com/VideoPlayer/htv";
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/";
const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/";
const websiteUrl = "https://www.horizontes.com.bo";

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
  );
}

export default function LiveDashboard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [tvPlaying, setTvPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [radioError, setRadioError] = useState("");
  const [tvError, setTvError] = useState("");

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !tvUrl) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = tvUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(tvUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setTvError("No se pudo cargar la señal de televisión. Verifica el enlace de streaming.");
      });
    } else {
      setTvError("Este navegador no admite el formato de transmisión configurado.");
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, []);

  async function toggleRadio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (radioPlaying) {
      audio.pause();
      setRadioPlaying(false);
      return;
    }
    if (!radioUrl) {
      setRadioError("La señal todavía no está configurada. Agrega la URL de streaming en Vercel.");
      return;
    }
    try {
      setRadioError("");
      await audio.play();
      setRadioPlaying(true);
    } catch {
      setRadioError("No fue posible iniciar la radio. Comprueba el enlace de transmisión.");
    }
  }

  async function toggleTv() {
    const video = videoRef.current;
    if (!video) return;
    if (tvPlaying) {
      video.pause();
      setTvPlaying(false);
      return;
    }
    if (!tvUrl) {
      setTvError("La señal de TV todavía no está configurada. Agrega la URL de streaming en Vercel.");
      return;
    }
    try {
      setTvError("");
      await video.play();
      setTvPlaying(true);
    } catch {
      setTvError("No fue posible reproducir la señal. Verifica el enlace y su compatibilidad.");
    }
  }

  return (
    <main>
      <div className="topline"><span className="topline-dot" /> TRANSMISIÓN DIGITAL · SUCRE, BOLIVIA</div>
      <header className="header wrap">
        <a className="brand" href="/" aria-label="Radio Horizontes inicio">
          <img className="brand-logo" src="/logo-horizontes.jpeg" alt="Radio Horizontes FM 91.3 - AM 1440" />
        </a>
        <nav className="nav">
          <a href="#radio">RADIO EN VIVO</a>
          <a href="#television">TELEVISIÓN</a>
          <a href="#contacto">CONTACTO</a>
        </nav>
        <a className="header-live" href="#radio"><span /> EN VIVO</a>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> TU COMPAÑÍA, DONDE ESTÉS</div>
          <h1>LA RADIO<br /><em>DE LOS ARTISTAS.</em></h1>
          <p className="hero-text">La música, las voces y las historias que nos conectan. Sintoniza Horizontes FM 91.3 desde cualquier lugar.</p>
          <div className="hero-actions">
            <a className="button button-red" href="#radio"><span className="button-play">▶</span> ESCUCHAR EN VIVO</a>
            <a className="button button-outline" href="#television">VER TELEVISIÓN <span>↗</span></a>
          </div>
          <div className="hero-meta"><span className="signal-bars"><i/><i/><i/><i/><i/></span> TRANSMITIENDO PARA TI <b>·</b> 24/7</div>
        </div>
        <div className="hero-art" aria-label="Logotipo oficial de Radio Horizontes">
          <img src="/logo-horizontes.jpeg" alt="Radio Horizontes FM 91.3 - AM 1440" />
        </div>
      </section>

      <section className="live-strip">
        <div className="wrap strip-inner"><span className="live-pill"><i /> EN DIRECTO</span><span>RADIO HORIZONTES FM 91.3</span><span className="strip-divider">/</span><span>LA RADIO DE LOS ARTISTAS</span><span className="strip-spacer" /><span className="strip-location">SUCRE · BOLIVIA</span></div>
      </section>

      <section className="content wrap" id="radio">
        <div className="section-heading"><div><div className="eyebrow">SIEMPRE CONTIGO</div><h2>Escucha <em>en vivo</em></h2></div><span className="section-index">01 / RADIO</span></div>
        <div className="radio-card">
          <div className="radio-visual">
            <div className="equalizer"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
            <img className="radio-logo-image" src="/logo-horizontes.jpeg" alt="Radio Horizontes" />
            <span className="visual-caption">HORIZONTES · EN VIVO</span>
          </div>
          <div className="radio-controls">
            <div className="card-kicker"><span className="live-pill"><i /> EN VIVO</span><span>RADIO ONLINE</span></div>
            <h3>RADIO HORIZONTES<br /><em>FM 91.3</em></h3>
            <p>La radio de los artistas. Disfruta de nuestra programación estés donde estés.</p>
            <div className="player-row">
              <button className="play-button" onClick={toggleRadio} aria-label={radioPlaying ? "Pausar radio" : "Reproducir radio"}><PlayIcon playing={radioPlaying}/></button>
              <div className="player-status"><strong>{radioPlaying ? "REPRODUCIENDO" : "LISTO PARA ESCUCHAR"}</strong><span>{radioPlaying ? "Estás conectado a la señal en vivo" : "Presiona reproducir para comenzar"}</span></div>
            </div>
            <div className="volume-row"><span>VOL</span><input aria-label="Volumen de radio" type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))}/><span>{volume}%</span></div>
            {radioError && <p className="notice">{radioError}</p>}
            <audio ref={audioRef} src={radioUrl || undefined} preload="none" onPlay={() => setRadioPlaying(true)} onPause={() => setRadioPlaying(false)} onError={() => setRadioError("No se pudo conectar con la señal de radio. Revisa la URL configurada.")} />
          </div>
        </div>
      </section>

      <section className="content wrap tv-section" id="television">
        <div className="section-heading"><div><div className="eyebrow">IMAGEN Y SONIDO</div><h2>Horizontes <em>TV</em></h2></div><span className="section-index">02 / TELEVISIÓN</span></div>
        <div className="tv-card">
          <div className="video-frame">
            {tvUrl ? (
              <video ref={videoRef} playsInline controls onPlay={() => setTvPlaying(true)} onPause={() => setTvPlaying(false)} />
            ) : (
              <iframe
                className="tv-embed"
                src={tvPlayerUrl}
                title="Radio Horizontes TV en vivo"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
          </div>
          <div className="tv-info"><div><span className="section-index">HORIZONTES TV · ONLINE</span><h3>La experiencia<br/>también se <em>ve.</em></h3><p>Disfruta nuestra señal de televisión en vivo desde esta pantalla.</p></div><a className="button button-red tv-button" href={tvUrl} target="_blank" rel="noreferrer"><span className="button-play">↗</span> ABRIR SEÑAL TV</a></div>
          {tvError && <p className="notice tv-notice">{tvError}</p>}
        </div>
      </section>

      <section className="quote-section"><div className="wrap quote-inner"><span className="quote-mark">“</span><p>La música nos une.<br/><em>La radio nos acerca.</em></p><span className="quote-signature">RADIO HORIZONTES FM 91.3</span></div></section>

      <footer id="contacto">
        <div className="wrap footer-main">
          <div className="footer-brand"><img className="footer-logo" src="/logo-horizontes.jpeg" alt="Radio Horizontes FM 91.3" /></div>
          <div className="footer-links"><a href={facebookUrl} target="_blank" rel="noreferrer">FACEBOOK ↗</a><a href={whatsappUrl} target="_blank" rel="noreferrer">WHATSAPP ↗</a><a href={websiteUrl} target="_blank" rel="noreferrer">SITIO WEB ↗</a></div>
        </div>
        <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} RADIO HORIZONTES FM 91.3. TODOS LOS DERECHOS RESERVADOS.</span><span>SUCRE · BOLIVIA</span></div>
      </footer>
    </main>
  );
}
