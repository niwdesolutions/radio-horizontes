"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const radioUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL || "https://ares.disfrutaenlared.com:9060/stream";
const tvUrl = process.env.NEXT_PUBLIC_TV_STREAM_URL || "https://ares.disfrutaenlared.com:1936/htv/htv/playlist.m3u8";
const tvPlayerUrl = process.env.NEXT_PUBLIC_TV_PLAYER_URL || "https://ares.disfrutaenlared.com/VideoPlayer/htv";
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/RadioTvHorizontesSucre";
const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@horizontessucre";
const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/59172886676";
const websiteUrl = "https://www.horizontes.com.bo";

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>;
}

function WeatherCard() {
  const [weather, setWeather] = useState<{ temperature: number; apparent: number; humidity: number; wind: number; code: number } | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const params = new URLSearchParams({
          latitude: "-19.0333",
          longitude: "-65.2627",
          current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
          timezone: "America/La_Paz",
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("weather");
        const data = await response.json();
        if (active && data.current) setWeather({
          temperature: data.current.temperature_2m,
          apparent: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          wind: data.current.wind_speed_10m,
          code: data.current.weather_code,
        });
      } catch { if (active) setWeatherError(true); }
    };
    load();
    const timer = window.setInterval(load, 30 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const weatherInfo = (code?: number) => {
    if (code === undefined) return { icon: "🌤️", label: "Consultando condiciones" };
    if (code === 0) return { icon: "☀️", label: "Despejado" };
    if ([1, 2].includes(code)) return { icon: "🌤️", label: "Parcialmente nublado" };
    if (code === 3) return { icon: "☁️", label: "Nublado" };
    if ([45, 48].includes(code)) return { icon: "🌫️", label: "Niebla" };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: "🌦️", label: "Llovizna" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: "🌧️", label: "Lluvia" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: "🌨️", label: "Nieve" };
    if ([95, 96, 99].includes(code)) return { icon: "⛈️", label: "Tormenta" };
    return { icon: "🌤️", label: "Condiciones actuales" };
  };
  const current = weatherInfo(weather?.code);

  return <article className="info-card weather-card weather-card-visual">
    <div className="info-card-top"><span className="mini-label">EL TIEMPO AHORA</span><span className="weather-location-pin">⌖</span></div>
    <div className="weather-city">SUCRE <em>· CHUQUISACA</em></div>
    {weather ? <>
      <div className="weather-main"><span className="weather-symbol" aria-hidden="true">{current.icon}</span><div className="weather-temperature">{Math.round(weather.temperature)}<span>°C</span></div></div>
      <div className="weather-condition">{current.label}</div>
      <div className="weather-metrics">
        <div><span> Sensación </span><strong>{Math.round(weather.apparent)}°</strong></div>
        <div><span>Humedad</span><strong>{Math.round(weather.humidity)}%</strong></div>
        <div><span>Viento</span><strong>{Math.round(weather.wind)} km/h</strong></div>
      </div>
    </> : <div className="weather-loading">{weatherError ? "No se pudo cargar el tiempo" : "Cargando temperatura…"}</div>}
    <a href="https://www.meteored.com.bo/tiempo-en_Sucre-America%2BSur-Bolivia-Chuquisaca--1-17635.html" target="_blank" rel="noreferrer" className="weather-forecast-link">Pronóstico completo · Meteored ↗</a>
    <small className="data-note">Temperatura actual estimada para Sucre · Fuente: Open-Meteo</small>
  </article>;
}

function SucreClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const time = now ? new Intl.DateTimeFormat("es-BO", { timeZone: "America/La_Paz", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now) : "--:--:--";
  const date = now ? new Intl.DateTimeFormat("es-BO", { timeZone: "America/La_Paz", weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(now) : "Hora de Bolivia";
  return <div className="sucre-clock" aria-label="Hora local de Sucre, Bolivia"><span className="clock-label">HORA LOCAL · SUCRE</span><strong>{time}</strong><span>{date} · UTC−4</span></div>;
}

function ExchangeCard() {
  const [exchange, setExchange] = useState<{ rate: number; updatedAt: string } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/exchange-rate", { cache: "no-store" });
        if (!response.ok) throw new Error("rate");
        const data = await response.json();
        if (active) setExchange({ rate: data.rate, updatedAt: data.updatedAt });
      } catch { if (active) setError(true); }
    };
    load();
    const timer = window.setInterval(load, 60 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  const date = exchange?.updatedAt ? new Date(exchange.updatedAt).toLocaleDateString("es-BO", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/La_Paz" }) : "";
  return <article className="info-card exchange-card"><div className="info-card-top"><span className="mini-label">REFERENCIA OFICIAL</span><span className="currency-mark">$</span></div><h3>Dólar <em>· Bolivia</em></h3>{exchange ? <><div className="exchange-value">Bs {exchange.rate.toFixed(2)}</div><p>Por cada 1 dólar estadounidense (USD)</p><div className="weather-foot"><span>Fecha de actualización</span><strong>{date}</strong></div></> : <p>{error ? "Cotización no disponible en este momento." : "Consultando cotización oficial…"}</p>}<a href="https://www.bcb.gob.bo/grafico_evolutivo/" target="_blank" rel="noreferrer" className="source-link">Fuente oficial · Banco Central de Bolivia ↗</a><small className="data-note">Dato oficial replicado desde fuentes públicas; puede existir demora de publicación.</small></article>;
}


function CalendarCard() {
  const [today, setToday] = useState(() => new Date());
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setToday(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();

  const holidays: Record<string, string> = {
    "2026-01-01": "Año Nuevo",
    "2026-01-22": "Día del Estado Plurinacional",
    "2026-02-16": "Carnaval",
    "2026-02-17": "Carnaval",
    "2026-04-03": "Viernes Santo",
    "2026-05-01": "Día del Trabajo",
    "2026-06-04": "Corpus Christi",
    "2026-06-21": "Año Nuevo Andino",
    "2026-08-06": "Día de la Independencia",
    "2026-11-02": "Día de Todos los Difuntos",
    "2026-12-25": "Navidad"
  };

  const dateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const monthName = month.toLocaleDateString("es-BO", {
    month: "long",
    year: "numeric"
  });

  return (
    <article className="info-card calendar-card">
      <div className="info-card-top">
        <span className="mini-label">AGENDA Y FECHAS</span>
        <span className="calendar-mark">▦</span>
      </div>

      <div className="calendar-heading">
        <h3>Calendario <em>Bolivia</em></h3>
        <div className="calendar-nav">
          <button
            aria-label="Mes anterior"
            onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
          >
            ‹
          </button>
          <button
            aria-label="Mes siguiente"
            onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
          >
            ›
          </button>
        </div>
      </div>

      <div className="month-label">
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </div>

      <div className="calendar-grid">
        {["D", "L", "M", "M", "J", "V", "S"].map((day, index) => (
          <span className="weekday" key={`${day}${index}`}>
            {day}
          </span>
        ))}

        {Array.from({ length: firstDay }, (_, index) => (
          <span key={`empty-${index}`} />
        ))}

        {Array.from({ length: days }, (_, index) => {
          const day = index + 1;
          const date = new Date(year, monthIndex, day);
          const key = dateKey(date);
          const holiday = holidays[key];
          const isToday = key === dateKey(today);

          const classes = [
            "calendar-day",
            isToday ? "today" : "",
            holiday ? "holiday" : ""
          ].filter(Boolean).join(" ");

          return (
            <span
              key={key}
              title={holiday || undefined}
              className={classes}
            >
              {day}
            </span>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span><i className="today-dot" /> Hoy</span>
        <span><i className="holiday-dot" /> Feriado nacional 2026</span>
      </div>

      <p className="data-note">
        Feriados nacionales referenciales. Las fechas trasladables deben
        confirmarse en el calendario oficial.
      </p>
    </article>
  );
}

export default function LiveDashboard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioVolume, setRadioVolume] = useState(0.8);
  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = radioVolume;
  }
}, [radioVolume]);
  const [tvPlaying, setTvPlaying] = useState(false);
  const [radioError, setRadioError] = useState("");
  const [tvError, setTvError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !tvUrl) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = tvUrl;
    else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(tvUrl); hls.attachMedia(video); hlsRef.current = hls;
      hls.on(Hls.Events.ERROR, (_event, data) => { if (data.fatal) setTvError("No se pudo cargar la señal de televisión. Verifica el enlace de streaming."); });
    } else setTvError("Este navegador no admite el formato de transmisión configurado.");
    return () => { hlsRef.current?.destroy(); hlsRef.current = null; };
  }, []);

  async function toggleRadio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (radioPlaying) { audio.pause(); return; }
    if (!radioUrl) { setRadioError("La señal todavía no está configurada. Agrega la URL de streaming en Vercel."); return; }
    try { setRadioError(""); await audio.play(); }
    catch { setRadioError("No fue posible iniciar la radio. Comprueba el enlace de transmisión."); }
  }

  async function toggleTv() {
    const video = videoRef.current; if (!video) return;
    if (tvPlaying) { video.pause(); setTvPlaying(false); return; }
    if (!tvUrl) { setTvError("La señal de TV todavía no está configurada. Agrega la URL de streaming en Vercel."); return; }
    try { setTvError(""); await video.play(); setTvPlaying(true); }
    catch { setTvError("No fue posible reproducir la señal. Verifica el enlace y su compatibilidad."); }
  }

  return (
    <main>
      <div className="topline"><span className="topline-dot" /> TRANSMISIÓN DIGITAL · SUCRE, BOLIVIA</div>
      <header className="header wrap">
        <a className="brand" href="/" aria-label="Radio Horizontes inicio"><img className="brand-logo" src="/logo-horizontes-v2.png" alt="Radio Horizontes FM 91.3 - AM 1440" /></a>
        <nav className="nav"><a href="#radio">RADIO EN VIVO</a><a href="#television">TELEVISIÓN</a><a href="#actualidad">ACTUALIDAD</a><a href="#contacto">CONTACTO</a></nav>
        <SucreClock />
        <a className="header-live" href="#radio"><span /> EN VIVO</a>
      </header>

      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> TU COMPAÑÍA, DONDE ESTÉS</div><h1>LA RADIO<br /><em>DE LOS ARTISTAS.</em></h1><p className="hero-text">La música, las voces y las historias que nos conectan. Sintoniza Horizontes FM 91.3 desde cualquier lugar.</p><div className="hero-actions"><a className="button button-red" href="#radio"><span className="button-play">▶</span> ESCUCHAR EN VIVO</a><a className="button button-outline" href="#television">VER TELEVISIÓN <span>↗</span></a></div><div className="hero-meta"><span className="signal-bars"><i/><i/><i/><i/><i/></span> TRANSMITIENDO PARA TI <b>·</b> 24/7</div></div>
        <div className="hero-art" aria-label="Logotipo oficial de Radio Horizontes"><img src="/logo-nuevo-usuario.jpeg" alt="Radio Horizontes FM 91.3 - AM 1440" /></div>
      </section>

      <section className="live-strip"><div className="wrap strip-inner"><span className="live-pill"><i /> EN DIRECTO</span><span>RADIO HORIZONTES FM 91.3</span><span className="strip-divider">/</span><span>LA RADIO DE LOS ARTISTAS</span><span className="strip-spacer" /><span className="strip-location">SUCRE · BOLIVIA</span></div></section>

      <section className="content wrap" id="radio"><div className="section-heading"><div><div className="eyebrow">SIEMPRE CONTIGO</div><h2>Escucha <em>en vivo</em></h2></div><span className="section-index">01 / RADIO</span></div>
<div className="radio-card">
  <div className={`radio-visual ${radioPlaying ? "playing" : ""}`}>
    <div className="radio-wave-ring">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>

    <img
      className="radio-logo-image"
      src="/logo-nuevo-usuario.jpeg"
      alt="Radio Horizontes"
    />

    <span className="visual-caption">HORIZONTES · EN VIVO</span>
  </div>
       
<div className="radio-controls">
  <div className="card-kicker">
    <span className="live-pill"><i /> EN VIVO</span>
    <span>RADIO ONLINE</span>
  </div>

  <h3>
    RADIO HORIZONTES<br />
    <em>FM 91.3 · AM 1440</em>
  </h3>

  <p>La radio de los artistas. Disfruta de nuestra programación estés donde estés.</p>

  <div className="now-playing">
    <span className="now-playing-label">AHORA EN HORIZONTES</span>
    <strong>Señal en directo</strong>
    <small>RADIO HORIZONTES FM 91.3 · AM 1440</small>
  </div>

  <div className={`radio-visualizer ${radioPlaying ? "playing" : ""}`}>
    {Array.from({ length: 24 }, (_, index) => (
      <span
        key={index}
        style={{ animationDelay: `${index * 0.07}s` }}
      />
    ))}
  </div>

  <div className="player-row">
    <button
      className="play-button"
      onClick={toggleRadio}
      aria-label={radioPlaying ? "Pausar radio" : "Reproducir radio"}
    >
      <PlayIcon playing={radioPlaying} />
    </button>

    <div className="player-status">
      <strong>{radioPlaying ? "REPRODUCIENDO" : "LISTO PARA ESCUCHAR"}</strong>
      <span>
        {radioPlaying
          ? "Estás conectado a la señal en vivo"
          : "Presiona reproducir para comenzar"}
      </span>
    </div>
  </div>

  <div className="radio-volume">
    <span>VOLUMEN</span>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={radioVolume}
      onChange={(event) => setRadioVolume(Number(event.target.value))}
      aria-label="Volumen de la radio"
    />
    <span>{Math.round(radioVolume * 100)}%</span>
  </div>

  {radioError && <p className="notice">{radioError}</p>}

  <audio
    ref={audioRef}
    src={radioUrl || undefined}
    preload="none"
    onPlay={() => {
      setRadioPlaying(true);
      setRadioError("");
    }}
    onPause={() => setRadioPlaying(false)}
    onError={() => {
      setRadioPlaying(false);
      setRadioError("No se pudo conectar con la señal de radio. Revisa la URL configurada.");
    }}
  />
</div>
</div>
      </section>

      <section className="content wrap tv-section" id="television"><div className="section-heading"><div><div className="eyebrow">IMAGEN Y SONIDO</div><h2>Horizontes <em>TV</em></h2></div><span className="section-index">02 / TELEVISIÓN</span></div><div className="tv-card"><div className="video-frame">{tvUrl ? <video ref={videoRef} playsInline controls onPlay={() => setTvPlaying(true)} onPause={() => setTvPlaying(false)} /> : <iframe className="tv-embed" src={tvPlayerUrl} title="Radio Horizontes TV en vivo" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}</div><div className="tv-info"><div><span className="section-index">HORIZONTES TV · ONLINE</span><h3>La experiencia<br/>también se <em>ve.</em></h3><p>Disfruta nuestra señal de televisión en vivo desde esta pantalla.</p></div><a className="button button-red tv-button" href={tvUrl || tvPlayerUrl} target="_blank" rel="noreferrer"><span className="button-play">↗</span> ABRIR SEÑAL TV</a></div>{tvError && <p className="notice tv-notice">{tvError}</p>}</div></section>

      <section className="content wrap info-section" id="actualidad"><div className="section-heading"><div><div className="eyebrow">INFORMACIÓN PARA TI</div><h2>Sucre <em>al día</em></h2></div><span className="section-index">03 / ACTUALIDAD</span></div><div className="info-grid"><WeatherCard/><ExchangeCard/><CalendarCard/></div></section>

      <section className="social-band"><div className="wrap social-inner"><div><div className="eyebrow">SIGUE CONECTADO</div><h2>Horizontes está <em>contigo.</em></h2><p>Noticias, transmisiones y toda nuestra comunidad en redes sociales.</p></div><div className="social-actions"><a href={facebookUrl} target="_blank" rel="noreferrer">FACEBOOK <span>↗</span></a><a href={youtubeUrl} target="_blank" rel="noreferrer">YOUTUBE <span>↗</span></a><a href={whatsappUrl} target="_blank" rel="noreferrer">WHATSAPP <span>↗</span></a></div></div></section>
      <section className="quote-section"><div className="wrap quote-inner"><span className="quote-mark">“</span><p>La música nos une.<br/><em>La radio nos acerca.</em></p><span className="quote-signature">RADIO HORIZONTES FM 91.3</span></div></section>
      <footer id="contacto"><div className="wrap footer-main"><div className="footer-brand"><img className="footer-logo" src="/logo-horizontes-v2.png" alt="Radio Horizontes FM 91.3" /></div><div className="footer-links"><a href={facebookUrl} target="_blank" rel="noreferrer">FACEBOOK ↗</a><a href={youtubeUrl} target="_blank" rel="noreferrer">YOUTUBE ↗</a><a href={whatsappUrl} target="_blank" rel="noreferrer">WHATSAPP ↗</a><a href={websiteUrl} target="_blank" rel="noreferrer">SITIO WEB ↗</a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} RADIO HORIZONTES FM 91.3 · AM 1440. TODOS LOS DERECHOS RESERVADOS.</span><span>SUCRE · BOLIVIA</span></div></footer>
    </main>
  );
}
