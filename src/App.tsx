import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  CalendarDays,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  Play,
  X,
  Youtube,
} from 'lucide-react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { siteConfig, showreel } from './siteConfig';
import { driveThumbnailUrl, driveVideoPreviewUrl, useDriveMedia } from './useDriveMedia';
import type { DriveMediaFile } from './useDriveMedia';

const StageScene = lazy(() => import('./components/StageScene'));

const soundEras = [
  { number: '01', title: 'The forever songs', detail: 'Timeless classics. Still hits.' },
  { number: '02', title: 'The throwbacks', detail: '90s, 2000s, 2010s. You know the words.' },
  { number: '03', title: 'The right now', detail: 'Current favourites and songs on repeat.' },
];

const eventTypes = ['Cafe / restaurant', 'Private event', 'Public jam / community', 'Other live gig'];

function Eyebrow({ children }: { children: string }) {
  return <div className="eyebrow"><span className="eyebrow-line" />{children}</div>;
}

function BrandAtmosphere() {
  const notes = ['♪', '♫', '♬', '♪', '♩', '♫', '♪', '♬', '♫', '♩', '♪', '♫'];

  return (
    <>
      <div className="music-notes" aria-hidden="true">
        {notes.map((note, index) => <span className={`music-note note-${index + 1}`} key={index}>{note}</span>)}
      </div>
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['The sound', '#sound'], ['The band', '#band'], ['Live moments', '#live'], ['Bookings', '#booking']];

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="The Musketeers home" onClick={() => setOpen(false)}>
        <img className="wordmark-logo" src={siteConfig.logoUrl} alt="" />
        <span className="wordmark-name">THE MUSKETEERS<small>GURUGRAM KI LIVE BAND</small></span>
      </a>
      <button
        className="mobile-menu"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="main-navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav id="main-navigation" className={open ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a className="nav-book" href="#booking" onClick={() => setOpen(false)}>Book the band <ArrowUpRight size={15} /></a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <figure className="hero-logo-art">
        <img src={siteConfig.logoUrl} alt="The Musketeers illustrated band logo" />
        <figcaption>THE MUSKETEERS / GURUGRAM</figcaption>
      </figure>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-topline">
        <span>INDEPENDENT BAND · GURUGRAM</span>
        <span className="live-indicator"><i /> AVAILABLE FOR GIGS</span>
      </div>
      <div className="hero-copy">
        <div className="hero-kicker"><AudioLines size={16} /> CUTIE, YOUR NEXT FAVOURITE SONG IS LIVE</div>
        <h1>THE<br /><em>MUSKETEERS</em><span className="period">.</span></h1>
        <p className="hero-tagline">Good music.<br /><span>Questionable decisions.</span></p>
        <p className="hero-description">
          A live band from Gurugram playing the songs you grew up on, the ones you love now,
          and whatever gets the room singing.
        </p>
        <div className="hero-actions">
          <a href="#live" className="button button-light">Watch us play <Play size={15} fill="currentColor" /></a>
          <a href="#booking" className="text-link">Book the band <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="hero-art-note" aria-hidden="true"><span>NO GENRE LOYALTY</span><span>JUST GOOD TASTE</span></div>
      <a className="hero-bottom" href="#sound"><span>GURUGRAM · DELHI NCR</span><span>SCROLL A LITTLE <ArrowDown size={13} /></span></a>
    </section>
  );
}

const journeyMoments = [
  {
    number: '01',
    title: 'Find your corner.',
    detail: 'A familiar song starts up. The room settles in; the night is still unwritten.',
  },
  {
    number: '02',
    title: 'Catch the chorus.',
    detail: 'A few voices join in. Then the whole room remembers every word.',
  },
  {
    number: '03',
    title: 'Stay for one more.',
    detail: 'The last chord lands. Nobody seems especially ready to leave.',
  },
];

function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeMoment, setActiveMoment] = useState(0);
  const [wideViewport, setWideViewport] = useState(false);
  const [stageReady, setStageReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 901px)');
    const updateViewport = () => setWideViewport(viewport.matches);
    updateViewport();
    viewport.addEventListener('change', updateViewport);
    return () => viewport.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    const updateJourney = () => {
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const progress = scrollDistance > 0
        ? Math.max(0, Math.min(1, -bounds.top / scrollDistance))
        : 0;
      scrollYProgress.set(progress);
      const moment = Math.min(journeyMoments.length - 1, Math.floor(progress * journeyMoments.length));
      setActiveMoment((current) => current === moment ? current : moment);
      const shouldRenderStage = wideViewport && !reduceMotion && window.scrollY > 0 &&
        bounds.top < window.innerHeight + 160 && bounds.bottom > -160;
      setStageReady((ready) => ready === shouldRenderStage ? ready : shouldRenderStage);
    };
    updateJourney();
    window.addEventListener('scroll', updateJourney, { passive: true });
    window.addEventListener('resize', updateJourney);
    return () => {
      window.removeEventListener('scroll', updateJourney);
      window.removeEventListener('resize', updateJourney);
    };
  }, [reduceMotion, scrollYProgress, wideViewport]);

  const immersiveLayout = wideViewport && !reduceMotion;
  const showStage = immersiveLayout && stageReady;

  return (
    <section className={immersiveLayout ? 'journey' : 'journey journey-static'} id="journey" ref={sectionRef} aria-label="A journey through a night of live music">
      <div className="journey-sticky">
        {showStage ? (
          <Suspense fallback={<div className="journey-static-light" aria-hidden="true" />}>
            <StageScene progress={scrollYProgress} />
          </Suspense>
        ) : (
          <div className="journey-static-light" aria-hidden="true" />
        )}
        <div className="journey-topline">
          <Eyebrow>THE MUSKETEERS / LIVE</Eyebrow>
          <span>A LITTLE CLOSER WITH EVERY SCROLL</span>
        </div>
        <div className="journey-heading">
          <span>PSST, CUTIE — THE SHOW'S STARTING</span>
          <h2>Your favourite song<br /><em>is up next.</em></h2>
        </div>
        <div className="journey-story" aria-live="polite">
          {journeyMoments.map((moment, index) => (
            <article
              className={activeMoment === index ? 'journey-moment moment-active' : 'journey-moment'}
              key={moment.number}
              aria-hidden={immersiveLayout && activeMoment !== index}
            >
              <span className="journey-moment-number">A NIGHT IN THREE MOMENTS / {moment.number}</span>
              <h3>{moment.title}</h3>
              <p>{moment.detail}</p>
            </article>
          ))}
          <a href="#booking" className="journey-link">Bring us to your room <ArrowUpRight size={15} /></a>
        </div>
        <div className="journey-progress" aria-label={`Journey moment ${activeMoment + 1} of ${journeyMoments.length}`}>
          <span className="journey-progress-track"><motion.span className="journey-progress-fill" style={{ scaleY: scrollYProgress }} /></span>
          <div>{journeyMoments.map((moment, index) => (
            <span className={index <= activeMoment ? 'journey-progress-step step-active' : 'journey-progress-step'} key={moment.number}>
              {moment.number}
            </span>
          ))}</div>
        </div>
        <span className="journey-floor-note">GOOD MUSIC · CLOSE ROOMS · OPEN EARS</span>
      </div>
    </section>
  );
}

function Sound() {
  return (
    <section className="sound section-pad" id="sound">
      <div className="sound-intro">
        <Eyebrow>CUTIE, THIS ONE'S A THROWBACK</Eyebrow>
        <div>
          <h2>Your playlist.<br /><em>A few decades.</em></h2>
          <p>
            No genre loyalty. Just good taste. From the songs that never get old to the
            ones currently living rent-free in your head.
          </p>
        </div>
        <span className="sound-index">SIDE A<br />ALL THE GOOD STUFF</span>
      </div>
      <div className="era-list">
        {soundEras.map((era) => (
          <article className="era-card" key={era.number}>
            <span className="era-number">{era.number}</span>
            <h3>{era.title}</h3>
            <p>{era.detail}</p>
            <AudioLines size={19} aria-hidden="true" />
          </article>
        ))}
      </div>
      <div className="sound-foot"><span>CLASSICS · THROWBACKS · RIGHT NOW</span><span>THE MOOD PICKS THE SONG.</span></div>
    </section>
  );
}

function Band({ photos, loading, configured }: { photos: DriveMediaFile[]; loading: boolean; configured: boolean }) {
  const leadPhoto = photos[0];
  const additionalPhotos = photos.slice(1, 9);

  return (
    <section className="band section-pad" id="band">
      <div className="band-heading">
        <Eyebrow>YOUR NEW FAVOURITE BAND JUST PINGED</Eyebrow>
        <h2>Friends first.<br /><em>Very loud friends.</em></h2>
      </div>
      <div className="band-grid">
        {leadPhoto ? (
          <figure className="band-photo band-photo-real">
            <img src={driveThumbnailUrl(leadPhoto.id)} alt={leadPhoto.name} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
            <figcaption className="photo-index">{leadPhoto.name}</figcaption>
          </figure>
        ) : (
          <div className="band-photo" role="img" aria-label="Placeholder for an approved photo of The Musketeers">
            <div className="photo-orbit photo-orbit-one" />
            <div className="photo-orbit photo-orbit-two" />
            <AudioLines size={33} strokeWidth={1.2} />
            <span className="photo-caption">
              {loading ? 'LOADING PHOTOS FROM DRIVE' : configured ? 'ADD PHOTOS TO THE DRIVE FOLDER' : 'CONNECT DRIVE TO SHOW PHOTOS'}
            </span>
            <span className="photo-index">THE MUSKETEERS / GURUGRAM</span>
          </div>
        )}
        <div className="band-copy">
          <p>
            We’re a bunch of friends who like making music together. The chemistry is real;
            the group chat is mostly chaos. We’re putting the proper names, faces and
            instruments here as soon as they’re ready to meet the internet.
          </p>
          <div className="band-fact"><span>BASED IN</span><strong>Gurugram, India</strong></div>
          <div className="band-fact"><span>GOOD WITH</span><strong>Cafes, close rooms &amp; curious crowds</strong></div>
          <a href="#booking" className="underlined-link">Put us on a stage <ArrowUpRight size={15} /></a>
        </div>
        {additionalPhotos.length > 0 && (
          <div className="band-gallery" aria-label="More photos of The Musketeers">
            {additionalPhotos.map((photo) => (
              <a href={`https://drive.google.com/file/d/${encodeURIComponent(photo.id)}/view`} key={photo.id} target="_blank" rel="noreferrer" aria-label={`View ${photo.name} in Google Drive`}>
                <img src={driveThumbnailUrl(photo.id, 640)} alt={photo.name} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Live({ videos, photos, loading, error, configured }: {
  videos: DriveMediaFile[];
  photos: DriveMediaFile[];
  loading: boolean;
  error: string;
  configured: boolean;
}) {
  const [active, setActive] = useState<{ title: string; videoUrl: string } | null>(null);
  const clips = videos.length > 0
    ? videos.map((video) => ({
      id: video.id,
      title: video.name.replace(/\.[^.]+$/, ''),
      category: 'Live performance',
      videoUrl: driveVideoPreviewUrl(video.id),
    }))
    : showreel.map((item) => ({ ...item, id: item.title }));

  return (
    <section className="live-section section-pad" id="live">
      <div className="live-header">
        <div><Eyebrow>PING! YOUR SONG IS HAPPENING LIVE</Eyebrow><h2>From the group chat<br /><em>to the stage.</em></h2></div>
        <p>Small stages. Random crowds.<br />Core memories.</p>
      </div>
      <div className="reel-grid">
        {clips.map((item, index) => (
          <article className={`reel-card reel-${index + 1}`} key={item.id}>
            <div className="reel-visual">
              <span className="reel-stamp">{String(index + 1).padStart(2, '0')} / LIVE</span>
              <div className="sound-wave" aria-hidden="true">
                {Array.from({ length: 21 }, (_, bar) => (
                  <i key={bar} style={{ height: `${12 + ((bar * 13 + index * 19) % 57)}px` }} />
                ))}
              </div>
              {item.videoUrl ? (
                <button className="play-button" type="button" onClick={() => setActive({ title: item.title, videoUrl: item.videoUrl })} aria-label={`Play ${item.title}`}>
                  <Play size={17} fill="currentColor" />
                </button>
              ) : (
                <span className="reel-placeholder">{loading ? 'LOADING CLIPS FROM DRIVE' : 'ADD VIDEOS TO THE DRIVE FOLDER'}</span>
              )}
              <span className="reel-overlay" aria-hidden="true" />
            </div>
            <div className="reel-caption">
              <div><span>{item.category}</span><strong>{item.title}</strong></div>
              {item.videoUrl && <button type="button" onClick={() => setActive({ title: item.title, videoUrl: item.videoUrl })} aria-label={`Play ${item.title}`}><ArrowUpRight size={17} /></button>}
            </div>
          </article>
        ))}
      </div>
      {photos.length > 0 && (
        <div className="live-photo-strip" aria-label="More recent band photos">
          {photos.slice(0, 4).map((photo) => (
            <a href={`https://drive.google.com/file/d/${encodeURIComponent(photo.id)}/view`} key={photo.id} target="_blank" rel="noreferrer" aria-label={`View ${photo.name} in Google Drive`}>
              <img src={driveThumbnailUrl(photo.id, 640)} alt={photo.name} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
            </a>
          ))}
        </div>
      )}
      {error && <p className="media-note media-error" role="status">Couldn’t load the Drive folder: {error}</p>}
      {!configured && <p className="media-note">The Drive folder is selected, but this site build has no Drive API key. Add a restricted, read-only key and redeploy; photos already in the folder will appear after refresh.</p>}
      {configured && !loading && !error && videos.length === 0 && photos.length === 0 && (
        <p className="media-note">Drive folder connected — no photos or videos yet. Add media to this folder and it will appear here on the next refresh.</p>
      )}
      {active !== null && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
          <button type="button" aria-label="Close video" onClick={() => setActive(null)}><X /></button>
          <iframe src={active.videoUrl} title={active.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      )}
    </section>
  );
}

function Experience() {
  return (
    <section className="experience section-pad">
      <div><Eyebrow>YOUR EVENING JUST GOT A SOUNDTRACK</Eyebrow><h2>Not background music.<br /><em>You’re part of it.</em></h2></div>
      <div className="experience-copy">
        <p>
          Familiar songs have a way of turning a room into one big chorus. We read the
          room, move between eras, and leave space for the unexpected request (within
          reason; we are still human).
        </p>
        <div className="experience-tags"><span>VERSATILE SETS</span><span>ROOM FOR REQUESTS</span><span>GOOD COMPANY</span></div>
        <a href="#booking" className="underlined-link">Got a stage? We’ve got a set. <ArrowRight size={15} /></a>
      </div>
    </section>
  );
}

function Booking() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  function openDatePicker() {
    const dateInput = dateInputRef.current;
    if (!dateInput) return;

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker();
    } else {
      dateInput.focus();
      dateInput.click();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `Hi The Musketeers! I'd like to enquire about a ${eventType.toLowerCase()} gig.\n\nName: ${name}\nPreferred date: ${date || 'Flexible'}\nMy email: ${email}\n\nA little about it:\n${message}`;
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    setWhatsappLink(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    setCopyStatus('WhatsApp should open with your enquiry ready. Tap Send there to message us.');
  }

  return (
    <section className="booking section-pad" id="booking">
      <div className="booking-copy">
        <Eyebrow>CUTIE, GOT A STAGE FOR US?</Eyebrow>
        <h2>You bring the room.<br /><em>We’ll bring the set.</em></h2>
        <p>Cafes, restaurants, intimate gigs, public jams or a private gathering. Tell us what you have in mind; we’ll take it from there.</p>
        <div className="booking-aside"><CalendarDays size={19} /><span>Gurugram · Delhi NCR · nearby good rooms</span></div>
        <a className="contact-email" href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp the band</a>
        {siteConfig.bookingEmail && (
          <a
            className="contact-email"
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.bookingEmail)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Mail size={16} />{siteConfig.bookingEmail}
          </a>
        )}
      </div>
      <form className="booking-form" onSubmit={submit}>
        <div className="form-title"><span>THE USEFUL DETAILS</span><span>NO AWKWARD PITCH DECK</span></div>
        <label>Your name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="What should we call you?" autoComplete="name" /></label>
        <label>Your email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
        <div className="form-row">
          <label>What are you planning?
            <select value={eventType} onChange={(event) => setEventType(event.target.value)}>
              {eventTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            When? <span className="optional-label">(optional)</span>
            <span className="date-input-wrap">
              <input
                ref={dateInputRef}
                type="date"
                aria-label="Event date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
              <button className="date-picker-trigger" type="button" onClick={openDatePicker} aria-label="Open date picker">
                <CalendarDays size={16} aria-hidden="true" />
              </button>
            </span>
          </label>
        </div>
        <label>A little about it<textarea required rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Venue, city, vibe, anything we should know..." /></label>
        <button className="button button-light form-submit" type="submit">Prepare enquiry on WhatsApp <ArrowUpRight size={17} /></button>
        {copyStatus && <p className="form-status" role="status">{copyStatus}</p>}
        {whatsappLink && <p className="form-footnote">If WhatsApp didn’t open, <a href={whatsappLink} target="_blank" rel="noreferrer">open your prepared enquiry here</a>. You’ll send it from WhatsApp.</p>}
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-wordmark" href="#top">THE MUSKETEERS<span>®</span></a>
      <span className="footer-signoff">GOOD MUSIC. QUESTIONABLE DECISIONS.</span>
      <div className="footer-links">
        <a href="#top">BACK TO TOP ↑</a>
        {siteConfig.instagramUrl && <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={14} /> INSTAGRAM</a>}
        {siteConfig.youtubeUrl && <a href={siteConfig.youtubeUrl} target="_blank" rel="noreferrer"><Youtube size={14} /> YOUTUBE</a>}
      </div>
      <small>© {new Date().getFullYear()} The Musketeers · Gurugram, India</small>
    </footer>
  );
}

export default function App() {
  const media = useDriveMedia();

  useEffect(() => {
    const splash = document.getElementById('boot-splash');
    if (!splash) return;

    const hideTimer = window.setTimeout(() => {
      splash.classList.add('boot-splash-hidden');
      window.setTimeout(() => splash.remove(), 500);
    }, 850);

    return () => window.clearTimeout(hideTimer);
  }, []);

  return (
    <>
      <BrandAtmosphere />
      <Header />
      <main>
        <Hero />
        <Journey />
        <Sound />
        <Band photos={media.photos} loading={media.loading} configured={media.configured} />
        <Live
          videos={media.videos}
          photos={media.photos}
          loading={media.loading}
          error={media.error}
          configured={media.configured}
        />
        <Experience />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
