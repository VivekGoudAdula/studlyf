import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../apiConfig";
import Navigation from "../components/Navigation";
import DashboardFooter from "../components/DashboardFooter";
import { Link } from "react-router-dom";
// @ts-ignore
import html2pdf from "html2pdf.js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .resume-builder-wrapper { font-family: 'DM Sans', sans-serif; background: #fff; color: #1a1a1a; -webkit-font-smoothing: antialiased; display: flex; flex-direction: column; min-height: 100vh;}
  .resume-builder-wrapper input, .resume-builder-wrapper textarea, .resume-builder-wrapper button { font-family: 'DM Sans', sans-serif; }
  .resume-builder-wrapper input::placeholder, .resume-builder-wrapper textarea::placeholder { color: #c0c0c0; }
  .resume-builder-wrapper ::-webkit-scrollbar { width: 4px; }
  .resume-builder-wrapper ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }
  @keyframes in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
  @keyframes r-spin { to { transform: rotate(360deg); } }
`;

const v = {
    purple: "#5b21b6",
    purpleD: "#4c1d95",
    purpleT: "rgba(91,33,182,0.06)",
    border: "#e8e8e8",
    borderFoc: "#5b21b6",
    bg: "#fafafa",
    sunken: "#f2f2f2",
    text: "#000000",
    mid: "#000000",
    dim: "#000000",
    green: "#15803d",
    greenBg: "#f0fdf4",
    greenBd: "#bbf7d0",
    red: "#b91c1c",
};

/* ── primitives ─────────────────────────────────────────────── */

function Input({ value, onChange, placeholder, rows, style, area }: any) {
    const [f, sf] = useState(false);
    const isArea = area || rows != null;
    const s: React.CSSProperties = {
        width: "100%", fontSize: 13, color: v.text, lineHeight: 1.55,
        background: v.sunken, border: `1px solid ${f ? v.borderFoc : "transparent"}`,
        borderRadius: 7, padding: "8px 11px", outline: "none",
        transition: "border-color 0.12s", resize: isArea ? "vertical" : undefined,
        fontFamily: "'DM Sans', sans-serif", ...style,
    };
    return isArea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s} onFocus={() => sf(true)} onBlur={() => sf(false)} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={() => sf(true)} onBlur={() => sf(false)} />;
}

const Lbl = ({ c }: any) => <div style={{ fontSize: 10, fontWeight: 700, color: "#000000", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>{c}</div>;
const G2 = ({ children }: any) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;
const Field = ({ label, ...p }: any) => <div><Lbl c={label} /><Input {...p} /></div>;

function Card({ children, onDel }: any) {
    return (
        <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: 9, padding: "13px 14px", marginBottom: 9, position: "relative" }}>
            {onDel && <button onClick={onDel} style={{ position: "absolute", top: 9, right: 9, width: 18, height: 18, borderRadius: 3, border: "none", background: "none", color: v.dim, fontSize: 14, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>}
            {children}
        </div>
    );
}

function Section({ title, onAdd, children }: any) {
    return (
        <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 8px" }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#000000", textTransform: "uppercase" }}>{title}</span>
                {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: v.purple, background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>+ add</button>}
            </div>
            <div style={{ background: "#fff", border: `1px solid ${v.border}`, borderRadius: 10, padding: "14px 15px" }}>{children}</div>
        </div>
    );
}

/* ── template thumbs ─────────────────────────────────────────── */
function Thumb({ id, active }: any) {
    const L = (w: any, h = 2, c = "#e4e4e4") => <div style={{ width: w, height: h, background: c, borderRadius: 1, marginTop: 3 }} />;
    const w: any = { width: "100%", height: 140, background: "#fff", borderRadius: 7, overflow: "hidden", border: `2px solid ${active ? v.purple : "transparent"}`, position: "relative" };

    // Use the actual image from public/templates/resume/
    return (
        <div style={w} className="shadow-sm">
            <img
                src={`/templates/resume/${id}.png`}
                alt={id}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                onError={(e) => {
                    // Fallback rendering just in case the image fails to load
                    e.currentTarget.style.display = 'none';
                }}
            />
            {/* CSS Fallback if image fails or before it loads fully */}
            {!active && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
                {id === "chicago" && <div style={{ padding: "10px" }}>
                    <div style={{ fontSize: 8, fontWeight: 700, fontFamily: "Georgia,serif", color: "#1a1a1a", marginBottom: 1 }}>JOHN DOE</div>
                    {L("44%", 1.5, active ? v.purple : "#d0d0d0")}
                    <div style={{ display: "flex", gap: 5, marginTop: 3 }}>{L("20%")}{L("16%")}{L("18%")}</div>
                    {["74%", "56%", "66%", "52%", "68%"].map((x, i) => <div key={i}>{L(x, 2, i % 2 ? "#ebebeb" : "#e0e0e0")}</div>)}
                </div>}
                {id === "easy" && <div style={{ padding: 0, display: "flex", flexDirection: "row" }}>
                    <div style={{ width: 2.5, background: active ? v.purple : "#d0d0d0", flexShrink: 0, margin: "9px 0" }} />
                    <div style={{ flex: 1, padding: "10px 9px" }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: "#1a1a1a", marginBottom: 1 }}>JOHN DOE</div>
                        {L("35%", 1.5, "#ccc")}
                        <div style={{ marginTop: 4 }}>{L("22%", 1.5, active ? v.purple : "#d0d0d0")}</div>
                        {["58%", "46%", "62%", "44%", "56%"].map((x, i) => <div key={i}>{L(x)}</div>)}
                    </div>
                </div>}
                {id === "swiss" && <div style={{ padding: 0, display: "flex", flexDirection: "row", height: "100%" }}>
                    <div style={{ width: 42, background: active ? "#1e0a3c" : "#2a2a3a", padding: "9px 7px", flexShrink: 0 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.12)", margin: "0 auto 5px" }} />
                        {["70%", "55%", "62%", "48%", "58%", "52%", "64%"].map((x, i) => <div key={i} style={{ marginTop: 3, width: x, height: 1.5, background: "rgba(255,255,255,0.18)", borderRadius: 1 }} />)}
                    </div>
                    <div style={{ flex: 1, padding: "10px 9px" }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: "#1a1a1a", marginBottom: 1 }}>JOHN DOE</div>
                        {L("32%", 1.5, active ? v.purple : "#d0d0d0")}
                        {["64%", "48%", "68%", "52%", "58%"].map((x, i) => <div key={i}>{L(x)}</div>)}
                    </div>
                </div>}
            </div>}
        </div>
    );
}

/* ── sidebar ─────────────────────────────────────────────────── */
function Sidebar({ tpl, p, exp, edu, proj, skills, generated, generating, onGen, onSave, saving }: any) {
    const tpls = { chicago: "Chicago Professional", easy: "Easy Minimal", swiss: "Swiss Minimalist" };

    return (
        <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Template */}
            <div style={{ border: `1px solid ${v.border}`, borderRadius: 10, padding: "13px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#000000", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 9 }}>Template</div>
                {Object.entries(tpls).map(([id, label]) => (
                    <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6, marginBottom: 3, background: tpl === id ? v.purpleT : "transparent", border: `1px solid ${tpl === id ? v.purple + "30" : "transparent"}` }}>
                        <span style={{ fontSize: 12, fontWeight: tpl === id ? 700 : 500, color: tpl === id ? v.purple : "#000000" }}>{label}</span>
                        {tpl === id && <div style={{ width: 5, height: 5, borderRadius: "50%", background: v.purple }} />}
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={onSave} disabled={saving}
                    style={{ width: "100%", padding: "12px", borderRadius: 9, border: `1px solid ${v.purple}`, background: "#fff", color: v.purple, fontWeight: 600, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.background = v.purpleT; }}
                    onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#fff"; }}>
                    {saving ? "Saving…" : "Save Progress"}
                </button>
                <button onClick={onGen} disabled={generating}
                    style={{ width: "100%", padding: "12px", borderRadius: 9, border: "none", background: generating ? "#ccc" : v.purple, color: "#fff", fontWeight: 600, fontSize: 13, cursor: generating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}>
                    {generating ? "Generating…" : "Save & Generate PDF"}
                </button>
            </div>

            {generated && (
                <div style={{ fontSize: 12, color: v.green, background: v.greenBg, border: `1px solid ${v.greenBd}`, borderRadius: 8, padding: "8px 11px", lineHeight: 1.5, textAlign: "center" }}>
                    Print dialog opened —<br />select <strong>Save as PDF</strong>.
                </div>
            )}
        </div>
    );
}

/* ── pdf ──────────────────────────────────────────────────────── */
export function generatePdfHtml({ p, exp, edu, proj, certs, skills }: any, tpl: string) {
    const xe = exp.filter((x: any) => x.org), xd = edu.filter((x: any) => x.inst);
    const xp = proj.filter((x: any) => x.name), xc = certs.filter((x: any) => x.name);
    const sk = skills.filter((s: any) => s.trim()).flatMap((s: any) => s.split(",").map((t: any) => t.trim())).filter(Boolean);
    const nm = p.name || "Your Name";
    const eR = xe.map((x: any) => `<div class="e"><div class="r"><div><b>${x.org}</b><span class="d"> — ${x.role}</span></div><span class="m">${x.range}${x.loc ? " · " + x.loc : ""}</span></div>${x.pts ? `<ul>${x.pts.split("\n").filter((b: any) => b.trim()).map((b: any) => `<li>${b}</li>`).join("")}</ul>` : ""}</div>`).join("");
    const dR = xd.map((x: any) => `<div class="e"><div class="r"><b>${x.inst}</b><span class="m">${x.year}</span></div><div class="d">${x.deg}${x.gpa ? " · GPA " + x.gpa : ""}</div></div>`).join("");
    const pR = xp.map((x: any) => `<div class="e"><b>${x.name}</b>${x.tech ? ` <span style="color:#5b21b6;font-size:10px;font-weight:600">· ${x.tech}</span>` : ""}${x.desc ? `<div class="d" style="margin-top:2px">${x.desc}</div>` : ""}</div>`).join("");
    const ch = sk.map((s: any) => `<span class="ch">${s}</span>`).join("");
    const cl = xc.map((x: any) => `<li>${x.name}</li>`).join("");
    const base = `*{margin:0;padding:0;box-sizing:border-box}.e{margin-bottom:10px}.r{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px}.d{color:#6b7280;font-size:10px;line-height:1.5}.m{color:#999;font-size:10px;flex-shrink:0;margin-left:8px}ul{padding-left:13px;margin-top:3px}li{font-size:10px;line-height:1.5;color:#555;margin-bottom:2px}.ch{display:inline-block;padding:2px 8px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:11px;font-size:10px;margin:2px}`;

    if (tpl === "swiss") return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');${base}body{font-family:'DM Sans',sans-serif;display:grid;grid-template-columns:165px 1fr;min-height:100vh;font-size:11px}aside{background:#1e0a3c;color:#fff;padding:26px 15px}main{padding:26px 26px}h1{font-size:17px;font-weight:700;margin-bottom:3px}.lc{color:#c4b5fd;font-size:10px;margin-bottom:9px}.sl{color:rgba(255,255,255,.6);font-size:10px;margin-bottom:3px}.sh{font-size:7px;letter-spacing:.12em;text-transform:uppercase;color:#c4b5fd;margin:12px 0 4px;font-weight:700}.mh{font-size:7px;letter-spacing:.12em;text-transform:uppercase;color:#5b21b6;font-weight:700;margin:13px 0 5px;padding-bottom:3px;border-bottom:1.5px solid #5b21b6}</style></head><body><aside><h1>${nm}</h1><div class="lc">${p.loc || ""}</div>${p.email ? `<div class="sl">${p.email}</div>` : ""}${p.phone ? `<div class="sl">${p.phone}</div>` : ""}${p.li ? `<div class="sl">in ${p.li}</div>` : ""}${sk.length ? `<div class="sh">Skills</div>${sk.map((s: any) => `<div class="sl">· ${s}</div>`).join("")}` : ""}${xc.length ? `<div class="sh">Certifications</div>${xc.map((x: any) => `<div class="sl">· ${x.name}</div>`).join("")}` : ""}</aside><main>${p.sum ? `<p class="d" style="margin-bottom:11px;line-height:1.6">${p.sum}</p>` : ""}${xe.length ? `<div class="mh">Experience</div>${eR}` : ""}${xd.length ? `<div class="mh">Education</div>${dR}` : ""}${xp.length ? `<div class="mh">Projects</div>${pR}` : ""}</main></body></html>`;

    if (tpl === "easy") return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');${base}body{font-family:'DM Sans',sans-serif;color:#1a1a1a;background:#fff;padding:38px 46px;font-size:11px}.hd{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:11px;border-bottom:2.5px solid #5b21b6;margin-bottom:15px}h1{font-size:21px;font-weight:700;letter-spacing:-.02em}.ct{display:flex;flex-direction:column;align-items:flex-end;gap:3px;color:#6b7280;font-size:10px}.sh{font-size:7px;letter-spacing:.12em;text-transform:uppercase;color:#5b21b6;font-weight:700;margin:13px 0 6px}.tc{display:grid;grid-template-columns:82px 1fr;gap:9px;margin-bottom:9px}.el{color:#999;font-size:10px;text-align:right;line-height:1.5}</style></head><body><div class="hd"><div><h1>${nm}</h1>${p.loc ? `<div style="color:#6b7280;font-size:10px;margin-top:2px">${p.loc}</div>` : ""}${p.sum ? `<p class="d" style="margin-top:4px;max-width:330px;line-height:1.5">${p.sum}</p>` : ""}</div><div class="ct">${p.email ? `<span>${p.email}</span>` : ""}${p.phone ? `<span>${p.phone}</span>` : ""}${p.li ? `<span>${p.li}</span>` : ""}</div></div>${xe.length ? `<div class="sh">Experience</div>${xe.map((x: any) => `<div class="tc"><div class="el">${x.range}<br/>${x.loc}</div><div><b>${x.org}</b><span class="d"> — ${x.role}</span>${x.pts ? `<ul>${x.pts.split("\n").filter((b: any) => b.trim()).map((b: any) => `<li>${b}</li>`).join("")}</ul>` : ""}</div></div>`).join("")}` : ""}${xd.length ? `<div class="sh">Education</div>${xd.map((x: any) => `<div class="tc"><div class="el">${x.year}</div><div><b>${x.inst}</b><div class="d">${x.deg}${x.gpa ? " · " + x.gpa : ""}</div></div></div>`).join("")}` : ""}${xp.length ? `<div class="sh">Projects</div>${pR}` : ""}${xc.length ? `<div class="sh">Certifications</div><ul>${cl}</ul>` : ""}${sk.length ? `<div class="sh">Skills</div><div style="margin-top:2px">${ch}</div>` : ""}</body></html>`;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700&display=swap');${base}body{font-family:'DM Sans',sans-serif;color:#1a1a1a;background:#fff;padding:38px 46px;font-size:11px}h1{font-family:'Playfair Display',serif;font-size:25px;font-weight:900;letter-spacing:-.02em}.sb{color:#5b21b6;font-size:10px;font-weight:600;margin-top:3px}.ct{display:flex;gap:14px;margin-top:5px;flex-wrap:wrap;color:#6b7280;font-size:10px}.dv{height:1.5px;background:#5b21b6;margin:10px 0}.sh{font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5b21b6;margin:12px 0 6px}</style></head><body><h1>${nm}</h1>${p.loc ? `<div class="sb">${p.loc}</div>` : ""}<div class="ct">${p.email ? `<span>${p.email}</span>` : ""}${p.phone ? `<span>${p.phone}</span>` : ""}${p.li ? `<span>in ${p.li}</span>` : ""}</div><div class="dv"></div>${p.sum ? `<p class="d" style="line-height:1.6;margin-bottom:7px">${p.sum}</p><hr style="border:none;border-top:1px solid #eee;margin:8px 0"/>` : ""}${xe.length ? `<div class="sh">Experience</div>${eR}` : ""}${xd.length ? `<div class="sh">Education</div>${dR}` : ""}${xp.length ? `<div class="sh">Projects</div>${pR}` : ""}${xc.length ? `<div class="sh">Certifications</div><ul style="margin-bottom:7px">${cl}</ul>` : ""}${sk.length ? `<div class="sh">Skills</div><div style="margin-top:2px">${ch}</div>` : ""}</body></html>`;
}

/* ── main ─────────────────────────────────────────────────────── */
export default function ResumeBuilder() {
    const { user } = useAuth();

    const [step, ss] = useState(1);
    const [tpl, st] = useState("chicago");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const [p, sp] = useState({ name: "", email: "", phone: "", loc: "", li: "", gh: "", sum: "" });
    const [exp, se] = useState([
        { org: "", role: "", range: "", loc: "", pts: "" },
    ]);
    const [edu, sed] = useState([
        { inst: "", deg: "", year: "", gpa: "" },
    ]);
    const [proj, spr] = useState([
        { name: "", tech: "", desc: "" },
    ]);
    const [certs, sc] = useState([{ name: "" }]);
    const [skills, sk] = useState([""]);

    // Fetch resume data on mount
    useEffect(() => {
        async function loadResume() {
            if (!user?.uid) {
                console.log("ResumeBuilder: No user UID found yet");
                return;
            }
            try {
                console.log("ResumeBuilder: Fetching resume for", user.uid);
                const res = await fetch(`${API_BASE_URL}/api/resume/${user.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.config) {
                        if (data.config.p) sp(data.config.p);
                        if (data.config.exp) se(data.config.exp);
                        if (data.config.edu) sed(data.config.edu);
                        if (data.config.proj) spr(data.config.proj);
                        if (data.config.certs) sc(data.config.certs);
                        if (data.config.skills) sk(data.config.skills);
                        if (data.config.tpl) st(data.config.tpl);
                    }
                }
            } catch (e) {
                console.error("ResumeBuilder: Load error", e);
            }
        }
        loadResume();
    }, [user?.uid]);


    const u = (set: any, i: number, f: string, val: any) => set((a: any) => a.map((x: any, j: number) => j === i ? { ...x, [f]: val } : x));
    const add = (set: any, b: any) => set((a: any) => [...a, { ...b }]);
    const rm = (set: any, i: number) => set((a: any) => a.filter((_: any, j: number) => j !== i));

    const handleSave = async () => {
        if (!user?.uid) {
            console.error("handleSave triggered but user.uid is missing", user);
            alert("Security Check: Please login again or wait for session to sync.");
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/resume/${user.uid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p, exp, edu, proj, certs, skills, tpl })
            });
            if (res.ok) {
                console.log("Resume saved successfully");
            } else {
                console.error("Failed to save resume");
                alert("Cloud Sync failed. Please check your connection.");
            }
        } catch (e) {
            console.error("Error saving resume", e);
            alert("System Error. Please try again later.");
        } finally {
            setIsSaving(false);
        }
    };

    const generate = async () => {
        setIsGenerating(true);
        await handleSave();

        await new Promise(r => setTimeout(r, 1000));

        // 2. Trigger Print Dialog
        const html = generatePdfHtml({ p, exp, edu, proj, certs, skills }, tpl);
        const fr = document.createElement("iframe");
        fr.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;";
        document.body.appendChild(fr);

        if (fr.contentWindow) {
            fr.contentWindow.document.open();
            fr.contentWindow.document.write(html);
            fr.contentWindow.document.close();
            fr.onload = () => {
                fr.contentWindow?.focus();
                fr.contentWindow?.print();
                setTimeout(() => document.body.removeChild(fr), 2000);
            };
        }

        setIsGenerating(false);
        setIsGenerated(true);
    };

    return (
        <>
            <style>{css}</style>
            <div className="resume-builder-wrapper">

                {/* nav */}
                <div style={{ height: 60, marginTop: "20px", borderBottom: `1px solid ${v.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fcfcfc" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link to="/learner-dashboard" style={{ fontSize: 13, fontWeight: 700, color: "#000000", textDecoration: "none", background: v.sunken, padding: "5px 12px", borderRadius: 6 }}>← Dashboard</Link>
                        <span style={{ fontWeight: 800, fontSize: 18, color: "#000000", letterSpacing: "-0.02em" }}>Resume <span style={{ color: v.purple }}>Builder</span></span>
                    </div>
                    <div style={{ display: "flex", gap: 3, background: v.sunken, padding: "3px", borderRadius: 7 }}>
                        {[{ n: 1, l: "Template" }, { n: 2, l: "Details" }].map(({ n, l }) => (
                            <button key={n} onClick={() => ss(n)} style={{ padding: "6px 18px", borderRadius: 5, border: "none", background: step === n ? "#fff" : "transparent", color: step === n ? v.text : v.dim, fontWeight: step === n ? 600 : 400, fontSize: 13, cursor: "pointer", boxShadow: step === n ? "0 1px 3px rgba(0,0,0,0.09)" : "none", transition: "all 0.12s" }}>{l}</button>
                        ))}
                    </div>
                </div>

                <div style={{ maxWidth: 1000, flex: 1, margin: "0 auto", padding: "40px 24px 60px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start", width: "100%" }}>

                    <div>
                        {/* step 1 */}
                        {step === 1 && (
                            <div style={{ animation: "in 0.2s ease both" }}>
                                <p style={{ fontSize: 15, color: "#000000", fontWeight: 500, marginBottom: 24 }}>Choose a layout for your resume.</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                                    {[
                                        { id: "chicago", name: "Chicago Professional", desc: "Serif headline, ruled divider" },
                                        { id: "easy", name: "Easy Minimal", desc: "Left accent bar, date columns" },
                                        { id: "swiss", name: "Swiss Minimalist", desc: "Dark sidebar, clean main" },
                                    ].map(t => (
                                        <div key={t.id} onClick={() => st(t.id)} style={{ borderRadius: 10, padding: 11, cursor: "pointer", border: `2px solid ${tpl === t.id ? v.purple : v.border}`, background: tpl === t.id ? "#faf8ff" : v.bg, transition: "all 0.12s" }}>
                                            <Thumb id={t.id} active={tpl === t.id} />
                                            <div style={{ marginTop: 12 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: v.text, marginBottom: 4 }}>{t.name}</div>
                                                <div style={{ fontSize: 12, color: v.dim, lineHeight: 1.4 }}>{t.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => ss(2)} style={{ padding: "12px 28px", borderRadius: 8, background: v.purple, color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background 0.12s" }} onMouseEnter={e => e.currentTarget.style.background = v.purpleD} onMouseLeave={e => e.currentTarget.style.background = v.purple}>
                                    Next →
                                </button>
                            </div>
                        )}

                        {/* step 2 */}
                        {step === 2 && (
                            <div style={{ animation: "in 0.2s ease both" }}>

                                <Section title="Personal">
                                    <G2>
                                        <Field label="Name" placeholder="Full name" value={p.name} onChange={(val: any) => sp(x => ({ ...x, name: val }))} />
                                        <Field label="Email" placeholder="you@email.com" value={p.email} onChange={(val: any) => sp(x => ({ ...x, email: val }))} />
                                        <Field label="Phone" placeholder="+91 …" value={p.phone} onChange={(val: any) => sp(x => ({ ...x, phone: val }))} />
                                        <Field label="Location" placeholder="City, Country" value={p.loc} onChange={(val: any) => sp(x => ({ ...x, loc: val }))} />
                                        <Field label="LinkedIn" placeholder="linkedin.com/in/…" value={p.li} onChange={(val: any) => sp(x => ({ ...x, li: val }))} />
                                        <Field label="GitHub" placeholder="github.com/…" value={p.gh} onChange={(val: any) => sp(x => ({ ...x, gh: val }))} />
                                    </G2>
                                    <div style={{ marginTop: 10 }}><Lbl c="Summary" /><Input area placeholder="Short professional summary…" value={p.sum} onChange={(val: any) => sp(x => ({ ...x, sum: val }))} rows={3} /></div>
                                </Section>

                                <Section title="Experience" onAdd={() => add(se, { org: "", role: "", range: "", loc: "", pts: "" })}>
                                    {exp.map((x, i) => (
                                        <Card key={i} onDel={exp.length > 1 ? () => rm(se, i) : null}>
                                            <G2>
                                                <Field label="Organisation" placeholder="Company" value={x.org} onChange={(v: any) => u(se, i, "org", v)} />
                                                <Field label="Role" placeholder="Position title" value={x.role} onChange={(v: any) => u(se, i, "role", v)} />
                                                <Field label="Date range" placeholder="Jan 2024–Mar 2025" value={x.range} onChange={(v: any) => u(se, i, "range", v)} />
                                                <Field label="Location" placeholder="City" value={x.loc} onChange={(v: any) => u(se, i, "loc", v)} />
                                            </G2>
                                            <div style={{ marginTop: 9 }}><Lbl c="Bullet points" /><Input area placeholder="One bullet per line…" value={x.pts} onChange={(v: any) => u(se, i, "pts", v)} rows={3} /></div>
                                        </Card>
                                    ))}
                                </Section>

                                <Section title="Education" onAdd={() => add(sed, { inst: "", deg: "", year: "", gpa: "" })}>
                                    {edu.map((x, i) => (
                                        <Card key={i} onDel={edu.length > 1 ? () => rm(sed, i) : null}>
                                            <G2>
                                                <Field label="Institution" placeholder="University" value={x.inst} onChange={(v: any) => u(sed, i, "inst", v)} />
                                                <Field label="Degree" placeholder="B.Tech CS" value={x.deg} onChange={(v: any) => u(sed, i, "deg", v)} />
                                                <Field label="Year" placeholder="2021–2025" value={x.year} onChange={(v: any) => u(sed, i, "year", v)} />
                                                <Field label="GPA" placeholder="8.4 / 10" value={x.gpa} onChange={(v: any) => u(sed, i, "gpa", v)} />
                                            </G2>
                                        </Card>
                                    ))}
                                </Section>

                                <Section title="Projects" onAdd={() => add(spr, { name: "", tech: "", desc: "" })}>
                                    {proj.map((x, i) => (
                                        <Card key={i} onDel={proj.length > 1 ? () => rm(spr, i) : null}>
                                            <G2>
                                                <Field label="Project name" placeholder="My Project" value={x.name} onChange={(v: any) => u(spr, i, "name", v)} />
                                                <Field label="Stack" placeholder="Python, React" value={x.tech} onChange={(v: any) => u(spr, i, "tech", v)} />
                                            </G2>
                                            <div style={{ marginTop: 9 }}><Lbl c="Description" /><Input area placeholder="What it does and the outcome…" value={x.desc} onChange={(v: any) => u(spr, i, "desc", v)} rows={2} /></div>
                                        </Card>
                                    ))}
                                </Section>

                                <Section title="Certifications" onAdd={() => add(sc, { name: "" })}>
                                    {certs.map((x, i) => (
                                        <Card key={i} onDel={certs.length > 1 ? () => rm(sc, i) : null}>
                                            <Lbl c="Name" /><Input placeholder="AWS Certified Cloud Practitioner" value={x.name} onChange={(v: any) => u(sc, i, "name", v)} />
                                        </Card>
                                    ))}
                                </Section>

                                <Section title="Skills" onAdd={() => sk(s => [...s, ""])}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        {skills.map((s, i) => (
                                            <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                                                <div style={{ flex: 1 }}><Lbl c="Skill group" /><Input placeholder="Python, React, SQL" value={s} onChange={(v: any) => sk((a: any) => a.map((x: any, j: number) => j === i ? v : x))} /></div>
                                                {skills.length > 1 && <button onClick={() => sk(a => a.filter((_, j) => j !== i))} style={{ width: 24, height: 33, borderRadius: 5, border: "none", background: "none", color: v.dim, fontSize: 16, cursor: "pointer", flexShrink: 0, marginBottom: 1 }}>×</button>}
                                            </div>
                                        ))}
                                    </div>
                                </Section>

                            </div>
                        )}
                    </div>

                    <Sidebar tpl={tpl} p={p} exp={exp} edu={edu} proj={proj} skills={skills} generated={isGenerated} generating={isGenerating} saving={isSaving} onGen={generate} onSave={handleSave} />
                </div>

            </div>
        </>
    );
}
