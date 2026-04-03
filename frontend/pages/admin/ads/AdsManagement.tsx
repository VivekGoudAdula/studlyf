import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Plus, Trash2, Eye, EyeOff, Edit3, Upload, X, GripVertical, ImageIcon, Film, Check } from 'lucide-react';
import { AdItem, AdCardType, renderCard, useFont, useCSS } from '../../../components/AdsCarousel';

import { API_BASE_URL } from '../../../apiConfig';

const API = `${API_BASE_URL}/api/ads`;

const CARD_TYPES: { value: AdCardType; label: string; desc: string }[] = [
    { value: 'video', label: '🎬 Video Card', desc: 'Dark card with video/image + text below' },
    { value: 'image', label: '🖼 Image Card', desc: 'Light card with image + text below' },
    { value: 'wide', label: '⬛ Wide Card', desc: 'Double-width: media left + text right' },
    { value: 'promo', label: '⚡ Promo Card', desc: 'Full coloured promo with stats' },
];

const CTA_STYLES = ['primary', 'dark', 'gold', 'sage', 'outline-light', 'white'];
const BG_COLORS = ['blue', 'green', 'amber', 'purple', 'teal', 'rose', 'soft-blue', 'soft-green', 'soft-amber'];
const COLOR_SCHEMES = ['dark', 'light'];

const EMPTY: Partial<AdItem> = {
    card_type: 'image', eyebrow: '', title: '', description: '', media_type: 'image',
    tag: '', badge: '', cta_text: 'Enroll →', cta_style: 'primary', pills: [],
    color_scheme: 'dark', bg_color: 'blue', duration: '', wide_side: 'dark',
    promo_tag: '', promo_stats: [], order: 0, active: true,
};

function getYoutubeEmbed(url?: string | null) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0` : null;
}

/* ── Media dropper ── */
function MediaDropper({ preview, mediaType, onFile, onClear }:
    { preview: string | null; mediaType: string; onFile: (f: File) => void; onClear: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [drag, setDrag] = useState(false);

    const handle = (f: File) => { onFile(f); };

    return (
        <div style={{ width: '100%' }}>
            {preview ? (
                <div style={{
                    position: 'relative', borderRadius: 6, overflow: 'hidden',
                    border: '2px solid #e5e7eb', height: 220
                }}>
                    {(mediaType === 'video' || getYoutubeEmbed(preview) || preview?.match(/\.(mp4|webm|mov|ogg)$/i)) ? (
                        getYoutubeEmbed(preview) ? (
                            <iframe 
                                src={getYoutubeEmbed(preview)!} 
                                style={{ width: '100%', height: '100%', border: 'none' }} 
                                allow="autoplay; encrypted-media" 
                            />
                        ) : (
                            <video src={preview!} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )
                    ) : (
                        <img src={preview!} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <button onClick={onClear}
                        style={{
                            position: 'absolute', top: 8, right: 8, background: '#fff',
                            border: 'none', borderRadius: 999, width: 28, height: 28, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,.2)'
                        }}>
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
                    style={{
                        border: `2px dashed ${drag ? '#6366f1' : '#d1d5db'}`,
                        borderRadius: 8, height: 220, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer',
                        background: drag ? '#f5f3ff' : '#fafafa', transition: 'all .2s',
                    }}>
                    <Upload size={32} color={drag ? '#6366f1' : '#9ca3af'} />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                            Drop file here or click
                        </p>
                        <p style={{ fontSize: 12, color: '#9ca3af' }}>
                            Images: JPG, PNG, GIF, WebP · Videos: MP4, WebM, MOV
                        </p>
                    </div>
                    <button style={{
                        background: '#6366f1', color: '#fff', border: 'none',
                        borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 500, fontSize: 13
                    }}>
                        Choose File
                    </button>
                </div>
            )}
            <input ref={inputRef} type="file" accept="image/*,video/*" hidden
                onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); }} />
        </div>
    );
}

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
            marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em'
        }}>{label}</label>
        {children}
    </div>
);

/* ── Form panel ── */
function AdForm({ initial, onSave, onCancel, saving }:
    {
        initial: Partial<AdItem>; onSave: (fd: FormData, existing: Partial<AdItem>) => void;
        onCancel: () => void; saving: boolean
    }) {
    const [form, setForm] = useState<Partial<AdItem>>({ ...EMPTY, ...initial });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial.media_url || null);
    const [pillInput, setPillInput] = useState('');
    const [statInput, setStatInput] = useState({ num: '', label: '' });

    const set = (k: keyof AdItem, v: any) => setForm(f => {
        const next = { ...f, [k]: v };
        if (k === 'media_url' && v) {
            const isVid = getYoutubeEmbed(v) || v.match(/\.(mp4|webm|mov|ogg)$/i);
            if (isVid) next.media_type = 'video';
            else next.media_type = 'image';
        }
        return next;
    });

    const handleFile = (f: File) => {
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview(url);
        set('media_type', f.type.startsWith('video') ? 'video' : 'image');
    };

    const addPill = () => {
        if (!pillInput.trim()) return;
        set('pills', [...(form.pills || []), pillInput.trim()]);
        setPillInput('');
    };

    const removePill = (i: number) => set('pills', (form.pills || []).filter((_, idx) => idx !== i));

    const addStat = () => {
        if (!statInput.num || !statInput.label) return;
        set('promo_stats', [...(form.promo_stats || []), { ...statInput }]);
        setStatInput({ num: '', label: '' });
    };

    const removeStat = (i: number) =>
        set('promo_stats', (form.promo_stats || []).filter((_, idx) => idx !== i));

    const handleSubmit = () => {
        const fd = new FormData();
        const str = (v: any) => (v === undefined || v === null) ? '' : String(v);
        fd.append('card_type', str(form.card_type));
        fd.append('eyebrow', str(form.eyebrow));
        fd.append('title', str(form.title));
        fd.append('description', str(form.description));
        fd.append('media_type', str(form.media_type));
        fd.append('media_url', str(form.media_url || ''));
        fd.append('tag', str(form.tag));
        fd.append('badge', str(form.badge));
        fd.append('cta_text', str(form.cta_text));
        fd.append('cta_style', str(form.cta_style));
        fd.append('pills', JSON.stringify(form.pills || []));
        fd.append('color_scheme', str(form.color_scheme));
        fd.append('bg_color', str(form.bg_color));
        fd.append('duration', str(form.duration));
        fd.append('wide_side', str(form.wide_side));
        fd.append('promo_tag', str(form.promo_tag));
        fd.append('promo_stats', JSON.stringify(form.promo_stats || []));
        fd.append('order', str(form.order));
        fd.append('active', String(form.active !== false));
        fd.append('show_cta', String(form.show_cta !== false));
        if (file) fd.append('media_file', file);
        onSave(fd, form);
    };



    const input = (k: keyof AdItem, ph = '', type = 'text') => (
        <input type={type} placeholder={ph} value={String(form[k] ?? '')}
            onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
            style={{
                width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
                borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box'
            }} />
    );

    const select = (k: keyof AdItem, options: string[]) => (
        <select value={String(form[k] ?? '')} onChange={e => set(k, e.target.value)}
            style={{
                width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
                borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff'
            }}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            {/* LEFT: Media upload */}
            <div>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#111' }}>Media Upload</h3>
                <MediaDropper preview={preview || form.media_url} mediaType={form.media_type || 'image'}
                    onFile={handleFile} onClear={() => { setFile(null); setPreview(null); set('media_url', ''); }} />

                <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 4, display: 'block' }}>Or Paste Media Link (URL)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {input('media_url', 'https://example.com/image.jpg')}
                    </div>
                </div>

                {(preview || (form.media_url && !file)) && (
                    <div style={{
                        marginTop: 12, padding: '8px 12px', background: form.media_type === 'video' ? '#f0fdf4' : '#eff6ff',
                        borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12
                    }}>
                        {form.media_type === 'video' ? <Film size={14} color="#16a34a" /> : <ImageIcon size={14} color="#2563eb" />}
                        <span>{form.media_type === 'video' ? 'Video asset active' : 'Image asset active'}</span>
                    </div>
                )}

                <div style={{ marginTop: 24 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#111' }}>Card Type</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {CARD_TYPES.map(ct => (
                            <div key={ct.value}
                                onClick={() => set('card_type', ct.value)}
                                style={{
                                    padding: '10px 14px', border: `2px solid ${form.card_type === ct.value ? '#6366f1' : '#e5e7eb'}`,
                                    borderRadius: 8, cursor: 'pointer', background: form.card_type === ct.value ? '#f5f3ff' : '#fff',
                                    transition: 'all .2s'
                                }}>
                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{ct.label}</div>
                                <div style={{ fontSize: 11, color: '#9ca3af' }}>{ct.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {form.card_type === 'promo' && (
                    <div style={{ marginTop: 24 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 12, color: '#111' }}>Stats</h3>
                        {(form.promo_stats || []).map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{
                                    flex: 1, padding: '6px 10px', background: '#f3f4f6',
                                    borderRadius: 6, fontSize: 12
                                }}>{s.num} — {s.label}</span>
                                <button onClick={() => removeStat(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            <input placeholder="99k+" value={statInput.num} onChange={e => setStatInput(s => ({ ...s, num: e.target.value }))}
                                style={{ flex: 1, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }} />
                            <input placeholder="Label" value={statInput.label} onChange={e => setStatInput(s => ({ ...s, label: e.target.value }))}
                                style={{ flex: 2, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }} />
                            <button onClick={addStat} style={{
                                padding: '6px 12px', background: '#6366f1', color: '#fff',
                                border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
                            }}>+</button>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: Form fields */}
            <div>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#111' }}>Card Details</h3>

                <F label="Eyebrow / Category">{input('eyebrow', 'e.g. Data Science')}</F>
                <F label="Title *">{input('title', 'e.g. Machine Learning A–Z')}</F>
                <F label="Media Content Type">{select('media_type', ['image', 'video'])}</F>
                <F label="Description">
                    <textarea value={String(form.description ?? '')} placeholder="Short description..."
                        onChange={e => set('description', e.target.value)} rows={3}
                        style={{
                            width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
                            borderRadius: 6, fontSize: 13, resize: 'vertical', boxSizing: 'border-box'
                        }} />
                </F>

                {form.card_type !== 'promo' && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div
                                onClick={() => set('show_cta', form.show_cta === false ? true : false)}
                                style={{
                                    width: 36, height: 20, borderRadius: 20, background: form.show_cta !== false ? '#6366f1' : '#e5e7eb',
                                    position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                <div style={{
                                    width: 16, height: 16, borderRadius: '50%', background: '#fff',
                                    position: 'absolute', top: 2, left: form.show_cta !== false ? 18 : 2, transition: 'all 0.2s'
                                }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Show CTA Button</span>
                        </div>
                        {form.show_cta !== false && <F label="CTA Button Text">{input('cta_text', 'e.g. Enroll →')}</F>}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                            <div>
                                <label style={{
                                    display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
                                    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em'
                                }}>CTA Style</label>
                                {select('cta_style', CTA_STYLES)}
                            </div>
                            <div>
                                <label style={{
                                    display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
                                    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em'
                                }}>Color Scheme</label>
                                {select('color_scheme', COLOR_SCHEMES)}
                            </div>
                        </div>
                    </>
                )}

                {(form.card_type === 'video' || form.card_type === 'image') && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                            <div>
                                <label style={{
                                    display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
                                    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em'
                                }}>Overlay Tag</label>
                                {input('tag', 'e.g. 🎬 Video Course')}
                            </div>
                            <div>
                                <label style={{
                                    display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
                                    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em'
                                }}>Badge</label>
                                {input('badge', 'e.g. New 2025')}
                            </div>
                        </div>
                        <F label="Duration">{input('duration', 'e.g. 42 lectures · 18h')}</F>
                        <F label="Background Color">{select('bg_color', BG_COLORS)}</F>
                    </>
                )}

                {form.card_type === 'wide' && (
                    <F label="Content Side">{select('wide_side', ['dark', 'light'])}</F>
                )}

                {form.card_type === 'promo' && (
                    <F label="Promo Tag">{input('promo_tag', 'e.g. ⚡ Flash Sale — 48 hrs left')}</F>
                )}

                {/* Pills */}
                {form.card_type !== 'promo' && (
                    <F label="Pills / Tags">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {(form.pills || []).map((p, i) => (
                                <span key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px',
                                    background: '#f3f4f6', borderRadius: 20, fontSize: 12
                                }}>
                                    {p}
                                    <X size={10} style={{ cursor: 'pointer' }} onClick={() => removePill(i)} />
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <input placeholder="Add pill..." value={pillInput} onChange={e => setPillInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addPill()}
                                style={{ flex: 1, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12 }} />
                            <button onClick={addPill} style={{
                                padding: '6px 14px', background: '#374151', color: '#fff',
                                border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
                            }}>+</button>
                        </div>
                    </F>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                        <label style={{
                            display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
                            marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em'
                        }}>Display Order</label>
                        {input('order', '0', 'number')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 0 }}>
                        <label style={{
                            display: 'block', fontSize: 12, fontWeight: 600, color: '#374151',
                            marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em'
                        }}>Active</label>
                        <button onClick={() => set('active', !form.active)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                                border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                                background: form.active ? '#d1fae5' : '#fee2e2', color: form.active ? '#065f46' : '#991b1b'
                            }}>
                            {form.active ? <><Check size={14} /> Live</> : <><EyeOff size={14} /> Hidden</>}
                        </button>
                    </div>
                </div>

                {/* Save/Cancel */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button onClick={handleSubmit} disabled={!form.title || saving}
                        style={{
                            flex: 1, padding: '11px 24px', background: '#6366f1', color: '#fff',
                            border: 'none', borderRadius: 8, cursor: saving || !form.title ? 'not-allowed' : 'pointer',
                            fontWeight: 600, fontSize: 14, opacity: saving ? .7 : 1
                        }}>
                        {saving ? 'Saving…' : '✓ Save Advertisement'}
                    </button>
                    <button onClick={onCancel}
                        style={{
                            padding: '11px 20px', background: '#f3f4f6', color: '#374151',
                            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 14
                        }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Ad row in table ── */
function AdRow({ ad, onEdit, onDelete, onToggle, onPreview }:
    { ad: AdItem; onEdit: () => void; onDelete: () => void; onToggle: () => void; onPreview: () => void }) {
    const TYPE_COLORS: Record<AdCardType, string> = {
        video: '#fef3c7', image: '#dbeafe', wide: '#f3e8ff', promo: '#fce7f3',
    };
    return (
        <div style={{
            display: 'grid', gridTemplateColumns: '40px 80px 1fr 100px 80px 100px',
            alignItems: 'center', gap: 12, padding: '14px 20px',
            borderBottom: '1px solid #f3f4f6', background: '#fff',
            transition: 'background .15s'
        }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
            <GripVertical size={16} color="#d1d5db" />
            <div style={{
                padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'center',
                background: TYPE_COLORS[ad.card_type] || '#f3f4f6'
            }}>{ad.card_type}</div>
            <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 2 }}>{ad.title}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{ad.eyebrow}</div>
            </div>
            <button 
                onClick={onToggle}
                title="Click to toggle status"
                style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                    color: ad.active ? '#16a34a' : '#9ca3af', fontWeight: 600,
                    background: ad.active ? '#d1fae5' : '#f3f4f6',
                    border: 'none', padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                    transition: 'all .2s'
                }}>
                {ad.active ? <Check size={13} /> : <EyeOff size={13} />}
                {ad.active ? 'Live' : 'Hidden'}
            </button>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>#{ad.order}</div>
            <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={onPreview} title="Instant Preview"
                    style={{
                        padding: '5px 8px', background: '#f5f3ff', border: '1px solid #ddd6fe',
                        borderRadius: 6, cursor: 'pointer', color: '#6366f1'
                    }}>
                    <Eye size={13} />
                </button>
                <button onClick={onEdit} title="Edit"
                    style={{
                        padding: '5px 8px', background: '#eff6ff', border: '1px solid #bfdbfe',
                        borderRadius: 6, cursor: 'pointer', color: '#2563eb'
                    }}>
                    <Edit3 size={13} />
                </button>
                <button onClick={onDelete} title="Delete"
                    style={{
                        padding: '5px 8px', background: '#fef2f2', border: '1px solid #fecaca',
                        borderRadius: 6, cursor: 'pointer', color: '#dc2626'
                    }}>
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    );
}

/* ─── Main admin page ─────────────────────────── */
export default function AdsManagement() {
    const [ads, setAds] = useState<AdItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [panel, setPanel] = useState<'closed' | 'create' | 'edit'>('closed');
    const [editing, setEditing] = useState<AdItem | null>(null);
    const [previewing, setPreviewing] = useState<AdItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useFont();
    useCSS();

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const loadAds = useCallback(async () => {
        try {
            setLoading(true);
            const r = await fetch(`${API}/all`);
            const data = await r.json();
            setAds(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadAds(); }, [loadAds]);

    const handleSave = async (fd: FormData, form: Partial<AdItem>) => {
        setSaving(true);
        try {
            const url = editing ? `${API}/${editing._id}` : API;
            const meth = editing ? 'PUT' : 'POST';
            const r = await fetch(url, { method: meth, body: fd });
            if (!r.ok) throw new Error(await r.text());
            showToast(editing ? '✓ Advertisement updated.' : '✓ Advertisement created.');
            setPanel('closed'); setEditing(null);
            loadAds();
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this advertisement?')) return;
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        showToast('🗑 Deleted.'); loadAds();
    };

    const handleToggle = async (id: string) => {
        await fetch(`${API}/${id}/toggle`, { method: 'PATCH' });
        loadAds();
    };

    return (
        <div style={{
            fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh',
            background: '#f9fafb', color: '#111'
        }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, background: '#111', color: '#fff',
                    padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, zIndex: 9999,
                    boxShadow: '0 8px 24px rgba(0,0,0,.2)', animation: 'fadeIn .3s ease'
                }}>
                    {toast}
                </div>
            )}

            {/* Header */}
            <div style={{
                background: '#fff', borderBottom: '1px solid #e5e7eb',
                padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div>
                    <h1 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>Advertisement Manager</h1>
                    <p style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0 0' }}>
                        Manage the Partner Spotlight carousel on the home page
                    </p>
                </div>
                <button
                    onClick={() => { setEditing(null); setPanel('create'); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                        background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8,
                        cursor: 'pointer', fontWeight: 600, fontSize: 14
                    }}>
                    <Plus size={16} /> New Advertisement
                </button>
            </div>

            {/* Create/Edit form panel */}
            {panel !== 'closed' && (
                <div style={{
                    margin: '24px 32px', background: '#fff', border: '1px solid #e5e7eb',
                    borderRadius: 12, padding: '28px 32px', boxShadow: '0 1px 8px rgba(0,0,0,.06)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
                            {panel === 'create' ? '+ New Advertisement' : '✏ Edit Advertisement'}
                        </h2>
                        <button onClick={() => { setPanel('closed'); setEditing(null); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                            <X size={20} />
                        </button>
                    </div>
                    <AdForm
                        initial={editing ?? EMPTY}
                        onSave={handleSave}
                        onCancel={() => { setPanel('closed'); setEditing(null); }}
                        saving={saving}
                    />
                </div>
            )}

            {/* Preview Modal */}
            {previewing && (
                <div 
                    onClick={() => setPreviewing(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, backdropFilter: 'blur(4px)'
                    }}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: 16, padding: '48px',
                            boxShadow: '0 24px 64px rgba(0,0,0,.3)', position: 'relative'
                        }}
                    >
                        <button 
                            onClick={() => setPreviewing(null)}
                            style={{
                                position: 'absolute', top: 16, right: 16, border: 'none',
                                background: 'none', cursor: 'pointer', color: '#9ca3af'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <div style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}>
                            {renderCard(previewing, 0)}
                        </div>
                        <div style={{ marginTop: 40, textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, margin: 0 }}>
                                High-Fidelity Ad Hub Preview
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ads table */}
            <div style={{
                margin: '0 32px 32px', background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)'
            }}>
                {/* Table header */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '40px 80px 1fr 100px 80px 100px',
                    gap: 12, padding: '12px 20px', background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '.06em', color: '#6b7280'
                }}>
                    <div></div><div>Type</div><div>Title</div>
                    <div>Status</div><div>Order</div><div>Actions</div>
                </div>

                {loading ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>
                ) : ads.length === 0 ? (
                    <div style={{ padding: '64px 32px', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>No advertisements yet</div>
                        <div style={{ fontSize: 13 }}>Click "New Advertisement" to create your first ad card.</div>
                    </div>
                ) : (
                    ads.map(ad => (
                        <AdRow key={ad._id} ad={ad}
                            onEdit={() => { setEditing(ad); setPanel('edit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            onDelete={() => handleDelete(ad._id!)}
                            onToggle={() => handleToggle(ad._id!)}
                            onPreview={() => setPreviewing(ad)} />
                    ))
                )}
            </div>

            {/* Stats bar */}
            {ads.length > 0 && (
                <div style={{ margin: '0 32px 32px', display: 'flex', gap: 16 }}>
                    {[
                        { label: 'Total', val: ads.length, color: '#6366f1' },
                        { label: 'Live', val: ads.filter(a => a.active).length, color: '#16a34a' },
                        { label: 'Hidden', val: ads.filter(a => !a.active).length, color: '#9ca3af' },
                    ].map(s => (
                        <div key={s.label} style={{
                            flex: 1, background: '#fff', border: '1px solid #e5e7eb',
                            borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{s.label} Ads</span>
                            <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
