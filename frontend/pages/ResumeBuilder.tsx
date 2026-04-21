import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../apiConfig";
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
    CheckCircle,
    ChevronRight,
    Search,
    Share2,
    Edit3,
    FileText,
    Globe,
    MapPin,
    Mail,
    Phone,
    Github,
    Linkedin,
    ExternalLink,
    Award,
    Award as CertificationIcon,
    Terminal,
    Database,
    Cpu,
    X,
    ChevronDown,
    ChevronUp,
    GithubIcon
} from "lucide-react";

// --- Types ---
interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    jobTitle: string;
    links: { label: string; url: string }[];
}

interface Education {
    institution: string;
    degree: string;
    year: string;
    gpa: string;
}

interface Experience {
    company: string;
    role: string;
    range: string;
    location: string;
    points: string;
}

interface Additional {
    honorsAndAwards: string[];
}

interface ResumeData {
    name: string;
    personalInfo: PersonalInfo;
    education: Education[];
    experience: Experience[];
    skills: {
        languages: string[];
        frameworks: string[];
        tools: string[];
        databases: string[];
    };
    projects: { name: string; tech: string; desc: string; link?: string }[];
    certifications: string[];
    additional: Additional;
}

const DEFAULT_RESUME_DATA: ResumeData = {
    name: "UNTITLED RESUME",
    personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        jobTitle: "",
        links: []
    },
    education: [],
    experience: [],
    skills: {
        languages: [],
        frameworks: [],
        tools: [],
        databases: []
    },
    projects: [],
    certifications: [],
    additional: {
        honorsAndAwards: []
    }
};

// --- Styles ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap');
  
  :root {
    --hr-green: #008542;
    --hr-green-hover: #006b35;
    --hr-border: #e2e8f0;
    --hr-text: #1e293b;
    --hr-text-light: #64748b;
    --hr-bg: #f8fafc;
  }

  body { 
    background-color: var(--hr-bg); 
    font-family: 'Inter', sans-serif; 
    color: var(--hr-text); 
  }

  .premium-scrollbar::-webkit-scrollbar { width: 6px; }
  .premium-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .premium-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  .premium-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  .resume-preview-container {
    background: #f1f5f9;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  }

  .resume-paper {
    background: white;
    width: 210mm;
    min-height: 297mm;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    padding: 40px 50px;
    margin: 40px 0;
  }

  /* Forms and Inputs */
  .hr-input {
    width: 100%;
    border: 1px solid var(--hr-border);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.2s;
    outline: none;
  }
  .hr-input:focus {
    border-color: var(--hr-green);
    box-shadow: 0 0 0 2px rgba(0, 133, 66, 0.1);
  }

  .hr-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--hr-text-light);
    margin-bottom: 6px;
  }

  .hr-button-primary {
    background-color: #7c3aed;
    color: white;
    font-weight: 600;
    padding: 10px 24px;
    border-radius: 8px;
    transition: background-color 0.2s;
  }
  .hr-button-primary:hover {
    background-color: #6d28d9;
  }

  .hr-button-outline {
    border: 1px solid var(--hr-border);
    background: white;
    color: var(--hr-text);
    font-weight: 600;
    padding: 10px 24px;
    border-radius: 8px;
    transition: all 0.2s;
  }
  .hr-button-outline:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }

  /* Steps UI */
  .card-create-new {
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    width: 300px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: white;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card-create-new:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  }

  .template-card {
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #f8fafc;
  }
  .template-card.selected {
    border-color: #7c3aed;
    background: #f5f3ff;
  }

  .section-accordion {
    border-bottom: 1px solid var(--hr-border);
  }

  /* Specific Layouts */
  .editor-header {
    height: 80px;
    border-bottom: 1px solid var(--hr-border);
    background: white;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Resume Preview Typography (Classic) */
  .classic-resume h1 { font-size: 24pt; font-weight: 400; text-align: center; margin-bottom: 4pt; font-family: serif; }
  .classic-resume .contact { font-size: 9pt; text-align: center; margin-bottom: 12pt; }
  .classic-resume h2 { font-size: 10pt; font-weight: bold; border-bottom: 1px solid black; margin: 12pt 0 6pt 0; text-transform: uppercase; }
  .classic-resume .entry-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt; }
  .classic-resume .entry-subtile { display: flex; justify-content: space-between; font-style: italic; font-size: 9pt; margin-bottom: 2pt; }
  .classic-resume ul { padding-left: 14pt; margin: 0; }
  .classic-resume li { font-size: 9pt; margin-bottom: 2pt; }
  .classic-resume .skill-group { font-size: 9pt; margin-bottom: 4pt; }
  .classic-resume .skill-label { font-weight: bold; }
`;

// --- Components ---

const AccordionItem = ({ title, icon: Icon, children, isOpen, onClick }: any) => {
    return (
        <div className="section-accordion">
            <button 
                onClick={onClick}
                className="w-full flex items-center justify-between py-4 px-6 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <Icon size={16} />
                    </div>
                    <span className="font-semibold text-slate-700">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

/**
 * STUDLYF ATS SYNTHESIS: PDF Generation Logic
 * This function is used by the dashboard and the builder to generate the final resume HTML.
 */
export function generatePdfHtml(data: ResumeData, template: string = 'classic') {
    if (!data) return "";
    
    // Fallback for older data structures if any
    const p = data.personalInfo || { firstName: "", lastName: "", email: "", phone: "", address: "", links: [] };
    const edu = data.education || [];
    const exp = data.experience || [];
    const skills = data.skills || { languages: [], frameworks: [], tools: [], databases: [] };
    const projs = data.projects || [];
    const certs = data.certifications || [];
    const add = data.additional || { honorsAndAwards: [] };

    const name = ((p.firstName || "") + " " + (p.lastName || "")).trim() || data.name || "YOUR NAME";

    if (template === 'modern') {
        const pHtml = `
            <div style="text-align:center;margin-bottom:30px">
                <h1 style="font-family:'Outfit', sans-serif;font-size:32pt;font-weight:300;letter-spacing:2px;margin-bottom:10px;text-transform:uppercase;color:#1e293b">
                    ${p.firstName || "FIRST"} <span style="font-weight:600">${p.lastName || "LAST"}</span>
                </h1>
                <div style="font-family:'Inter', sans-serif;font-size:10pt;color:#64748b;letter-spacing:1px;margin-bottom:15px">
                    ${p.email || ""} ${p.phone ? ` • ${p.phone}` : ""} ${p.address ? ` • ${p.address}` : ""}
                </div>
                <div style="border-bottom:1px solid #e2e8f0;width:100%"></div>
            </div>
        `;

        const sectionHeader = (title: string) => `
            <div style="display:flex;align-items:center;margin:20px 0 12px 0">
                <h2 style="font-family:'Outfit', sans-serif;font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0f172a;margin-right:15px;white-space:nowrap">${title}</h2>
                <div style="height:1px;background:#f1f5f9;width:100%"></div>
            </div>
        `;

        const eduHtml = edu.map((e: any) => `
            <div style="margin-bottom:12px;font-family:'Inter', sans-serif">
                <div style="display:flex;justify-content:space-between;align-items:baseline">
                    <span style="font-weight:700;font-size:11pt;color:#1e293b">${e.institution || ""}</span>
                    <span style="font-size:9pt;color:#64748b;font-weight:500">${e.year || ""}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:2px">
                    <span style="font-size:10pt;color:#475569">${e.degree || ""}</span>
                    <span style="font-size:9pt;font-weight:600;color:#059669">${e.gpa ? `GPA: ${e.gpa}` : ""}</span>
                </div>
            </div>`).join("");

        const expHtml = exp.map((ex: any) => `
            <div style="margin-bottom:18px;font-family:'Inter', sans-serif">
                <div style="display:flex;justify-content:space-between;align-items:baseline">
                    <span style="font-weight:700;font-size:11pt;color:#1e293b">${ex.company || ""}</span>
                    <span style="font-size:9pt;color:#64748b;font-weight:500">${ex.range || ""}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:2px;margin-bottom:6px">
                    <span style="font-size:10pt;font-weight:600;color:#475569">${ex.role || ""}</span>
                    <span style="font-size:9pt;color:#64748b">${ex.location || ""}</span>
                </div>
                <ul style="padding-left:14px;margin:0">
                    ${ex.points.split('\n').filter((pt: string) => pt.trim()).map((pt: string) => `<li style="font-size:9.5pt;color:#334155;margin-bottom:4px;line-height:1.4">${pt}</li>`).join("")}
                </ul>
            </div>`).join("");

        return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;600;700&display=swap" rel="stylesheet"/><style>
            body { font-family: 'Inter', sans-serif; line-height: 1.5; color: #1e293b; margin: 0; padding: 45px; }
            * { box-sizing: border-box; }
            @page { size: A4; margin: 0; }
        </style></head><body>
            ${pHtml}
            ${edu.length ? sectionHeader("Education") + eduHtml : ""}
            ${exp.length ? sectionHeader("Experience") + expHtml : ""}
        </body></html>`;
    }


    // Classic Template Logic (Matches renderClassicPreview but for PDF)
    const linksHtml = p.links?.length > 0 
        ? `<div style="font-size:9pt;text-align:center;margin-top:-8pt;margin-bottom:12pt;color: #475569;">
            ${p.links.map((l, i) => `${i > 0 ? " | " : ""}<span style="font-weight:700;">${l.label}:</span> ${l.url}`).join("")}
          </div>` 
        : "";

    const eduHtml = edu.length > 0 
        ? `<div><h2 style="font-size:10pt;font-weight:bold;border-bottom:1px solid black;margin:12pt 0 6pt 0;text-transform:uppercase;">Education</h2>
            ${edu.map(e => `
                <div style="margin-bottom:8pt">
                    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:10pt;">
                        <span>${e.institution || "University"}</span>
                        <span>${e.year || ""}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-style:italic;font-size:9pt;margin-top:2pt">
                        <span>${e.degree || ""}</span>
                        <span>${e.gpa ? `GPA: ${e.gpa}` : ""}</span>
                    </div>
                </div>`).join("")}</div>` 
        : "";

    const expHtml = exp.length > 0 
        ? `<div><h2 style="font-size:10pt;font-weight:bold;border-bottom:1px solid black;margin:12pt 0 6pt 0;text-transform:uppercase;">Experience</h2>
            ${exp.map(ex => `
                <div style="margin-bottom:10pt">
                    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:10pt;">
                        <span>${ex.company || "Company"}</span>
                        <span>${ex.range || ""}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-style:italic;font-size:9pt;margin-top:2pt;margin-bottom:2pt">
                        <span>${ex.role || ""}</span>
                        <span>${ex.location || ""}</span>
                    </div>
                    <ul style="padding-left:14pt;margin:0;">
                        ${ex.points.split('\n').filter(pt => pt.trim()).map(pt => `<li style="font-size:9pt;margin-bottom:2pt">${pt}</li>`).join("")}
                    </ul>
                </div>`).join("")}</div>` 
        : "";

    const skillsHtml = (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0 || skills.databases?.length > 0)
        ? `<div><h2 style="font-size:10pt;font-weight:bold;border-bottom:1px solid black;margin:12pt 0 6pt 0;text-transform:uppercase;">Skills</h2>
            ${skills.languages?.length > 0 ? `<div style="font-size:9pt;margin-bottom:4pt"><span style="font-weight:bold">Programming Languages: </span>${skills.languages.join(", ")}</div>` : ""}
            ${skills.frameworks?.length > 0 ? `<div style="font-size:9pt;margin-bottom:4pt"><span style="font-weight:bold">Libraries/Frameworks: </span>${skills.frameworks.join(", ")}</div>` : ""}
            ${skills.tools?.length > 0 ? `<div style="font-size:9pt;margin-bottom:4pt"><span style="font-weight:bold">Tools/Platforms: </span>${skills.tools.join(", ")}</div>` : ""}
            ${skills.databases?.length > 0 ? `<div style="font-size:9pt;margin-bottom:4pt"><span style="font-weight:bold">Databases: </span>${skills.databases.join(", ")}</div>` : ""}
          </div>`
        : "";

    const projHtml = projs.length > 0 
        ? `<div><h2 style="font-size:10pt;font-weight:bold;border-bottom:1px solid black;margin:12pt 0 6pt 0;text-transform:uppercase;">Projects / Open Source</h2>
            ${projs.map(pr => `
                <div style="margin-bottom:8pt">
                    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:10pt;">
                        <span>${pr.name.toUpperCase()} ${pr.link ? `<span style="font-weight:400;font-size:9pt">| ${pr.link}</span>` : ""}</span>
                        <span style="font-weight:400;font-size:9pt;font-style:italic">${pr.tech}</span>
                    </div>
                    <div style="font-size:9pt;color:#334155;margin-top:2pt;line-height:1.3">${pr.desc}</div>
                </div>`).join("")}</div>` 
        : "";

    const certHtml = certs.length > 0 
        ? `<div><h2 style="font-size:10pt;font-weight:bold;border-bottom:1px solid black;margin:12pt 0 6pt 0;text-transform:uppercase;">Certifications</h2>
            <ul style="padding-left:14pt;margin:0;">
                ${certs.map(c => `<li style="font-size:9pt;margin-bottom:2pt">${c}</li>`).join("")}
            </ul></div>` 
        : "";

    const honorsHtml = add.honorsAndAwards?.length > 0 
        ? `<div><h2 style="font-size:10pt;font-weight:bold;border-bottom:1px solid black;margin:12pt 0 6pt 0;text-transform:uppercase;">Honors & Awards</h2>
            <ul style="padding-left:14pt;margin:0;">
                ${add.honorsAndAwards.map(h => `<li style="font-size:9pt;margin-bottom:2pt">${h}</li>`).join("")}
            </ul></div>` 
        : "";

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>
        body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: black; margin: 0; padding: 40px; }
        * { box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        h1, h2, div, p, span, ul, li { margin: 0; padding: 0; }
    </style></head><body>
        <h1 style="font-size:24pt;font-weight:400;text-align:center;margin-bottom:4pt;text-transform:uppercase;">${name}</h1>
        <div style="font-size:9pt;text-align:center;margin-bottom:12pt;">
            ${p.email ? `<span>${p.email}</span>` : ""}
            ${p.phone ? `<span> | ${p.phone}</span>` : ""}
            ${p.address ? `<span> | ${p.address}</span>` : ""}
        </div>
        ${linksHtml}
        ${eduHtml}
        ${expHtml}
        ${skillsHtml}
        ${projHtml}
        ${certHtml}
        ${honorsHtml}
    </body></html>`;
}

export default function ResumeBuilder() {

    const { user } = useAuth();
    const [step, setStep] = useState<'dashboard' | 'create_new' | 'template_selection' | 'editor'>('create_new');
    const [hasExistingData, setHasExistingData] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern'>('classic');
    const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
    const [activeTab, setActiveTab] = useState<'details' | 'matcher'>('details');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        personalInfo: true,
        links: true,
        education: false,
        experience: false,
        skills: false,
        projects: false,
        certifications: false,
        additional: false
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("idle");
    const [isEditingName, setIsEditingName] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);

    // Fetch existing data
    useEffect(() => {
        async function fetchConfig() {
            if (!user?.uid) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/resume/${user.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.config) {
                        // Data Migration Logic / Structural Validation
                        const config = data.config;
                        let migratedData: ResumeData = { ...DEFAULT_RESUME_DATA };

                        // If it's the NEW structure (has personalInfo)
                        if (config.personalInfo) {
                            migratedData = {
                                ...DEFAULT_RESUME_DATA,
                                ...config,
                                personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, ...config.personalInfo },
                                skills: { ...DEFAULT_RESUME_DATA.skills, ...config.skills },
                                additional: { ...DEFAULT_RESUME_DATA.additional, ...config.additional }
                            };
                        } 
                        // If it's the OLD structure (has 'p')
                        else if (config.p) {
                            const nameParts = (config.p.name || "").split(" ");
                            migratedData.personalInfo = {
                                firstName: nameParts[0] || "",
                                lastName: nameParts.slice(1).join(" ") || "",
                                email: config.p.email || "",
                                phone: config.p.phone || "",
                                address: config.p.loc || "",
                                jobTitle: "",
                                links: config.p.li ? [{ label: "LinkedIn", url: config.p.li }] : []
                            };
                            if (config.exp) {
                                migratedData.experience = config.exp.map((ex: any) => ({
                                    company: ex.org || "",
                                    role: ex.role || "",
                                    range: ex.range || "",
                                    location: ex.loc || "",
                                    points: ex.pts || ""
                                }));
                            }
                            if (config.edu) {
                                migratedData.education = config.edu.map((ed: any) => ({
                                    institution: ed.inst || "",
                                    degree: ed.deg || "",
                                    year: ed.year || "",
                                    gpa: ed.gpa || ""
                                }));
                            }
                            if (config.proj) {
                                migratedData.projects = config.proj.map((pr: any) => ({
                                    name: pr.name || "",
                                    tech: pr.tech || "",
                                    desc: pr.desc || ""
                                }));
                            }
                            if (config.skills && Array.isArray(config.skills)) {
                                migratedData.skills.languages = config.skills;
                            }
                        }

                        setResumeData(migratedData);
                        setHasExistingData(true);
                        setStep('dashboard');
                    }
                }
            } catch (err) {
                console.error("Migration error:", err);
            }
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
                body: JSON.stringify({ config: resumeData })
            });
            if (!silent) { 
                setSaveStatus("saved"); 
                setTimeout(() => setSaveStatus("idle"), 2000); 
            }
        } finally { 
            setIsSaving(false); 
        }
    };

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const updatePersonalInfo = (field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const addLink = () => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                links: [...prev.personalInfo.links, { label: "", url: "" }]
            }
        }));
    };

    const updateLink = (index: number, field: 'label' | 'url', value: string) => {
        setResumeData(prev => {
            const newLinks = [...prev.personalInfo.links];
            newLinks[index] = { ...newLinks[index], [field]: value };
            return {
                ...prev,
                personalInfo: { ...prev.personalInfo, links: newLinks }
            };
        });
    };

    const removeLink = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                links: prev.personalInfo.links.filter((_, i) => i !== index)
            }
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { institution: "", degree: "", year: "", gpa: "" }]
        }));
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        setResumeData(prev => {
            const newEdu = [...prev.education];
            newEdu[index] = { ...newEdu[index], [field]: value };
            return { ...prev, education: newEdu };
        });
    };

    const removeEducation = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { company: "", role: "", range: "", location: "", points: "" }]
        }));
    };

    const updateExperience = (index: number, field: keyof Experience, value: string) => {
        setResumeData(prev => {
            const newExp = [...prev.experience];
            newExp[index] = { ...newExp[index], [field]: value };
            return { ...prev, experience: newExp };
        });
    };

    const removeExperience = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const addSkill = (type: keyof ResumeData['skills'], val: string) => {
        if (!val.trim()) return;
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: [...prev.skills[type], val]
            }
        }));
    };

    const removeSkill = (type: keyof ResumeData['skills'], index: number) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: prev.skills[type].filter((_, i) => i !== index)
            }
        }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { name: "", tech: "", desc: "", link: "" }]
        }));
    };

    const updateProject = (index: number, field: string, value: string) => {
        setResumeData(prev => {
            const newProj = [...prev.projects];
            newProj[index] = { ...newProj[index], [field]: value };
            return { ...prev, projects: newProj };
        });
    };

    const removeProject = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const addCertification = (val: string) => {
        if (!val.trim()) return;
        setResumeData(prev => ({
            ...prev,
            certifications: [...prev.certifications, val]
        }));
    };

    const removeCertification = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const addHonor = (val: string) => {
        if (!val.trim()) return;
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                honorsAndAwards: [...prev.additional.honorsAndAwards, val]
            }
        }));
    };

    const removeHonor = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                honorsAndAwards: prev.additional.honorsAndAwards.filter((_, i) => i !== index)
            }
        }));
    };

    // --- View Renderers ---


    if (step === 'dashboard') {
        const displayName = resumeData.personalInfo.firstName || user?.displayName?.split(' ')[0] || "User";
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <style>{styles}</style>
                {/* Dashboard Top Bar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm shrink-0">
                    <h1 className="text-2xl font-bold text-slate-700">Welcome <span className="text-[#7c3aed]">{displayName.toUpperCase()}!</span></h1>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Import Resume
                        </button>
                        <button 
                            onClick={() => setStep('template_selection')}
                            className="px-6 py-2.5 rounded-xl bg-[#008542] text-white font-bold hover:bg-[#006b35] transition-all shadow-md"
                        >
                            Create New
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto premium-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {/* Existing Resume Card */}
                            <motion.div 
                                whileHover={{ y: -5 }}
                                onClick={() => setStep('editor')}
                                className="group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h3 className="font-bold text-slate-600 tracking-tight">{displayName.toUpperCase()}'S Resume</h3>
                                    <span className="text-slate-300 font-black text-2xl">1</span>
                                </div>
                                <div className="aspect-[3/4] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative group-hover:shadow-2xl transition-all p-4">
                                    <div className="w-full h-full bg-slate-50 rounded-lg flex flex-col p-4 space-y-3 opacity-60">
                                        <div className="h-4 w-1/3 bg-slate-200 rounded mx-auto mb-4"></div>
                                        <div className="space-y-1.5">
                                            <div className="h-2 w-full bg-slate-200 rounded"></div>
                                            <div className="h-2 w-full bg-slate-200 rounded"></div>
                                            <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200 space-y-1.5">
                                            <div className="h-2 w-full bg-slate-200 rounded"></div>
                                            <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[#7c3aed]/0 group-hover:bg-[#7c3aed]/5 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white p-3 rounded-full shadow-xl">
                                            <Edit3 size={24} className="text-[#7c3aed]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Create New Add Card */}
                            <motion.div 
                                whileHover={{ y: -5 }}
                                onClick={() => setStep('template_selection')}
                                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 hover:border-[#7c3aed] hover:bg-white transition-all cursor-pointer group"
                            >
                                <div className="h-24 w-20 relative">
                                    <div className="absolute inset-0 bg-slate-50 rounded-lg transform translate-x-2 -translate-y-2 group-hover:bg-purple-50 transition-colors"></div>
                                    <div className="absolute inset-0 bg-white border-2 border-slate-200 rounded-lg transform -translate-x-2 translate-y-2 flex items-center justify-center group-hover:border-[#7c3aed] transition-colors">
                                        <Plus size={32} className="text-slate-400 group-hover:text-[#7c3aed] transition-colors" />
                                    </div>
                                </div>
                                <button className="bg-slate-500 text-white px-6 py-2 rounded-lg font-bold text-sm group-hover:bg-[#7c3aed] transition-colors shadow-md">
                                    Create New
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (step === 'create_new') {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <style>{styles}</style>
                <nav className="h-16 bg-[#0e141e] border-b border-white/5 flex items-center px-8">
                    <div className="flex items-center">
                        <span className="text-white font-black text-2xl tracking-tighter">ST</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-400 font-black text-2xl tracking-tighter">U</span>
                        <span className="text-white font-black text-2xl tracking-tighter">DLYF</span>
                    </div>
                </nav>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-4xl font-black text-slate-800 mb-4">Start your journey</h1>
                    <p className="text-slate-500 mb-10 max-w-md">Create a professional resume in minutes with our templates.</p>
                    
                    <button 
                        onClick={() => setStep('template_selection')}
                        className="flex items-center gap-3 bg-[#7c3aed] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-[#6d28d9] transition-all shadow-lg hover:shadow-purple-100 hover:-translate-y-1"
                    >
                        <Plus size={24} />
                        Create New
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'template_selection') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <style>{styles}</style>
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                    <div className="p-6 md:p-8 overflow-y-auto premium-scrollbar flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold">Select a template</h2>
                            <button onClick={() => setStep('create_new')} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-slate-500 mb-6">Choose a template and start creating resume with us.</p>

                        <div className="grid grid-cols-2 gap-6 md:gap-10 mb-8">
                            <div 
                                className={`template-card transition-all group ${selectedTemplate === 'classic' ? 'selected ring-2 ring-[#7c3aed] ring-offset-2' : 'hover:bg-slate-100'}`}
                                onClick={() => setSelectedTemplate('classic')}
                            >
                                <div className="aspect-[3/4] max-h-[350px] bg-white border border-slate-200 rounded-lg mb-4 overflow-hidden p-4 group-hover:shadow-md transition-shadow">
                                    <div className="h-full w-full bg-slate-50 relative">
                                        {/* Symbolic Classic Resume */}
                                        <div className="absolute inset-0 p-4 space-y-2 opacity-60">
                                            <div className="h-4 w-1/3 mx-auto bg-slate-300"></div>
                                            <div className="h-2 w-1/2 mx-auto bg-slate-200"></div>
                                            <div className="h-3 w-full bg-slate-100 pt-4 border-t border-slate-300"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                            <div className="h-2 w-2/3 bg-slate-100"></div>
                                            <div className="h-3 w-full bg-slate-100 pt-4 border-t border-slate-300"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedTemplate === 'classic' ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-slate-300'}`}>
                                        {selectedTemplate === 'classic' && <div className="h-1.5 w-3 border-b-2 border-r-2 border-white rotate-45 mb-0.5"></div>}
                                    </div>
                                    <span className="font-bold text-lg">Classic</span>
                                </div>
                            </div>

                            <div 
                                className={`template-card transition-all group ${selectedTemplate === 'modern' ? 'selected ring-2 ring-[#7c3aed] ring-offset-2' : 'hover:bg-slate-100'}`}
                                onClick={() => setSelectedTemplate('modern')}
                            >
                                <div className="aspect-[3/4] max-h-[350px] bg-white border border-slate-200 rounded-lg mb-4 overflow-hidden p-4 group-hover:shadow-md transition-shadow">
                                    <div className="h-full w-full bg-slate-50 flex">
                                        {/* Symbolic Modern Resume */}
                                        <div className="w-1/3 bg-slate-200 h-full p-2 space-y-2 opacity-60">
                                            <div className="h-8 w-8 rounded-full bg-slate-300"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                        </div>
                                        <div className="w-2/3 p-4 space-y-2 opacity-60">
                                            <div className="h-4 w-1/2 bg-slate-300"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                            <div className="h-2 w-full bg-slate-100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedTemplate === 'modern' ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-slate-300'}`}>
                                        {selectedTemplate === 'modern' && <div className="h-1.5 w-3 border-b-2 border-r-2 border-white rotate-45 mb-0.5"></div>}
                                    </div>
                                    <span className="font-bold text-lg">Modern</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 shrink-0">
                        <button 
                            onClick={() => setStep('create_new')}
                            className="px-10 py-3 rounded-lg border border-slate-200 font-bold hover:bg-slate-50 transition-colors bg-white"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => setStep('editor')}
                            className="px-10 py-3 rounded-lg bg-[#7c3aed] text-white font-bold hover:bg-[#6d28d9] transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Editor View ---
    const renderClassicPreview = () => {
        const { personalInfo: p, education: edu, experience: exp, skills, projects: projs, certifications, additional } = resumeData;
        
        return (
            <div className="classic-resume">
                <h1>{(p.firstName + " " + p.lastName).toUpperCase() || "YOUR NAME"}</h1>
                <div className="contact">
                    {p.email && <span>{p.email}</span>}
                    {p.phone && <span> | {p.phone}</span>}
                    {p.address && <span> | {p.address}</span>}
                </div>
                {p.links.length > 0 && (
                    <div className="contact" style={{ marginTop: '-8pt' }}>
                        {p.links.map((link, i) => (
                            <span key={i}>
                                {i > 0 && " | "}
                                <span className="font-bold">{link.label}:</span> {link.url}
                            </span>
                        ))}
                    </div>
                )}

                {edu.length > 0 && (
                    <>
                        <h2>Education</h2>
                        {edu.map((e, i) => (
                            <div key={i} className="mb-2">
                                <div className="entry-header">
                                    <span>{e.institution || "University"}</span>
                                    <span>{e.year || "Date"}</span>
                                </div>
                                <div className="entry-subtile">
                                    <span>{e.degree || "Degree"}</span>
                                    <span>{e.gpa && `GPA: ${e.gpa}`}</span>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {exp.length > 0 && (
                    <>
                        <h2>Experience</h2>
                        {exp.map((ex, i) => (
                            <div key={i} className="mb-3">
                                <div className="entry-header">
                                    <span>{ex.company || "Company"}</span>
                                    <span>{ex.range || "Date Range"}</span>
                                </div>
                                <div className="entry-subtile">
                                    <span>{ex.role || "Role"}</span>
                                    <span>{ex.location || "Location"}</span>
                                </div>
                                <ul>
                                    {ex.points.split('\n').filter(p => p.trim()).map((point, k) => (
                                        <li key={k}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </>
                )}

                {(skills.languages.length > 0 || skills.frameworks.length > 0 || skills.tools.length > 0 || skills.databases.length > 0) && (
                    <>
                        <h2>Skills</h2>
                        {skills.languages.length > 0 && (
                            <div className="skill-group">
                                <span className="skill-label">Programming Languages: </span>
                                <span>{skills.languages.join(", ")}</span>
                            </div>
                        )}
                        {skills.frameworks.length > 0 && (
                            <div className="skill-group">
                                <span className="skill-label">Libraries/Frameworks: </span>
                                <span>{skills.frameworks.join(", ")}</span>
                            </div>
                        )}
                        {skills.tools.length > 0 && (
                            <div className="skill-group">
                                <span className="skill-label">Tools/Platforms: </span>
                                <span>{skills.tools.join(", ")}</span>
                            </div>
                        )}
                        {skills.databases.length > 0 && (
                            <div className="skill-group">
                                <span className="skill-label">Databases: </span>
                                <span>{skills.databases.join(", ")}</span>
                            </div>
                        )}
                    </>
                )}

                {projs.length > 0 && (
                    <>
                        <h2>Projects / Open Source</h2>
                        {projs.map((pr, i) => (
                            <div key={i} className="mb-2">
                                <div className="entry-header">
                                    <span>{pr.name.toUpperCase()} {pr.link && <span className="font-normal">| {pr.link}</span>}</span>
                                    <span className="font-normal italic">{pr.tech}</span>
                                </div>
                                <div className="text-[9pt] leading-tight text-slate-700 mt-0.5">{pr.desc}</div>
                            </div>
                        ))}
                    </>
                )}

                {certifications.length > 0 && (
                    <>
                        <h2>Certifications</h2>
                        <ul className="list-disc pl-4">
                            {certifications.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </>
                )}

                {additional.honorsAndAwards.length > 0 && (
                    <>
                        <h2>Honors & Awards</h2>
                        <ul className="list-disc pl-4">
                            {additional.honorsAndAwards.map((h, i) => (
                                <li key={i}>{h}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    };

    const renderModernPreview = () => {
        const { personalInfo: p, education: edu, experience: exp, skills } = resumeData;

        return (
            <div className="modern-resume w-full">
                <style>{`
                    .modern-resume { font-family: 'Inter', sans-serif; color: #1e293b; }
                    .modern-header { text-align: center; margin-bottom: 30px; }
                    .modern-name { font-family: 'Outfit', sans-serif; font-size: 32pt; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; color: #1e293b; }
                    .modern-name span { font-weight: 600; }
                    .modern-contact { font-size: 10pt; color: #64748b; letter-spacing: 1px; margin-bottom: 20px; }
                    .modern-divider { border-bottom: 1px solid #e2e8f0; width: 100%; margin-bottom: 30px; }
                    .modern-section { margin-bottom: 25px; }
                    .modern-section-title { display: flex; align-items: center; margin-bottom: 12px; }
                    .modern-section-title h2 { font-family: 'Outfit', sans-serif; font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #0f172a; margin-right: 15px; white-space: nowrap; }
                    .modern-section-line { height: 1px; background: #f1f5f9; flex-grow: 1; }
                    .modern-entry { margin-bottom: 12px; }
                    .modern-entry-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 11pt; color: #1e293b; }
                    .modern-entry-sub { display: flex; justify-content: space-between; font-size: 10pt; color: #475569; margin-top: 2px; font-weight: 500; }
                    .modern-bullets { padding-left: 14px; margin-top: 6px; }
                    .modern-bullets li { font-size: 9.5pt; color: #334155; margin-bottom: 4px; line-height: 1.5; }
                    .modern-skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                    .modern-skill-item { font-size: 9.5pt; color: #334155; }
                    .modern-skill-label { font-weight: 700; color: #1e293b; }
                `}</style>
                <div className="modern-header">
                    <h1 className="modern-name">
                        {p?.firstName || "FIRST"} <span>{p?.lastName || "LAST"}</span>
                    </h1>
                    <div className="modern-contact">
                        {p?.email || "email@example.com"} 
                        {p?.phone && <span> • {p.phone}</span>} 
                        {p?.address && <span> • {p.address}</span>}
                    </div>
                    <div className="modern-divider"></div>
                </div>

                {edu.length > 0 && (
                    <div className="modern-section">
                        <div className="modern-section-title">
                            <h2>Education</h2>
                            <div className="modern-section-line"></div>
                        </div>
                        {edu.map((e, i) => (
                            <div key={i} className="modern-entry">
                                <div className="modern-entry-header">
                                    <span>{e.institution}</span>
                                    <span className="text-slate-400 font-medium">{e.year}</span>
                                </div>
                                <div className="modern-entry-sub">
                                    <span>{e.degree}</span>
                                    <span className="text-purple-600 font-bold">{e.gpa ? `GPA: ${e.gpa}` : ""}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {exp.length > 0 && (
                    <div className="modern-section">
                        <div className="modern-section-title">
                            <h2>Experience</h2>
                            <div className="modern-section-line"></div>
                        </div>
                        {exp.map((ex, i) => (
                            <div key={i} className="modern-entry">
                                <div className="modern-entry-header">
                                    <span>{ex.company}</span>
                                    <span className="text-slate-400 font-medium">{ex.range}</span>
                                </div>
                                <div className="modern-entry-sub">
                                    <span>{ex.role}</span>
                                    <span className="text-slate-400">{ex.location}</span>
                                </div>
                                <ul className="modern-bullets">
                                    {ex.points?.split('\n').filter(pt => pt.trim()).map((pt, k) => (
                                        <li key={k}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {(skills.languages?.length || skills.frameworks?.length || skills.tools?.length || skills.databases?.length) && (
                    <div className="modern-section">
                        <div className="modern-section-title">
                            <h2>Skills</h2>
                            <div className="modern-section-line"></div>
                        </div>
                        <div className="modern-skills-grid">
                            {skills.languages?.length > 0 && (
                                <div className="modern-skill-item">
                                    <span className="modern-skill-label">Languages: </span>{skills.languages.join(", ")}
                                </div>
                            )}
                            {skills.frameworks?.length > 0 && (
                                <div className="modern-skill-item">
                                    <span className="modern-skill-label">Frameworks: </span>{skills.frameworks.join(", ")}
                                </div>
                            )}
                            {skills.tools?.length > 0 && (
                                <div className="modern-skill-item">
                                    <span className="modern-skill-label">Tools: </span>{skills.tools.join(", ")}
                                </div>
                            )}
                            {skills.databases?.length > 0 && (
                                <div className="modern-skill-item">
                                    <span className="modern-skill-label">Databases: </span>{skills.databases.join(", ")}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <style>{styles}</style>
            
            {/* Top Navigation Bar */}
            <nav className="h-16 bg-[#0e141e] border-b border-white/5 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center cursor-pointer" onClick={() => setStep(hasExistingData ? 'dashboard' : 'create_new')}>
                        <span className="text-white font-black text-2xl tracking-tighter">ST</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-400 font-black text-2xl tracking-tighter">U</span>
                        <span className="text-white font-black text-2xl tracking-tighter">DLYF</span>
                    </div>
                    <div className="h-4 border-l border-white/10 mx-2"></div>
                    <button onClick={() => setStep(hasExistingData ? 'dashboard' : 'create_new')} className="text-slate-400 font-bold text-sm hover:text-white transition-colors">Home</button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                        <User size={18} />
                    </div>
                </div>
            </nav>

            {/* Editor Header */}
            <header className="editor-header">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <button onClick={() => setStep(hasExistingData ? 'dashboard' : 'create_new')} className="hover:text-purple-600 transition-colors">Home</button>
                            <ChevronRight size={12} />
                            <span>Resume Builder</span>
                        </div>
                        <div className="flex items-center gap-3 group mt-1">
                            {isEditingName ? (
                                <input 
                                    autoFocus
                                    value={resumeData.name} 
                                    onBlur={() => setIsEditingName(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                                    onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                                    className="text-2xl font-bold text-slate-800 outline-none w-auto max-w-[400px] border-b-2 border-purple-500 transition-all bg-transparent"
                                />
                            ) : (
                                <h1 
                                    onClick={() => setIsEditingName(true)}
                                    className="text-2xl font-bold text-slate-800 cursor-pointer hover:text-purple-600 transition-colors flex items-center gap-2"
                                >
                                    {resumeData.name}
                                    <Edit3 size={18} className="text-slate-300 transition-colors" />
                                </h1>
                            )}
                            <span className="flex items-center gap-1.5 text-xs font-medium text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                                Updated just now
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => setStep('template_selection')}
                        className="text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors flex items-center gap-2"
                    >
                        Change Template
                    </button>
                    <div className="flex items-center gap-3 relative">
                        <button 
                            onClick={() => setShowShareModal(true)}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <Share2 size={20} />
                        </button>
                        <button 
                            onClick={() => setShowAiPanel(true)}
                            className="hr-button-outline flex items-center gap-2"
                        >
                            Try AI Review <Sparkles size={16} />
                        </button>
                        <div className="relative">
                            <button 
                                onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                                className="hr-button-primary flex items-center gap-2"
                            >
                                Download <ChevronDown size={18} />
                            </button>
                            
                            {showDownloadDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button 
                                        onClick={async () => {
                                            setShowDownloadDropdown(false);
                                            await handleSave(true);
                                            const html = generatePdfHtml(resumeData, selectedTemplate);
                                            const frame = document.createElement("iframe");
                                            frame.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;";
                                            document.body.appendChild(frame);
                                            if (frame.contentWindow) {
                                                frame.contentWindow.document.open();
                                                frame.contentWindow.document.write(html);
                                                frame.contentWindow.document.close();
                                                frame.onload = () => { 
                                                    frame.contentWindow?.focus(); 
                                                    frame.contentWindow?.print(); 
                                                    setTimeout(() => document.body.removeChild(frame), 1000); 
                                                };
                                            }
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border-b border-slate-50"
                                    >
                                        Download Pdf
                                    </button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border-b border-slate-50">
                                        Download Latex
                                    </button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
                                        Download Json
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-slate-200 px-10">
                <div className="flex gap-10">
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`py-4 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${activeTab === 'details' ? 'border-purple-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Resume Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('matcher')}
                        className={`py-4 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${activeTab === 'matcher' ? 'border-purple-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Resume Matcher
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Form Area */}
                <div className="w-[45%] lg:w-[40%] bg-white border-r border-slate-200 overflow-y-auto premium-scrollbar pb-20">
                    <AccordionItem 
                        title="Personal Info" 
                        icon={User} 
                        isOpen={openSections.personalInfo} 
                        onClick={() => toggleSection('personalInfo')}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="hr-label">First Name</label>
                                <input 
                                    className="hr-input" 
                                    placeholder="John" 
                                    value={resumeData?.personalInfo?.firstName || ""} 
                                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="hr-label">Last Name</label>
                                <input 
                                    className="hr-input" 
                                    placeholder="Doe"
                                    value={resumeData?.personalInfo?.lastName || ""} 
                                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="hr-label">Email</label>
                                <input 
                                    className="hr-input" 
                                    placeholder="john.doe@example.com"
                                    value={resumeData?.personalInfo?.email || ""} 
                                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="hr-label">Phone</label>
                                <input 
                                    className="hr-input" 
                                    placeholder="+1 206 555 0100"
                                    value={resumeData?.personalInfo?.phone || ""} 
                                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="hr-label">Address</label>
                                <input 
                                    className="hr-input" 
                                    placeholder="123 Main Street, New York, NY"
                                    value={resumeData?.personalInfo?.address || ""} 
                                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="hr-label">Job Title</label>
                                <input 
                                    className="hr-input" 
                                    placeholder="Full-Stack Web Developer"
                                    value={resumeData?.personalInfo?.jobTitle || ""} 
                                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="mt-8">
                            <label className="hr-label mb-4 flex items-center justify-between">
                                Links ({resumeData.personalInfo.links.length}/5)
                            </label>
                            <div className="space-y-3">
                                {resumeData.personalInfo.links.map((link, i) => (
                                    <div key={i} className="flex gap-3 items-center group">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <input 
                                                className="hr-input" 
                                                placeholder="Label (e.g. GitHub)" 
                                                value={link.label}
                                                onChange={(e) => updateLink(i, 'label', e.target.value)}
                                            />
                                            <input 
                                                className="hr-input" 
                                                placeholder="URL" 
                                                value={link.url}
                                                onChange={(e) => updateLink(i, 'url', e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => removeLink(i)} className="text-slate-300 hover:text-red-500 p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={addLink}
                                    disabled={resumeData.personalInfo.links.length >= 5}
                                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all mt-4"
                                >
                                    <Plus size={18} /> Add Link
                                </button>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem 
                        title="Education" 
                        icon={GraduationCap} 
                        isOpen={openSections.education} 
                        onClick={() => toggleSection('education')}
                    >
                        {resumeData.education.map((edu, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 relative group">
                                <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="hr-label">Institution</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="hr-label">Degree</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="hr-label">Year / Range</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="hr-label">GPA / Score</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={edu.gpa} onChange={(e) => updateEducation(i, 'gpa', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={addEducation}
                            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            <Plus size={18} /> Add Education
                        </button>
                    </AccordionItem>

                    <AccordionItem 
                        title="Experience" 
                        icon={Briefcase} 
                        isOpen={openSections.experience} 
                        onClick={() => toggleSection('experience')}
                    >
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 relative group">
                                <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="hr-label">Company</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="hr-label">Role</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="hr-label">Range</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={exp.range} onChange={(e) => updateExperience(i, 'range', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="hr-label">Location</label>
                                        <input className="hr-input border-transparent focus:border-emerald-500" value={exp.location} onChange={(e) => updateExperience(i, 'location', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="hr-label">Achievements</label>
                                        <textarea 
                                            className="hr-input border-transparent focus:border-emerald-500 min-h-[100px]" 
                                            value={exp.points} 
                                            onChange={(e) => updateExperience(i, 'points', e.target.value)}
                                            placeholder="Write point by point, one per line..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={addExperience}
                            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            <Plus size={18} /> Add Experience
                        </button>
                    </AccordionItem>

                    <AccordionItem 
                        title="Skillsets" 
                        icon={Code2} 
                        isOpen={openSections.skills} 
                        onClick={() => toggleSection('skills')}
                    >
                        <div className="space-y-6">
                            {[
                                { key: 'languages', label: 'Add languages', icon: Terminal, placeholder: 'C++, Java, Python' },
                                { key: 'frameworks', label: 'Add libraries / frameworks', icon: Layout, placeholder: 'JavaScript, React' },
                                { key: 'tools', label: 'Add tools / platforms', icon: Cpu, placeholder: 'Git, VS Code' },
                                { key: 'databases', label: 'Add databases', icon: Database, placeholder: 'SQL, MongoDB' },
                            ].map((group) => (
                                <div key={group.key}>
                                    <label className="hr-label">{group.label}</label>
                                    <div className="flex gap-2">
                                        <input 
                                            id={`input-${group.key}`}
                                            className="hr-input" 
                                            placeholder={group.placeholder} 
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = (e.target as HTMLInputElement).value;
                                                    addSkill(group.key as any, val);
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }}
                                        />
                                        <button 
                                            onClick={() => {
                                                const el = document.getElementById(`input-${group.key}`) as HTMLInputElement;
                                                addSkill(group.key as any, el.value);
                                                el.value = '';
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 hover:bg-slate-100"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {resumeData.skills[group.key as keyof ResumeData['skills']].map((s, i) => (
                                            <div key={i} className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium group">
                                                {s}
                                                <button onClick={() => removeSkill(group.key as any, i)} className="text-slate-400 hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>

                    <AccordionItem 
                        title="Projects" 
                        icon={Briefcase} 
                        isOpen={openSections.projects} 
                        onClick={() => toggleSection('projects')}
                    >
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-slate-800 mb-2">Open Source / Personal Projects</h4>
                            {resumeData.projects.map((p, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-4 mb-4 relative group">
                                    <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="hr-label">Project Name</label>
                                            <input className="hr-input border-transparent focus:border-emerald-500" value={p.name} onChange={(e) => updateProject(i, 'name', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="hr-label">Technologies (e.g. React, Node.js)</label>
                                            <input className="hr-input border-transparent focus:border-emerald-500" value={p.tech} onChange={(e) => updateProject(i, 'tech', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="hr-label">Description</label>
                                            <textarea className="hr-input border-transparent focus:border-emerald-500 min-h-[80px]" value={p.desc} onChange={(e) => updateProject(i, 'desc', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="hr-label">Link (optional)</label>
                                            <input className="hr-input border-transparent focus:border-emerald-500" value={p.link} onChange={(e) => updateProject(i, 'link', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-3 mt-4">
                                <button 
                                    onClick={addProject}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    <Plus size={18} /> Add Contribution / Project
                                </button>
                                <button 
                                    className="px-6 flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    <GithubIcon size={18} /> Import
                                </button>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem 
                        title="Certifications" 
                        icon={CertificationIcon} 
                        isOpen={openSections.certifications} 
                        onClick={() => toggleSection('certifications')}
                    >
                         <div className="flex gap-2 mb-4">
                            <input 
                                id="input-cert"
                                className="hr-input" 
                                placeholder="AWS Certified Developer..." 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addCertification((e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('input-cert') as HTMLInputElement;
                                    addCertification(el.value);
                                    el.value = '';
                                }}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 hover:bg-slate-100"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {resumeData.certifications.map((c, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 group">
                                    <span className="text-sm font-medium">{c}</span>
                                    <button onClick={() => removeCertification(i)} className="text-slate-300 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>

                    <AccordionItem 
                        title="Additional: Honors & Awards" 
                        icon={Award} 
                        isOpen={openSections.additional} 
                        onClick={() => toggleSection('additional')}
                    >
                         <div className="flex gap-2 mb-4">
                            <input 
                                id="input-honor"
                                className="hr-input" 
                                placeholder="Dean's List 2023..." 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addHonor((e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('input-honor') as HTMLInputElement;
                                    addHonor(el.value);
                                    el.value = '';
                                }}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 hover:bg-slate-100"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {resumeData.additional.honorsAndAwards.map((h, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 group">
                                    <span className="text-sm font-medium">{h}</span>
                                    <button onClick={() => removeHonor(i)} className="text-slate-300 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>
                </div>

                {/* Right Preview Area */}
                <div className="flex-1 resume-preview-container overflow-y-auto premium-scrollbar flex flex-col items-center">
                    <div className="resume-paper animate-in fade-in zoom-in-95 duration-500">
                        {selectedTemplate === 'classic' ? renderClassicPreview() : renderModernPreview()}
                    </div>
                </div>
            </div>
            
            {/* Save Status Floating Indicator */}
            <div className="fixed bottom-6 right-6">
                <button 
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg font-bold transition-all ${saveStatus === 'saved' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-white hover:bg-purple-600'}`}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : (saveStatus === 'saved' ? <CheckCircle size={18} /> : <Save size={18} />)}
                    {isSaving ? 'Saving...' : (saveStatus === 'saved' ? 'Saved to Cloud' : 'Save Changes')}
                </button>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <h2 className="text-xl font-bold mb-6">Share Resume</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="hr-label mb-2">Resume Link</label>
                                        <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl group focus-within:border-emerald-500 transition-all">
                                            <input 
                                                readOnly
                                                value={`https://studlyf.io/resume/${user?.uid || 'shared'}`}
                                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-500 px-3"
                                            />
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`https://studlyf.io/resume/${user?.uid || 'shared'}`);
                                                    alert("Link copied to clipboard!");
                                                }}
                                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-y border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                                <Globe size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">Anyone with the link can view</div>
                                                <div className="text-xs text-slate-400">Public access enabled</div>
                                            </div>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-purple-500">
                                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-10 flex justify-end gap-3">
                                    <button 
                                        onClick={() => setShowShareModal(false)}
                                        className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => setShowShareModal(false)}
                                        className="px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* AI Review Side Panel */}
            <AnimatePresence>
                {showAiPanel && (
                    <div className="fixed inset-0 z-[300] flex justify-end bg-black/20 backdrop-blur-[2px]">
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-md h-full shadow-2xl p-0 flex flex-col"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <span className="font-bold text-slate-800">AI Resume Review</span>
                                <button onClick={() => setShowAiPanel(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto premium-scrollbar p-6">
                                <div className="aspect-[4/3] bg-purple-50 rounded-2xl mb-8 flex items-center justify-center overflow-hidden relative border border-purple-100">
                                     <div className="absolute top-4 left-4 bg-slate-900 h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-lg">
                                        <Sparkles size={18} />
                                     </div>
                                     {/* Symbolic Illustration mockup */}
                                     <div className="animate-pulse flex flex-col items-center gap-4">
                                        <div className="h-24 w-16 bg-white rounded-lg shadow-sm border border-purple-200 scale-110"></div>
                                        <div className="h-2 w-32 bg-purple-200 rounded-full"></div>
                                        <div className="h-2 w-24 bg-purple-200 rounded-full"></div>
                                     </div>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Introducing AI powered reviews</h2>
                                
                                <ul className="space-y-6 mb-10">
                                    <li className="flex gap-4">
                                        <div className="h-2 w-2 rounded-full bg-slate-800 mt-2.5 shrink-0" />
                                        <div className="text-slate-600 text-[15px] leading-relaxed">
                                            Get actionable feedback in less than 60 seconds.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="h-2 w-2 rounded-full bg-slate-800 mt-2.5 shrink-0" />
                                        <div className="text-slate-600 text-[15px] leading-relaxed">
                                            Receive personalized recommendations, according to the role you'd like to land.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="h-2 w-2 rounded-full bg-slate-800 mt-2.5 shrink-0" />
                                        <div className="text-slate-600 text-[15px] leading-relaxed">
                                            Increase your likelihood of landing interviews with a polished resume.
                                        </div>
                                    </li>
                                </ul>

                                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg inline-block text-sm font-bold mb-10">
                                    5 review credits available
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200/50"
                                    >
                                        Start Review
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                                        <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">i</div>
                                        1 review credit will be utilized
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
