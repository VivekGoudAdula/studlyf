import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../apiConfig';

// ─── Step Data ───────────────────────────────────────────────────
const PROJECT_TYPES = [
  {
    id: 'system_replica',
    title: 'System Replica',
    desc: 'Deconstruct and rebuild a real-world tech giant system from scratch.',
    icon: '◆',
    color: 'from-violet-600 to-purple-600',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
  },
  {
    id: 'original_build',
    title: 'Original Build',
    desc: 'Design and build an original system with production-grade architecture.',
    icon: '◇',
    color: 'from-emerald-600 to-teal-600',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'collaboration_request',
    title: 'Collaboration Request',
    desc: 'Post a project idea and find skilled engineers to build it with.',
    icon: '⟐',
    color: 'from-amber-600 to-orange-600',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
];

const ROLE_OPTIONS = [
  { id: 'frontend', label: 'Frontend', icon: '▢' },
  { id: 'backend', label: 'Backend', icon: '▣' },
  { id: 'devops', label: 'DevOps', icon: '⬡' },
  { id: 'ai', label: 'AI / ML', icon: '◈' },
  { id: 'ui_ux', label: 'UI/UX', icon: '◎' },
];

const TAG_OPTIONS = ['AI', 'Backend', 'System Design', 'Full Stack', 'DevOps', 'Beginner Friendly'];

const TIMELINE_OPTIONS = ['2 weeks', '3 weeks', '4 weeks', '5 weeks', '6 weeks', '8 weeks'];

// ─── Main Component ──────────────────────────────────────────────
const SDLProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [projectType, setProjectType] = useState('');
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [architectureFocus, setArchitectureFocus] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [timeline, setTimeline] = useState('4 weeks');
  const [rolesNeeded, setRolesNeeded] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [githubLink, setGithubLink] = useState('');
  const [overview, setOverview] = useState('');
  const [architectureBreakdown, setArchitectureBreakdown] = useState('');
  const [featureChecklist, setFeatureChecklist] = useState('');

  const toggleRole = (role: string) => {
    setRolesNeeded((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const canProceedStep1 = projectType !== '';
  const canProceedStep2 = title.trim() !== '' && problemStatement.trim() !== '' && architectureFocus.trim() !== '';

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const payload = {
        owner_id: user.uid,
        owner_name: user.displayName || user.email || 'Anonymous',
        owner_avatar: user.photoURL || null,
        title,
        project_type: projectType,
        problem_statement: problemStatement,
        architecture_focus: architectureFocus,
        skills_required: skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
        team_size: teamSize,
        timeline,
        roles_needed: rolesNeeded,
        tags,
        github_link: githubLink || null,
        overview: overview || null,
        architecture_breakdown: architectureBreakdown || null,
        feature_checklist: featureChecklist
          .split('\n')
          .filter(Boolean)
          .map((name) => ({ name: name.trim(), completed: false })),
      };

      const res = await fetch(`${API_BASE_URL}/api/sdl/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/job-prep/projects/${data.id}`);
      } else {
        alert('Failed to create project. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center gap-3 mb-12">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <button
            onClick={() => { if (s < step) setStep(s); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              s === step
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/40'
                : s < step
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30 cursor-pointer hover:bg-violet-500/30'
                  : 'bg-white/[0.04] text-white/20 border border-white/[0.06]'
            }`}
          >
            {s < step ? '✓' : s}
          </button>
          {s < 3 && (
            <div className={`h-[2px] w-12 rounded-full ${s < step ? 'bg-violet-500' : 'bg-white/[0.06]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080515] pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/job-prep/projects')}
          className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.2em] font-bold mb-8 hover:text-white/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          {step > 1 ? 'Previous Step' : 'Back to Lab'}
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.4em]">Project Creation Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight">
            Launch Your <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Lab Project</span>
          </h1>
        </motion.div>

        {stepIndicator}

        <AnimatePresence mode="wait">
          {/* ═══ STEP 1: Choose Project Type ═══ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="text-lg font-bold text-white/80 mb-6">Choose Project Type</h2>
              <div className="grid gap-4">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                      projectType === type.id
                        ? `${type.bg} ${type.border} shadow-lg`
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`text-2xl ${projectType === type.id ? 'opacity-100' : 'opacity-30'}`}>{type.icon}</span>
                      <div>
                        <h3 className={`font-bold text-lg mb-1 ${projectType === type.id ? 'text-white' : 'text-white/60'}`}>
                          {type.title}
                        </h3>
                        <p className="text-sm text-white/30">{type.desc}</p>
                      </div>
                      {projectType === type.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center shrink-0"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className={`mt-8 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.25em] transition-all ${
                  canProceedStep1
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-500/50'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ═══ STEP 2: Define Project ═══ */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="text-lg font-bold text-white/80 mb-6">Define Your Project</h2>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Project Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Netflix Streaming Engine Replica"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                {/* Problem Statement */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Problem Statement *</label>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="What system are you deconstructing? What engineering challenge does it solve?"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                  />
                </div>

                {/* Architecture Focus */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Architecture Focus *</label>
                  <input
                    value={architectureFocus}
                    onChange={(e) => setArchitectureFocus(e.target.value)}
                    placeholder="e.g., Microservices + Event-Driven, CQRS, Serverless"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Skills Required (comma-separated)</label>
                  <input
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                    placeholder="e.g., React, Node.js, Redis, Kafka, Docker"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                {/* Team Size + Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Team Size</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTeamSize(Math.max(1, teamSize - 1))}
                        className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
                      >−</button>
                      <span className="text-xl font-black text-white w-8 text-center">{teamSize}</span>
                      <button
                        onClick={() => setTeamSize(Math.min(10, teamSize + 1))}
                        className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
                      >+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Timeline</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/40 transition-all appearance-none"
                    >
                      {TIMELINE_OPTIONS.map((t) => (
                        <option key={t} value={t} className="bg-[#1A1030] text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                          tags.includes(tag)
                            ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                            : 'bg-white/[0.03] text-white/25 border border-white/[0.06] hover:text-white/40'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
                className={`mt-8 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.25em] transition-all ${
                  canProceedStep2
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-500/50'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ═══ STEP 3: Role Assignment & Details ═══ */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="text-lg font-bold text-white/80 mb-6">Roles & Architecture Details</h2>
              <div className="space-y-6">

                {/* Roles */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3 block">Roles Needed</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => toggleRole(role.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          rolesNeeded.includes(role.id)
                            ? 'bg-violet-600/15 border-violet-500/30 shadow-lg shadow-violet-600/10'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <span className="text-lg block mb-1">{role.icon}</span>
                        <span className={`text-sm font-bold ${rolesNeeded.includes(role.id) ? 'text-white' : 'text-white/40'}`}>
                          {role.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* GitHub Link */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">GitHub Repository (optional)</label>
                  <input
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                {/* Overview */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Project Overview</label>
                  <textarea
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="High-level overview of what you're building and why..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                  />
                </div>

                {/* Architecture Breakdown */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Architecture Breakdown</label>
                  <textarea
                    value={architectureBreakdown}
                    onChange={(e) => setArchitectureBreakdown(e.target.value)}
                    placeholder="Describe the system layers, services, data flow..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                  />
                </div>

                {/* Feature Checklist */}
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Feature Checklist (one per line)</label>
                  <textarea
                    value={featureChecklist}
                    onChange={(e) => setFeatureChecklist(e.target.value)}
                    placeholder={"User authentication\nReal-time messaging\nVideo streaming pipeline\nRecommendation engine\nAdmin dashboard"}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none font-mono"
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                onClick={handleSubmit}
                className="mt-8 w-full py-5 rounded-xl font-bold text-sm uppercase tracking-[0.25em] bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xl shadow-violet-600/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initializing Lab...
                  </span>
                ) : (
                  '◆ Launch Project'
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SDLProjectCreate;
