import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Google Font injection ─────────────────────── */
function useFont() {
    useEffect(() => {
        const id = 'ads-google-fonts';
        if (document.getElementById(id)) return;
        const l = document.createElement('link');
        l.id = id; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap';
        document.head.appendChild(l);
    }, []);
}

/* ─── CSS injection ─────────────────────────────── */
const ADS_CSS = `
.ads-scroll-track {
  display:flex; gap:28px; overflow-x:auto;
  -webkit-overflow-scrolling:touch; scrollbar-width:none; cursor:grab; padding-right:64px;
}
.ads-scroll-track::-webkit-scrollbar { display:none; }
.ads-scroll-track:active { cursor:grabbing; }

.ads-card-active {
  box-shadow: 0 24px 64px rgba(0,0,0,.14), 0 6px 20px rgba(0,0,0,.08) !important;
  transform: translateY(-10px) scale(1.025) !important;
}
.ads-card-hover { transition: transform .35s cubic-bezier(.22,.68,0,1.2) !important; }
.ads-card-hover:hover { transform: translateY(-8px) !important; }

.ads-play-btn {
  width:68px; height:68px; border-radius:50%;
  background:rgba(255,255,255,.12); border:2px solid rgba(255,255,255,.35);
  display:flex; align-items:center; justify-content:center;
  backdrop-filter:blur(8px); cursor:pointer;
  transition:all .25s ease;
}
.ads-play-btn:hover { background:#C84B2F; border-color:#C84B2F; transform:scale(1.1); }

.ads-dot-btn {
  height:7px; border-radius:50%; border:none; background:#E5E7EB;
  cursor:pointer; padding:0; transition:all .3s cubic-bezier(.22,.68,0,1.2);
  width:7px;
}
.ads-dot-btn.dot-active {
  background:#C84B2F; width:22px; border-radius:4px;
}
.ads-dot-btn:hover:not(.dot-active) { background:#ccc; transform:scale(1.2); }

.ads-nav-btn {
  width:42px; height:42px; border-radius:50%; border:1.5px solid #E5E7EB;
  background:transparent; cursor:pointer; display:flex; align-items:center;
  justify-content:center; transition:all .2s ease; color:#1A1410;
}
.ads-nav-btn:hover { background:#1A1410; border-color:#1A1410; color:#fff; }

.ads-pulse-dot {
  width:7px; height:7px; border-radius:50%; background:#4A6741;
  animation:ads-pulse 1.6s ease-in-out infinite;
}
@keyframes ads-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:.4; transform:scale(.7); }
}
.ads-promo-bg { pointer-events:none; user-select:none;
  position:absolute; bottom:-30px; right:-20px;
  font-family:'Playfair Display',serif; font-size:11rem; font-weight:900;
  color:rgba(255,255,255,.07); line-height:1; }
`;

function useCSS() {
    useEffect(() => {
        const id = 'ads-carousel-css';
        if (document.getElementById(id)) return;
        const s = document.createElement('style');
        s.id = id; s.textContent = ADS_CSS;
        document.head.appendChild(s);
    }, []);
}

/* ─── Types ─────────────────────────────────────── */
export type AdCardType = 'video' | 'image' | 'wide' | 'promo';
export interface AdItem {
    _id?: string;
    card_type: AdCardType;
    eyebrow: string;
    title: string;
    description: string;
    media_url?: string;
    media_type?: 'image' | 'video';
    tag?: string;
    badge?: string;
    cta_text: string;
    cta_style: 'primary' | 'dark' | 'gold' | 'sage' | 'outline-light' | 'white';
    pills?: string[];
    color_scheme: 'dark' | 'light';
    bg_color?: string;
    duration?: string;
    wide_side?: 'dark' | 'light';
    promo_tag?: string;
    promo_stats?: { num: string; label: string }[];
    order: number;
    active?: boolean;
    show_cta?: boolean;
}

/* ─── Dummy data ─────────────────────────────────── */
const DUMMY: AdItem[] = [];


/* ─── BG colour map ─────────────────────────────── */
const BG_MAP: Record<string, string> = {
    blue: 'linear-gradient(135deg,#1a2744 0%,#2c4a7c 100%)',
    green: 'linear-gradient(135deg,#1a3322 0%,#2d6645 100%)',
    amber: 'linear-gradient(135deg,#3d2200 0%,#8a5200 100%)',
    purple: 'linear-gradient(135deg,#1e0a3c 0%,#4a1a7c 100%)',
    teal: 'linear-gradient(135deg,#062233 0%,#0e5a70 100%)',
    rose: 'linear-gradient(135deg,#3d0a0a 0%,#7c2020 100%)',
    'soft-blue': '#d0dff5',
    'soft-green': '#d0e8d5',
    'soft-amber': '#f5e8c8',
};

function bgStyle(color?: string): React.CSSProperties {
    if (!color) return { background: '#1a1410' };
    const val = BG_MAP[color] || '#1a1410';
    return val.startsWith('linear') ? { backgroundImage: val } : { background: val };
}

/* ─── CTA button ────────────────────────────────── */
const CTA_STYLES: Record<string, React.CSSProperties> = {
    primary: { background: '#C84B2F', color: '#fff' },
    dark: { background: '#1A1410', color: '#FFFFFF' },
    gold: { background: '#D4A847', color: '#1A1410' },
    sage: { background: '#4A6741', color: '#fff' },
    'outline-light': { background: 'transparent', border: '1px solid rgba(255,255,255,.35)', color: 'rgba(255,255,255,.85)' },
    white: { background: '#FFFFFF', color: '#C84B2F', fontWeight: 600 },
};
function CtaBtn({ text, style: s = 'primary', fullWidth = false }: { text: string; style?: string; fullWidth?: boolean }) {
    return (
        <button style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: '.75rem', fontWeight: 500,
            letterSpacing: '.08em', textTransform: 'uppercase', padding: '9px 18px', borderRadius: 2,
            border: 'none', cursor: 'pointer', marginTop: 'auto', width: fullWidth ? '100%' : 'fit-content',
            ...CTA_STYLES[s]
        }}>
            {text}
        </button>
    );
}

/* ─── Card components ──────────────────────────── */
function VideoCard({ ad }: { ad: AdItem }) {
    const isVideo = ad.media_type === 'video';
    return (
        <div className="ads-card-hover" style={{
            flex: '0 0 500px', height: 380,
            borderRadius: 4, overflow: 'hidden', display: 'grid', gridTemplateColumns: '40% 60%',
            background: '#1A1410'
        }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {isVideo ? (
                    <video src={ad.media_url} autoPlay loop muted playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                    <div style={{
                        ...bgStyle(ad.bg_color), height: '100%', minHeight: 280, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div className="ads-play-btn">
                            <svg width={20} height={22} viewBox="0 0 20 22" fill="white"><path d="M1 1L19 11L1 21V1Z" /></svg>
                        </div>
                    </div>
                )}
                {!isVideo && <div style={{
                    ...bgStyle(ad.bg_color), position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="ads-play-btn">
                        <svg width={20} height={22} viewBox="0 0 20 22" fill="white"><path d="M1 1L19 11L1 21V1Z" /></svg>
                    </div>
                </div>}
                {ad.tag && <div style={{
                    position: 'absolute', top: 20, left: 20, background: '#C84B2F',
                    color: '#fff', fontSize: '.68rem', fontWeight: 500, letterSpacing: '.12em',
                    textTransform: 'uppercase', padding: '5px 12px', borderRadius: 2
                }}>{ad.tag}</div>}
                {ad.duration && <div style={{
                    position: 'absolute', bottom: 16, right: 16,
                    background: 'rgba(0,0,0,.7)', color: '#fff', fontSize: '.72rem',
                    padding: '3px 8px', borderRadius: 2, letterSpacing: '.05em'
                }}>{ad.duration}</div>}
            </div>
            <div style={{
                padding: '18px 20px 20px', background: ad.bg_color === 'rose' ? '#2C3E50' : '#1A1410',
                color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10
            }}>
                <div style={{
                    fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase',
                    color: '#D4A847', fontWeight: 500
                }}>{ad.eyebrow}</div>
                <h3 style={{
                    fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', fontWeight: 700,
                    lineHeight: 1.3, letterSpacing: '-.01em', margin: 0
                }}>{ad.title}</h3>
                <p style={{
                    fontSize: '.75rem', lineHeight: 1.6, color: 'rgba(250,247,242,.65)',
                    fontWeight: 300, margin: 0
                }}>{ad.description}</p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {ad.pills?.map(p => <span key={p} style={{
                            fontSize: '.65rem', letterSpacing: '.08em',
                            textTransform: 'uppercase', padding: '4px 9px', borderRadius: 2, fontWeight: 500,
                            border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.6)'
                        }}>{p}</span>)}
                    </div>
                    {ad.show_cta !== false && <CtaBtn text={ad.cta_text} style={ad.cta_style} />}
                </div>
            </div>
        </div>
    );
}

function ImageCard({ ad }: { ad: AdItem }) {
    return (
        <div className="ads-card-hover" style={{
            flex: '0 0 500px', height: 380,
            borderRadius: 4, overflow: 'hidden', display: 'grid', gridTemplateColumns: '40% 60%',
            background: '#fff', border: '1px solid #E5E7EB'
        }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {ad.media_url ? (
                    <img src={ad.media_url} alt={ad.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                    <div style={{
                        ...bgStyle(ad.bg_color), height: '100%', minHeight: 230,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.3rem'
                    }}>🎨</div>
                )}
                {ad.badge && <div style={{
                    position: 'absolute', top: 20, right: 20, background: '#fff',
                    color: '#1A1410', fontSize: '.65rem', fontWeight: 500, letterSpacing: '.12em',
                    textTransform: 'uppercase', padding: '5px 11px', borderRadius: 20,
                    border: '1px solid #E5E7EB'
                }}>{ad.badge}</div>}
            </div>
            <div style={{
                padding: '18px 20px 20px', background: '#fff', color: '#1A1410',
                display: 'flex', flexDirection: 'column', gap: 10
            }}>
                <div style={{
                    fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase',
                    color: '#4A6741', fontWeight: 500
                }}>{ad.eyebrow}</div>
                <h3 style={{
                    fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', fontWeight: 700,
                    lineHeight: 1.3, letterSpacing: '-.01em', margin: 0
                }}>{ad.title}</h3>
                <p style={{ fontSize: '.75rem', lineHeight: 1.6, color: '#666', fontWeight: 300, margin: 0 }}>
                    {ad.description}</p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {ad.pills?.map(p => <span key={p} style={{
                            fontSize: '.65rem', letterSpacing: '.08em',
                            textTransform: 'uppercase', padding: '4px 9px', borderRadius: 2, fontWeight: 500,
                            border: '1px solid #ccc', color: '#555'
                        }}>{p}</span>)}
                    </div>
                    {ad.show_cta !== false && <CtaBtn text={ad.cta_text} style={ad.cta_style} />}
                </div>
            </div>
        </div>
    );
}

function WideCard({ ad }: { ad: AdItem }) {
    const isDark = ad.wide_side !== 'light';
    const isVideo = ad.media_type === 'video';
    return (
        <div className="ads-card-hover" style={{
            flex: '0 0 480px', height: 380,
            borderRadius: 4, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr'
        }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {isVideo ? (
                    <video src={ad.media_url} autoPlay loop muted playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : ad.media_url ? (
                    <img src={ad.media_url} alt={ad.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                    <div style={{
                        ...bgStyle(ad.bg_color), height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                    }}>
                        <div className="ads-play-btn">
                            <svg width={20} height={22} viewBox="0 0 20 22" fill="white"><path d="M1 1L19 11L1 21V1Z" /></svg>
                        </div>
                    </div>
                )}
                {ad.tag && <div style={{
                    position: 'absolute', top: 20, left: 20, background: '#C84B2F',
                    color: '#fff', fontSize: '.68rem', fontWeight: 500, letterSpacing: '.12em',
                    textTransform: 'uppercase', padding: '5px 12px', borderRadius: 2
                }}>{ad.tag}</div>}
                {ad.duration && <div style={{
                    position: 'absolute', bottom: 16, right: 16,
                    background: 'rgba(0,0,0,.7)', color: '#fff', fontSize: '.72rem',
                    padding: '3px 8px', borderRadius: 2
                }}>{ad.duration}</div>}
            </div>
            <div style={{
                padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 10,
                background: isDark ? '#2C3E50' : '#fff', color: isDark ? '#FFFFFF' : '#1A1410'
            }}>
                <div style={{
                    fontSize: '.68rem', letterSpacing: '.16em', textTransform: 'uppercase',
                    fontWeight: 500, color: isDark ? '#D4A847' : '#C84B2F'
                }}>{ad.eyebrow}</div>
                <h3 style={{
                    fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', lineHeight: 1.25,
                    fontWeight: 700, letterSpacing: '-.02em', margin: 0
                }}>{ad.title}</h3>
                <p style={{
                    fontSize: '.78rem', lineHeight: 1.65, fontWeight: 300, margin: 0,
                    color: isDark ? 'rgba(250,247,242,.6)' : '#666'
                }}>{ad.description}</p>
                {ad.show_cta !== false && <CtaBtn text={ad.cta_text} style={ad.cta_style} />}
            </div>
        </div>
    );
}

function PromoCard({ ad }: { ad: AdItem }) {
    return (
        <div className="ads-card-hover" style={{
            flex: '0 0 290px', height: 380,
            background: '#C84B2F', color: '#FFFFFF', padding: '24px 22px', display: 'flex',
            flexDirection: 'column', justifyContent: 'space-between', borderRadius: 4,
            position: 'relative', overflow: 'hidden'
        }}>
            <div>
                {ad.promo_tag && <div style={{
                    display: 'inline-block', background: 'rgba(255,255,255,.15)',
                    fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase',
                    padding: '5px 12px', borderRadius: 2, marginBottom: 20
                }}>{ad.promo_tag}</div>}
                <h3 style={{
                    fontFamily: "'Playfair Display',serif", fontSize: '1.7rem', fontWeight: 900,
                    lineHeight: 1.1, letterSpacing: '-.03em', margin: 0
                }}>{ad.title}</h3>
                {ad.promo_stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                        {ad.promo_stats.map(s => (
                            <div key={s.label}>
                                <div style={{
                                    fontFamily: "'Playfair Display',serif", fontSize: '2rem',
                                    fontWeight: 700, lineHeight: 1
                                }}>{s.num}</div>
                                <div style={{
                                    fontSize: '.72rem', letterSpacing: '.08em', textTransform: 'uppercase',
                                    opacity: .7, marginTop: 3, fontWeight: 300
                                }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {ad.show_cta !== false && <CtaBtn text={ad.cta_text} style="white" fullWidth />}
            <div className="ads-promo-bg">∞</div>
        </div>
    );
}

function renderCard(ad: AdItem, idx: number) {
    switch (ad.card_type) {
        case 'video': return <VideoCard key={idx} ad={ad} />;
        case 'image': return <ImageCard key={idx} ad={ad} />;
        case 'wide': return <WideCard key={idx} ad={ad} />;
        case 'promo': return <PromoCard key={idx} ad={ad} />;
        default: return <ImageCard key={idx} ad={ad} />;
    }
}

/* ─── easeOutQuint ──────────────────────────────── */
function easeOutQuint(t: number) { return 1 - Math.pow(1 - t, 5); }

/* ─── Main carousel ─────────────────────────────── */
export default function AdsCarousel() {
    useFont();
    useCSS();

    const [ads, setAds] = useState<AdItem[]>([]);
    const [current, setCurrent] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const autoRef = useRef<number>(0);
    const pausedRef = useRef(false);
    const currentRef = useRef(0);
    const DWELL = 2200;
    const SPEED = 900;

    /* fetch live data */
    useEffect(() => {
        fetch('http://localhost:8000/api/ads')
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setAds(data.sort((a, b) => a.order - b.order)); })
            .catch(() => {/* use dummy */ });
    }, []);

    /* collect card refs after render */
    const getCards = useCallback(() =>
        Array.from(trackRef.current?.querySelectorAll<HTMLElement>('.ads-card-hover,.ads-card-active') ?? []), []);


    const scrollToCard = useCallback((idx: number) => {
        const cards = getCards();
        if (!cards.length || !trackRef.current) return;
        const safeIdx = ((idx % cards.length) + cards.length) % cards.length;
        currentRef.current = safeIdx;
        setCurrent(safeIdx);
        // smooth scroll
        const card = cards[safeIdx];
        trackRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }, [getCards]);

    const startContinuousScroll = useCallback(() => {
        if (autoRef.current) cancelAnimationFrame(autoRef.current);
        const step = () => {
            if (!pausedRef.current && trackRef.current) {
                const max = trackRef.current.scrollWidth - trackRef.current.clientWidth;
                if (trackRef.current.scrollLeft >= max - 2) {
                    trackRef.current.scrollTo({ left: 0, behavior: 'smooth' }); // Loop back
                    setTimeout(() => { if (!pausedRef.current) autoRef.current = requestAnimationFrame(step); }, 800);
                    return;
                } else {
                    trackRef.current.scrollLeft += 1; // Smooth linear scroll velocity
                }
            }
            autoRef.current = requestAnimationFrame(step);
        };
        autoRef.current = requestAnimationFrame(step);
    }, []);

    const pause = useCallback((resumeMs = 3500) => {
        pausedRef.current = true;
        setTimeout(() => { pausedRef.current = false; }, resumeMs);
    }, []);

    /* kickstart auto scroll on mount */
    useEffect(() => {
        // give it a second to render
        const t = setTimeout(() => startContinuousScroll(), 1000);
        return () => { clearTimeout(t); if (autoRef.current) cancelAnimationFrame(autoRef.current); };
    }, [startContinuousScroll]);

    /* cleanup on unmount */
    useEffect(() => () => { if (autoRef.current) cancelAnimationFrame(autoRef.current); }, []);

    /* drag scroll */
    const dragRef = useRef({ down: false, startX: 0, scrollLeft: 0 });
    const onMouseDown = (e: React.MouseEvent) => {
        if (!trackRef.current) return;
        dragRef.current = { down: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft };
        pause(5000);
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragRef.current.down || !trackRef.current) return;
        e.preventDefault();
        trackRef.current.scrollLeft = dragRef.current.scrollLeft - (e.pageX - (trackRef.current.offsetLeft) - dragRef.current.startX) * 1.4;
    };
    const onMouseUp = () => {
        dragRef.current.down = false;
        const cards = getCards();
        let nearest = 0, minD = Infinity;
        cards.forEach((c, i) => {
            const d = Math.abs(c.offsetLeft - 64 - (trackRef.current?.scrollLeft ?? 0));
            if (d < minD) { minD = d; nearest = i; }
        });
        scrollToCard(nearest);
    };

    if (ads.length === 0) return null;

    return (
        <section style={{ background: '#fff', fontFamily: "'DM Sans',sans-serif", color: '#1A1410', overflow: 'hidden' }}>


            {/* Scroll section without side buttons */}
            <div style={{ width: '100%', padding: '28px 0 0 24px', position: 'relative' }}>
                {/* Track */}
                <div
                    ref={trackRef}
                    className="ads-scroll-track"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={() => { dragRef.current.down = false; }}
                    onMouseEnter={() => pause(3000)}
                    onTouchStart={e => { dragRef.current.startX = e.touches[0].clientX; pause(5000); }}
                    onTouchEnd={e => {
                        const dx = dragRef.current.startX - e.changedTouches[0].clientX;
                        scrollToCard(currentRef.current + (Math.abs(dx) > 50 ? (dx > 0 ? 1 : -1) : 0));
                    }}
                >
                    {ads.map((ad, i) => renderCard(ad, i))}
                </div>
            </div>

            {/* Bottom Controls Area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 24px 48px' }}>


                {/* Centered Navigation Buttons */}
                <div style={{ display: 'flex', gap: 16 }}>
                    <button className="ads-nav-btn" aria-label="Previous"
                        onClick={() => { pause(4000); scrollToCard(currentRef.current - 1); }}>
                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="ads-nav-btn" aria-label="Next"
                        onClick={() => { pause(4000); scrollToCard(currentRef.current + 1); }}>
                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
