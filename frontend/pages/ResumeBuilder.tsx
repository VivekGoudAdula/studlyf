import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../apiConfig";
import { Link } from "react-router-dom";
import { 
    ChevronLeft, 
    Download, 
    Plus, 
    Trash2, 
    User, 
    Briefcase, 
    GraduationCap, 
    Layout, 
    Code2,
    CheckCircle2,
    Loader2,
    Eye,
    Save,
    Sparkles,
    CheckCircle
} from "lucide-react";

/**
 * StudLyf Engineering: ATS Transformation Logic
 * Refactored to ensure 1:1 real-time synthesis of all inputs, including empty/new fields.
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  body { background: #F8FAFC; font-family: 'Inter', sans-serif; color: #1E293B; }
  .premium-scrollbar::-webkit-scrollbar { width: 4px; }
  .premium-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .premium-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
  .preview-stage {
    background: #F1F5F9;
    background-image: radial-gradient(#CBD5E1 0.5px, transparent 0.5px), radial-gradient(#CBD5E1 0.5px, #F1F5F9 0.5px);
    background-size: 20px 20px;
  }
  .resume-paper-canvas {
    background: white;
    width: 210mm;
    min-height: 297mm;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 40px 60px -20px rgb(0 0 0 / 0.4);
    transform-origin: top center;
    padding: 45px 55px;
    color: #000;
  }
  .focus-trap:focus-within {
    border-color: #6366F1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08);
  }
`;

export function generatePdfHtml({ p, exp, edu, proj, skills }: any) {
    const xe = exp || [], xd = edu || [], xp = proj || [];
    const sk = skills.filter((s: any) => s.trim()).flatMap((s: any) => s.split(",").map((t: any) => t.trim())).filter(Boolean);
    const nm = (p.name || "YOUR NAME").toUpperCase();
    const emails = p.email || "email@example.com";
    
    // Mapping sections WITHOUT filter to ensure "Append" action is visible instantly
    const eR = xe.map((x: any) => `
        <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;font-weight:700;font-size:11px;color:#000">
                <span>${x.org || "Organization"}</span>
                <span>${x.range || "Date Range"}</span>
            </div>
            <div style="font-weight:600;font-size:10px;color:#4B5563;margin-bottom:4px">${x.role || "Job Title"} | ${x.loc || "Location"}</div>
            ${x.pts ? `<ul style="padding-left:18px;margin:0">` + x.pts.split("\n").filter((b: any) => b.trim()).map((b: any) => `<li style="font-size:10.5px;line-height:1.5;margin-bottom:2px;color:#111827">${b}</li>`).join("") + `</ul>` : ""}
        </div>`).join("");
    
    const dR = xd.map((x: any) => `
        <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-weight:700;font-size:11px;color:#000">
                <span>${x.inst || "University"}</span>
                <span>${x.year || "Year"}</span>
            </div>
            <div style="font-size:10.5px;line-height:1.6;color:#374151">${x.deg || "Degree"}${x.gpa ? " · " + x.gpa : ""}</div>
        </div>`).join("");
    
    const pR = xp.map((x: any) => `
        <div style="margin-bottom:10px">
            <div style="font-weight:700;font-size:11px;color:#000">${x.name || "Project Name"}${x.tech ? ` <span style="font-weight:400;color:#6366F1">| ${x.tech}</span>` : ""}</div>
            <div style="font-size:10.5px;line-height:1.6;color:#4B5563">${x.desc || ""}</div>
        </div>`).join("");

    const sectionStyle = `font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1.5px solid #E2E8F0;padding-bottom:4px;margin:20px 0 10px;color:#1E293B`;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>body{font-family:'Inter',sans-serif;line-height:1.6;color:#111;margin:0;padding:30px}*{margin:0;padding:0;box-sizing:border-box}</style></head><body>
        <div style="text-align:center;margin-bottom:20px">
            <h1 style="font-size:26px;font-weight:800;letter-spacing:-1px;margin-bottom:6px">${nm}</h1>
            <div style="font-size:10.5px;color:#64748B;font-weight:500;letter-spacing:0.5px">${emails} • ${p.phone || "Phone"} • ${p.loc || "Location"}${p.li ? " • linkedin.com/in/" + p.li : ""}</div>
        </div>
        ${p.sum ? `<div style="font-size:11px;margin-bottom:20px;line-height:1.7;color:#334155">${p.sum}</div>` : ""}
        ${xe.length ? `<div style="${sectionStyle}">Professional Experience</div>${eR}` : ""}
        ${xd.length ? `<div style="${sectionStyle}">Education</div>${dR}` : ""}
        ${xp.length ? `<div style="${sectionStyle}">Strategic Projects</div>${pR}` : ""}
        ${sk.length ? `<div style="${sectionStyle}">Technical Proficiencies</div><div style="font-size:11px;line-height:1.7;color:#334155">${sk.join(", ")}</div>` : ""}
    </body></html>`;
}

export default function ResumeBuilder() {
    const { user } = useAuth();
    const [p, sp] = useState({ name: "", email: "", phone: "", loc: "", li: "", gh: "", sum: "" });
    const [exp, se] = useState([{ org: "", role: "", range: "", loc: "", pts: "" }]);
    const [edu, sed] = useState([{ inst: "", deg: "", year: "", gpa: "" }]);
    const [proj, spr] = useState([{ name: "", tech: "", desc: "" }]);
    const [skills, sk] = useState([""]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("idle");

    useEffect(() => {
        async function fetchConfig() {
            if (!user?.uid) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/resume/${user.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.config) {
                        if (data.config.p) sp(data.config.p);
                        if (data.config.exp) se(data.config.exp);
                        if (data.config.edu) sed(data.config.edu);
                        if (data.config.proj) spr(data.config.proj);
                        if (data.config.skills) sk(data.config.skills);
                    }
                }
            } catch {}
        }
        fetchConfig();
    }, [user?.uid]);

    const handleSave = async (silent = false) => {
        if (!user?.uid) return;
        if (!silent) setIsSaving(true);
        try {
            await fetch(`${API_BASE_URL}/api/resume/${user.uid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p, exp, edu, proj, skills })
            });
            if (!silent) { setSaveStatus("saved"); setTimeout(() => setSaveStatus("idle"), 2000); }
        } finally { setIsSaving(false); }
    };

    const handleExport = async () => {
        await handleSave(true);
        const html = generatePdfHtml({ p, exp, edu, proj, skills });
        const frame = document.createElement("iframe");
        frame.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;";
        document.body.appendChild(frame);
        if (frame.contentWindow) {
            frame.contentWindow.document.open();
            frame.contentWindow.document.write(html);
            frame.contentWindow.document.close();
            frame.onload = () => { frame.contentWindow?.focus(); frame.contentWindow?.print(); setTimeout(() => document.body.removeChild(frame), 1000); };
        }
    };

    // Correctly using useMemo with all state dependencies
    const previewString = useMemo(() => generatePdfHtml({ p, exp, edu, proj, skills }), [p, exp, edu, proj, skills]);

    return (
        <div className="flex h-screen flex-col bg-white">
            <style>{styles}</style>
            
            <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-10 backdrop-blur-xl">
                <div className="flex items-center gap-10">
                    <Link to="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
                        <ChevronLeft size={24} />
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h1 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">Resume <span className="text-indigo-600">Architect</span></h1>
                            <div className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest"><Sparkles size={12} className="inline mr-1"/> ATS 7.0</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        {isSaving ? <Loader2 className="animate-spin text-indigo-400" size={16} /> : (saveStatus === "saved" ? <CheckCircle className="text-emerald-500" size={16} /> : <div className="h-2 w-2 rounded-full bg-slate-200" />)}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isSaving ? "Syncing..." : (saveStatus === "saved" ? "Cloud Saved" : "Real-time Live")}</span>
                    </div>
                    <button onClick={handleExport} className="flex h-12 items-center gap-3 rounded-xl bg-slate-900 px-8 text-[11px] font-extrabold text-white shadow-xl hover:bg-black transition-all uppercase tracking-widest">
                        <Download size={16} /> Export Master PDF
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="premium-scrollbar w-[42%] overflow-y-auto border-r border-slate-100 bg-white p-12">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-12">Synthesis Core</h2>
                    
                    {/* Identity */}
                    <div className="mb-12">
                        <div className="mb-6 flex items-center gap-3"><User className="text-indigo-600" size={20}/><h3 className="text-xs font-bold uppercase tracking-widest">Identity</h3></div>
                        <div className="grid grid-cols-2 gap-4">
                            <input value={p.name} onChange={(v) => sp({...p, name: v.target.value})} placeholder="Name" className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none focus:bg-white focus:border-indigo-400 transition-all"/>
                            <input value={p.email} onChange={(v) => sp({...p, email: v.target.value})} placeholder="Email" className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none focus:bg-white focus:border-indigo-400 transition-all"/>
                            <input value={p.phone} onChange={(v) => sp({...p, phone: v.target.value})} placeholder="Phone" className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none focus:bg-white focus:border-indigo-400 transition-all"/>
                            <input value={p.loc} onChange={(v) => sp({...p, loc: v.target.value})} placeholder="Location" className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none focus:bg-white focus:border-indigo-400 transition-all"/>
                        </div>
                        <textarea value={p.sum} onChange={(v) => sp({...p, sum: v.target.value})} placeholder="Professional Summary" className="w-full mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none focus:bg-white focus:border-indigo-400 transition-all min-h-[100px]"/>
                    </div>

                    {/* Experience */}
                    <div className="mb-12">
                        <div className="mb-6 flex items-center gap-3"><Briefcase className="text-indigo-600" size={20}/><h3 className="text-xs font-bold uppercase tracking-widest">Experience</h3></div>
                        {exp.map((x, i) => (
                            <div key={i} className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/30 p-6 group relative">
                                <button onClick={() => se(a => a.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-slate-200 hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input value={x.org} onChange={(e) => se(a => a.map((k, j) => j === i ? {...k, org: e.target.value} : k))} placeholder="Company" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                    <input value={x.role} onChange={(e) => se(a => a.map((k, j) => j === i ? {...k, role: e.target.value} : k))} placeholder="Title" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                    <input value={x.range} onChange={(e) => se(a => a.map((k, j) => j === i ? {...k, range: e.target.value} : k))} placeholder="Range" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                    <input value={x.loc} onChange={(e) => se(a => a.map((k, j) => j === i ? {...k, loc: e.target.value} : k))} placeholder="Location" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                </div>
                                <textarea value={x.pts} onChange={(e) => se(a => a.map((k, j) => j === i ? {...k, pts: e.target.value} : k))} placeholder="Achievements (one per line)" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400 min-h-[80px]"/>
                            </div>
                        ))}
                        <button onClick={() => se([...exp, {org:"",role:"",range:"",loc:"",pts:""}])} className="w-full p-4 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 hover:text-indigo-400 hover:bg-indigo-50 transition-all uppercase tracking-widest">+ Append Experience</button>
                    </div>

                    {/* Technical Proficiencies */}
                    <div className="mb-12">
                        <div className="mb-6 flex items-center gap-3"><Code2 className="text-indigo-600" size={20}/><h3 className="text-xs font-bold uppercase tracking-widest">Skills</h3></div>
                        {skills.map((s, i) => (
                            <div key={i} className="flex gap-2 mb-2 items-center">
                                <input value={s} onChange={(e) => sk(a => a.map((k, j) => j === i ? e.target.value : k))} placeholder="Domain Cluster" className="flex-grow rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-sm outline-none focus:border-indigo-400"/>
                                <button onClick={() => sk(a => a.filter((_, j) => j !== i))} className="text-slate-200 hover:text-red-400"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => sk([...skills, ""])} className="text-[10px] font-bold text-indigo-400 uppercase mt-4">+ Protocol Cluster</button>
                    </div>

                    {/* Academic Foundation */}
                    <div className="mb-12">
                        <div className="mb-6 flex items-center gap-3"><GraduationCap className="text-indigo-600" size={20}/><h3 className="text-xs font-bold uppercase tracking-widest">Academic Foundation</h3></div>
                        {edu.map((x, i) => (
                            <div key={i} className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/30 p-6 group relative">
                                <button onClick={() => sed(a => a.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-slate-200 hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input value={x.inst} onChange={(e) => sed(a => a.map((k, j) => j === i ? {...k, inst: e.target.value} : k))} placeholder="University" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                    <input value={x.deg} onChange={(e) => sed(a => a.map((k, j) => j === i ? {...k, deg: e.target.value} : k))} placeholder="Degree" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                    <input value={x.year} onChange={(e) => sed(a => a.map((k, j) => j === i ? {...k, year: e.target.value} : k))} placeholder="Graduation" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                    <input value={x.gpa} onChange={(e) => sed(a => a.map((k, j) => j === i ? {...k, gpa: e.target.value} : k))} placeholder="GPA" className="w-full rounded-lg border border-slate-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"/>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => sed([...edu, {inst:"",deg:"",year:"",gpa:""}])} className="w-full p-4 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 hover:text-indigo-400 hover:bg-indigo-50 transition-all uppercase tracking-widest">+ Append Education</button>
                    </div>

                </div>

                {/* Right: Master View Canvas */}
                <div className="preview-stage flex-1 overflow-y-auto premium-scrollbar">
                    <div className="flex flex-col items-center py-20 px-10">
                        <div className="mb-10 flex w-full max-w-[210mm] items-center justify-between">
                            <div className="flex items-center gap-3"><Eye className="text-slate-400" size={20}/><span className="text-[10px] font-black uppercase tracking-[2px] text-slate-800">Master View Synthesis</span></div>
                            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">LIVE TRANSCRIPTION</span></div>
                        </div>
                        <div className="resume-paper-canvas" dangerouslySetInnerHTML={{ __html: previewString }} />
                    </div>
                </div>

            </div>
        </div>
    );
}

