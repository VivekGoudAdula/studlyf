import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../apiConfig";
import Navigation from "../components/Navigation";

const PURPLE = "#7C3AED";
const BG = "#F4F4F6";

const roles = ["Backend Developer", "Frontend Developer", "Data Analyst", "GenAI Intern", "ML Engineer", "DevOps Engineer"];
const institutions = ["Google", "Amazon", "Microsoft", "Stripe", "Deloitte", "Goldman Sachs"];

const questionBank: any = {
    "GenAI Intern": [
        {
            gate: 1, topic: "RETRIEVAL AUGMENTED GENERATION (RAG) // VECTOR STORES & INDEXING", difficulty: "MEDIUM", impact: "High Risk", impactLevel: 0.35,
            question: "A {institution} client requires a RAG system to query vast, continuously updated internal regulatory documents. The primary requirement is high throughput and sub-second latency for embedding similarity search. What specific type of indexing strategy would you recommend for the vector database, and why?"
        },
        {
            gate: 2, topic: "SECURITY & PROMPT ENGINEERING // INJECTION MITIGATION", difficulty: "HARD", impact: "High Risk", impactLevel: 0.6,
            question: "A client's internal GenAI chatbot uses RAG and accepts user queries appended directly to a system prompt. An attacker attempts a Prompt Injection attack to leak confidential data retrieved via RAG. Propose two specific technical strategies to mitigate this vulnerability without completely disabling user input."
        },
        {
            gate: 3, topic: "AGENTIC AI // MULTI-STEP ORCHESTRATION", difficulty: "HARD", impact: "Critical", impactLevel: 0.8,
            question: "Design a multi-agent system for {institution} that autonomously monitors competitor pricing and generates strategic response recommendations. Define the agent roles, communication protocol, and how you'd prevent runaway costs or hallucinated actions."
        },
    ],
    "Backend Developer": [
        {
            gate: 1, topic: "SYSTEM DESIGN // DATABASE ARCHITECTURE", difficulty: "MEDIUM", impact: "High Risk", impactLevel: 0.4,
            question: "A {institution} e-commerce platform experiences 10x traffic spikes during sales events. Design a database sharding strategy that ensures sub-100ms query times while maintaining ACID properties for order transactions."
        },
        {
            gate: 2, topic: "API DESIGN // RATE LIMITING & THROTTLING", difficulty: "HARD", impact: "High Risk", impactLevel: 0.55,
            question: "Implement a distributed rate limiter for a {institution} public API handling 1M requests/second across 50 server instances. Design the algorithm and explain how you handle edge cases like clock drift and network partitions."
        },
    ],
    "Frontend Developer": [
        {
            gate: 1, topic: "PERFORMANCE // CORE WEB VITALS", difficulty: "MEDIUM", impact: "Medium Risk", impactLevel: 0.3,
            question: "A {institution} dashboard has an LCP of 8 seconds and CLS of 0.35. Walk through your diagnostic process and the specific optimizations you'd implement to reach 'Good' thresholds."
        },
        {
            gate: 2, topic: "ARCHITECTURE // MICRO-FRONTENDS", difficulty: "HARD", impact: "High Risk", impactLevel: 0.6,
            question: "Design a micro-frontend architecture for {institution}'s large-scale web app with 5 independent teams. Address module federation, shared state management, and deployment strategies."
        },
    ],
    "Data Analyst": [
        {
            gate: 1, topic: "DATA PIPELINE // ETL DESIGN", difficulty: "MEDIUM", impact: "Medium Risk", impactLevel: 0.35,
            question: "A {institution} data warehouse ingests 2TB of raw event data daily from 200 sources. Design an ETL pipeline ensuring data quality, handling late-arriving data, and supporting ad-hoc analytical queries with sub-5s response times."
        },
        {
            gate: 2, topic: "STATISTICS // A/B TESTING DESIGN", difficulty: "HARD", impact: "High Risk", impactLevel: 0.5,
            question: "{institution} wants to run an A/B test for a checkout flow change expected to increase conversion by 2%. Explain how you'd determine sample size, run duration, and how you'd handle novelty effects and multiple comparisons."
        },
    ],
};

const diffColor: any = { MEDIUM: "#8B5CF6", HARD: "#EF4444", EASY: "#10B981" };
const verdictColor = (v: string) => ({ "STRONG PASS": "#10B981", "PASS": "#10B981", "BORDERLINE": "#F59E0B", "FAIL": "#EF4444" }[v] || PURPLE);


function ConfigScreen({ onGenerate }: any) {
    const [role, setRole] = useState("GenAI Intern");
    const [institution, setInstitution] = useState("Deloitte");
    const [customInst, setCustomInst] = useState("");
    const [experience, setExperience] = useState("FRESHER");
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => onGenerate({ role, institution: customInst || institution, experience }), 1800);
    };
    const instDisplay = customInst || institution;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: BG, padding: "40px 60px", gap: 60, marginTop: "80px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 28, width: "fit-content" }}>
                    <span style={{ color: PURPLE, fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>⚙️ INSTITUTIONAL ENGINE V2.1</span>
                </div>
                <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, color: "#1a1a2e" }}>CLINICAL</div>
                <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, color: PURPLE, fontStyle: "italic", marginBottom: 28 }}>READY.</div>
                <p style={{ color: "#666", fontSize: 17, lineHeight: 1.6, maxWidth: 380 }}>
                    Calibrate your assessment protocol by specifying your target role and <span style={{ color: PURPLE, fontWeight: 600 }}>institution</span>.
                </p>
            </div>
            <div style={{ width: 420, background: "white", borderRadius: 20, padding: 36, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 10 }}>TARGET ROLE</div>
                    <div style={{ border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span>💼</span>
                        <select value={role} onChange={e => setRole(e.target.value)} style={{ border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#1a1a2e", flex: 1, background: "transparent", cursor: "pointer" }}>
                            {roles.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["Backend Developer", "Frontend Developer", "Data Analyst"].map(r => (
                            <button key={r} onClick={() => setRole(r)} style={{ background: role === r ? PURPLE : "transparent", color: role === r ? "white" : "#888", border: "1px solid " + (role === r ? PURPLE : "#ddd"), borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5 }}>{r.toUpperCase()}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 10 }}>TARGET INSTITUTION</div>
                    <div style={{ border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span>🏢</span>
                        <input value={instDisplay} onChange={e => setCustomInst(e.target.value)} placeholder="e.g. Google" style={{ border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#1a1a2e", flex: 1 }} />
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["Google", "Amazon", "Microsoft", "Stripe"].map(inst => (
                            <button key={inst} onClick={() => { setInstitution(inst); setCustomInst(""); }} style={{ background: instDisplay === inst ? PURPLE : "transparent", color: instDisplay === inst ? "white" : "#888", border: "1px solid " + (instDisplay === inst ? PURPLE : "#ddd"), borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5 }}>{inst.toUpperCase()}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 10 }}>EXPERIENCE LEVEL</div>
                    <div style={{ display: "flex", gap: 10 }}>
                        {["FRESHER", "1-3 YRS", "3-5 YRS"].map(lvl => (
                            <button key={lvl} onClick={() => setExperience(lvl)} style={{ flex: 1, background: experience === lvl ? PURPLE : "white", color: experience === lvl ? "white" : "#555", border: "1.5px solid " + (experience === lvl ? PURPLE : "#ddd"), borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: 0.5 }}>{lvl}</button>
                        ))}
                    </div>
                </div>
                <button onClick={handleGenerate} disabled={generating} style={{ background: generating ? "#ccc" : PURPLE, color: "white", border: "none", borderRadius: 12, padding: "18px", fontWeight: 800, fontSize: 13, letterSpacing: 2, cursor: generating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    {generating ? "GENERATING PROTOCOL..." : "GENERATE PROTOCOL →"}
                </button>
                <div style={{ textAlign: "center", fontSize: 10, color: "#bbb", letterSpacing: 1, marginTop: -12 }}>ENCRYPTION LEVEL: AES-256 VALIDATED</div>
            </div>
        </div>
    );
}

function SyncScreen({ config, onStart }: any) {
    const [ready, setReady] = useState(false);
    useEffect(() => { const t = setTimeout(() => setReady(true), 2500); return () => clearTimeout(t); }, []);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: BG, padding: 40, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: PURPLE, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 28, boxShadow: "0 8px 30px rgba(124,58,237,0.4)" }}>🎯</div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>PROTOCOL <span style={{ color: PURPLE }}>SYNCHRONIZED.</span></h1>
            <p style={{ color: "#555", fontSize: 16, marginTop: 16, marginBottom: 40 }}>We have synthesized an adaptive assessment for <strong>{config.role}</strong> at <strong>{config.institution}</strong>. The difficulty will pivot based on your performance.</p>
            <div style={{ display: "flex", gap: 20, marginBottom: 48 }}>
                {[["🧠", "STYLE", "PROBLEM-SOLVING"], ["🕐", "ADAPTIVE", "ON"], ["🛡️", "VERIFICATION", "CLINICAL"]].map(([icon, label, value]) => (
                    <div key={label} style={{ background: "white", borderRadius: 14, padding: "24px 32px", border: "1px solid #eee", minWidth: 160, textAlign: "left", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                        <div style={{ fontSize: 22, marginBottom: 10, color: PURPLE }}>{icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 6 }}>{label}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>{value}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
                <button style={{ background: "white", border: "1.5px solid #ddd", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 12, cursor: "pointer", color: "#555", letterSpacing: 1 }}>RE-CALIBRATE</button>
                <button onClick={() => ready && onStart()} style={{ background: ready ? PURPLE : "#aaa", color: "white", border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 12, cursor: ready ? "pointer" : "not-allowed", letterSpacing: 1 }}>
                    {ready ? "BEGIN ASSESSMENT →" : "SYNTHESIZING PROTOCOL..."}
                </button>
            </div>
        </div>
    );
}

function Timer({ start }: any) {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => { const t = setInterval(() => setElapsed(p => p + 1), 1000); return () => clearInterval(t); }, [start]);
    const remaining = Math.max(0, 180 - elapsed);
    const color = remaining < 30 ? "#EF4444" : remaining < 60 ? "#F59E0B" : PURPLE;
    return <span style={{ color, fontWeight: 700, fontSize: 14 }}>⏱ {remaining}s</span>;
}

function QuestionScreen({ config, questions, onComplete }: any) {
    const [gateIdx, setGateIdx] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [submitted, setSubmitted] = useState<any>({});
    const [feedback, setFeedback] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const q = questions[gateIdx];
    const questionText = q.question.replace(/{institution}/g, config.institution);
    const currentAnswer = answers[gateIdx] || "";
    const fb = feedback[gateIdx];
    const isSubmitted = submitted[gateIdx];
    const isLast = gateIdx === questions.length - 1;

    const handleSubmit = async () => {
        if (!currentAnswer.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/ai/evaluate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 1000,
                    messages: [{ role: "user", content: `You are a senior technical interviewer at ${config.institution} for the role of ${config.role} (${config.experience}).\n\nQuestion: "${questionText}"\n\nCandidate answer: "${currentAnswer}"\n\nEvaluate and respond ONLY with a valid JSON object (no markdown, no backticks):\n{"score": <0-100>, "verdict": "<STRONG PASS|PASS|BORDERLINE|FAIL>", "strengths": ["str1", "str2"], "gaps": ["gap1", "gap2"], "ideal_approach": "<2-3 sentence model answer>"}` }]
                })
            });
            const parsed = await res.json();
            setFeedback((p: any) => ({ ...p, [gateIdx]: parsed }));
        } catch (e) {
            setFeedback((p: any) => ({ ...p, [gateIdx]: { error: true, score: 0, verdict: "ERROR", strengths: [], gaps: ["Evaluation failed. Please retry."], ideal_approach: "" } }));
        }
        setSubmitted((p: any) => ({ ...p, [gateIdx]: true }));
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: BG, padding: "32px 40px", gap: 24, marginTop: "80px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ background: PURPLE, color: "white", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>GATE {q.gate}</div>
                        <span style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: 1 }}>{q.topic}</span>
                    </div>
                    {!isSubmitted && <Timer start={gateIdx} />}
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", flex: 1 }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.5, margin: "0 0 24px" }}>{questionText}</p>
                    {!isSubmitted ? (
                        <>
                            <textarea value={currentAnswer} onChange={e => setAnswers((p: any) => ({ ...p, [gateIdx]: e.target.value }))} placeholder="Type your technical response, architectural sketch, or solution logic here..." style={{ width: "100%", minHeight: 160, border: "1.5px solid #e0e0e0", borderRadius: 10, padding: 16, fontSize: 14, fontFamily: "monospace", resize: "vertical", outline: "none", boxSizing: "border-box", color: "#333", lineHeight: 1.6 }} />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                                <span style={{ fontSize: 11, color: "#bbb", letterSpacing: 1 }}>SUPPORTS MARKDOWN & LOGIC SCHEMAS</span>
                                <button onClick={handleSubmit} disabled={loading || !currentAnswer.trim()} style={{ background: loading || !currentAnswer.trim() ? "#ccc" : PURPLE, color: "white", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800, fontSize: 12, cursor: loading || !currentAnswer.trim() ? "not-allowed" : "pointer", letterSpacing: 1 }}>
                                    {loading ? "EVALUATING..." : "SUBMIT INTELLIGENCE →"}
                                </button>
                            </div>
                        </>
                    ) : fb && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                <div style={{ background: verdictColor(fb.verdict), color: "white", borderRadius: 10, padding: "10px 20px", fontWeight: 800, fontSize: 14 }}>{fb.verdict}</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: verdictColor(fb.verdict) }}>{fb.score}/100</div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 1, marginBottom: 8 }}>✅ STRENGTHS</div>
                                    {(fb.strengths || []).map((s: any, i: number) => <div key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>• {s}</div>)}
                                </div>
                                <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: 1, marginBottom: 8 }}>⚠️ GAPS</div>
                                    {(fb.gaps || []).map((g: any, i: number) => <div key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>• {g}</div>)}
                                </div>
                            </div>
                            {fb.ideal_approach && (
                                <div style={{ background: "#F5F3FF", borderRadius: 10, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, letterSpacing: 1, marginBottom: 8 }}>💡 IDEAL APPROACH</div>
                                    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{fb.ideal_approach}</div>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button onClick={() => isLast ? onComplete(feedback) : setGateIdx(p => p + 1)} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                                    {isLast ? "VIEW FINAL REPORT →" : `PROCEED TO GATE ${q.gate + 1} →`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {questions.map((_: any, i: number) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < gateIdx ? PURPLE : i === gateIdx ? "#8B5CF6" : "#ddd" }} />)}
                </div>
            </div>
            <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#0f0a1a", borderRadius: 16, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#666", marginBottom: 16 }}>LIVE RESPONSE MESH</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ color: "#888", fontSize: 12 }}>DIFFICULTY</span>
                        <span style={{ color: diffColor[q.difficulty] || PURPLE, fontWeight: 800, fontSize: 13 }}>{q.difficulty}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ color: "#888", fontSize: 12 }}>SYSTEM IMPACT</span>
                        <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{q.impact}</span>
                    </div>
                    <div style={{ background: "#1a1a2e", borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${q.impactLevel * 100}%`, height: "100%", background: PURPLE, borderRadius: 4 }} />
                    </div>
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 14 }}>INTERVIEW SIMULATION</div>
                    <div style={{ borderLeft: `3px solid ${PURPLE}`, paddingLeft: 14 }}>
                        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, fontStyle: "italic" }}>"{config.institution} typically looks for candidates who can explain the trade-offs of their decisions under pressure."</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportScreen({ config, questions, feedback, onRestart }: any) {
    const scores = Object.values(feedback).filter((f: any) => f && f.score !== undefined);
    const avg = scores.length ? Math.round(scores.reduce((a: any, b: any) => (a as any) + (b.score || 0), 0) / scores.length) : 0;
    const verdict = avg >= 80 ? "STRONG PASS" : avg >= 65 ? "PASS" : avg >= 50 ? "BORDERLINE" : "FAIL";
    return (
        <div style={{ minHeight: "100vh", background: BG, padding: "40px 80px", marginTop: "80px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>ASSESSMENT <span style={{ color: PURPLE }}>COMPLETE.</span></h1>
                <p style={{ color: "#666", marginTop: 12 }}>{config.role} @ {config.institution} • {config.experience}</p>
            </div>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 40 }}>
                <div style={{ background: "white", borderRadius: 16, padding: 32, textAlign: "center", minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: verdictColor(verdict) }}>{avg}</div>
                    <div style={{ fontSize: 12, color: "#999", letterSpacing: 1, marginTop: 4 }}>OVERALL SCORE</div>
                </div>
                <div style={{ background: verdictColor(verdict), borderRadius: 16, padding: 32, textAlign: "center", minWidth: 160 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "white" }}>{verdict}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1, marginTop: 6 }}>FINAL VERDICT</div>
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: 32, textAlign: "center", minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: PURPLE }}>{scores.length}</div>
                    <div style={{ fontSize: 12, color: "#999", letterSpacing: 1, marginTop: 4 }}>GATES COMPLETED</div>
                </div>
            </div>
            {Object.entries(feedback).map(([idx, fb]: any) => {
                if (!fb || !fb.verdict) return null;
                const q = questions[parseInt(idx)];
                return (
                    <div key={idx} style={{ background: "white", borderRadius: 16, padding: 28, marginBottom: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div>
                                <span style={{ background: PURPLE, color: "white", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>GATE {q.gate}</span>
                                <span style={{ marginLeft: 12, fontSize: 11, color: "#888" }}>{q.topic}</span>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <span style={{ fontWeight: 800, fontSize: 20, color: verdictColor(fb.verdict) }}>{fb.score}/100</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: verdictColor(fb.verdict) }}>{fb.verdict}</span>
                            </div>
                        </div>
                        {fb.ideal_approach && <div style={{ fontSize: 13, color: "#555", fontStyle: "italic", lineHeight: 1.5 }}>{fb.ideal_approach}</div>}
                    </div>
                );
            })}
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <button onClick={onRestart} style={{ background: PURPLE, color: "white", border: "none", borderRadius: 12, padding: "16px 40px", fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 1, boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>NEW PROTOCOL →</button>
            </div>
        </div>
    );
}

export default function SkillAssessment() {
    const { user } = useAuth();
    const [screen, setScreen] = useState("config");
    const [config, setConfig] = useState<any>(null);
    const [questions, setQuestions] = useState<any>([]);
    const [feedback, setFeedback] = useState<any>({});

    const handleGenerate = (cfg: any) => {
        setConfig(cfg);
        setQuestions(questionBank[cfg.role] || questionBank["GenAI Intern"]);
        setScreen("sync");
    };

    const handleComplete = async (fb: any) => {
        setFeedback(fb);
        setScreen("report");
        if (user) {
            try {
                await fetch(`${API_BASE_URL}/api/skill-assessment/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: user.uid, config, feedback: fb, questions })
                });
            } catch (e) {
                console.error("Save error:", e);
            }
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            <Navigation />
            {screen === "config" && <ConfigScreen onGenerate={handleGenerate} />}
            {screen === "sync" && <SyncScreen config={config} onStart={() => setScreen("test")} />}
            {screen === "test" && <QuestionScreen config={config} questions={questions} onComplete={handleComplete} />}
            {screen === "report" && <ReportScreen config={config} questions={questions} feedback={feedback} onRestart={() => { setConfig(null); setQuestions([]); setFeedback({}); setScreen("config"); }} />}
        </div>
    );
}
