import React, { useState, useEffect, useCallback } from 'react';
import { Gavel, Star, MessageSquare, Save, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL, authHeaders } from '../../../apiConfig';
import { useAuth } from '../../../AuthContext';

type SubmissionAssignment = {
    _id: string;
    event_id?: string;
    team_id?: string;
    project_title?: string;
    team_name?: string;
    status?: string;
    submission_url?: string;
};

interface JudgeDashboardProps {
    /** When set, judge can filter assignments to one of this institution's events (optional). */
    institutionId?: string;
}

const JudgeDashboard: React.FC<JudgeDashboardProps> = ({ institutionId }) => {
    const { user } = useAuth();
    const [assignedProjects, setAssignedProjects] = useState<SubmissionAssignment[]>([]);
    const [activeProject, setActiveProject] = useState<SubmissionAssignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [eventFilter, setEventFilter] = useState<string>('');
    const [institutionEvents, setInstitutionEvents] = useState<{ _id: string; title: string }[]>([]);
    const [inviteEventId, setInviteEventId] = useState('');
    const [inviteBusy, setInviteBusy] = useState(false);
    const [scores, setScores] = useState({
        innovation: 0,
        technicality: 0,
        impact: 0,
        presentation: 0,
    });
    const [comments, setComments] = useState('');

    const loadAssignments = useCallback(async () => {
        try {
            const q = eventFilter ? `?event_id=${encodeURIComponent(eventFilter)}` : '';
            const response = await fetch(
                `${API_BASE_URL}/api/v1/institution/judge/my-assignments${q}`,
                { headers: { ...authHeaders() } }
            );
            if (response.status === 401) {
                setAssignedProjects([]);
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch assignments');
            const data = await response.json();
            setAssignedProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Judge assignments fetch error:', error);
            setAssignedProjects([]);
        } finally {
            setLoading(false);
        }
    }, [eventFilter]);

    useEffect(() => {
        setLoading(true);
        loadAssignments();
    }, [loadAssignments]);

    useEffect(() => {
        if (!institutionId) return;
        const loadEvents = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/v1/institution/events/${institutionId}`,
                    { headers: { ...authHeaders() } }
                );
                if (!res.ok) return;
                const data = await res.json();
                if (!Array.isArray(data)) return;
                setInstitutionEvents(
                    data.map((e: any) => ({ _id: String(e._id), title: e.title || 'Event' }))
                );
            } catch {
                /* ignore */
            }
        };
        loadEvents();
    }, [institutionId]);

    const handleScoreChange = (criteria: keyof typeof scores, value: number) => {
        setScores((prev) => ({ ...prev, [criteria]: value }));
    };

    const handleSaveScore = async () => {
        if (!activeProject?._id || !activeProject.event_id) {
            alert('Missing submission or event — cannot save score.');
            return;
        }
        setSaving(true);
        try {
            const teamId = activeProject.team_id ? String(activeProject.team_id) : undefined;
            const response = await fetch(`${API_BASE_URL}/api/v1/institution/judge/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({
                    submission_id: activeProject._id,
                    event_id: String(activeProject.event_id),
                    team_id: teamId,
                    criteria_scores: scores,
                    feedback: comments,
                }),
            });
            if (response.ok) {
                alert('Score saved successfully!');
                setActiveProject(null);
                setComments('');
                await loadAssignments();
            } else {
                const err = await response.json().catch(() => ({}));
                alert(err.detail || 'Could not save score. Check you are assigned to this submission.');
            }
        } catch (error) {
            console.error('Failed to save score:', error);
            alert('Network error while saving score.');
        } finally {
            setSaving(false);
        }
    };

    const respondInvitation = async (accept: boolean) => {
        const eid = inviteEventId.trim();
        if (!eid) {
            alert('Enter the event ID from your invitation email.');
            return;
        }
        setInviteBusy(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/institution/judge/respond-invitation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({ event_id: eid, accept }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                alert(body.detail || 'Could not update invitation.');
                return;
            }
            alert(accept ? 'Invitation accepted.' : 'Invitation declined.');
            setInviteEventId('');
        } catch (e) {
            console.error(e);
            alert('Network error.');
        } finally {
            setInviteBusy(false);
        }
    };

    const displayEmail = user?.email || user?.user_id || 'Sign in to judge';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[320px] text-slate-500 font-medium">
                Loading your assignments…
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Signed in</p>
                    <p className="text-sm font-bold text-slate-900">{displayEmail}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        You only see submissions your institution assigned to your email.
                    </p>
                </div>
                {institutionEvents.length > 0 && (
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500">Filter by event</label>
                        <select
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                        >
                            <option value="">All assigned events</option>
                            {institutionEvents.map((ev) => (
                                <option key={ev._id} value={ev._id}>
                                    {ev.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    Judge invitation (from email)
                </p>
                <div className="flex flex-wrap gap-2 items-end">
                    <input
                        type="text"
                        value={inviteEventId}
                        onChange={(e) => setInviteEventId(e.target.value)}
                        placeholder="Paste event ID"
                        className="flex-1 min-w-[200px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <button
                        type="button"
                        disabled={inviteBusy}
                        onClick={() => respondInvitation(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50"
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        disabled={inviteBusy}
                        onClick={() => respondInvitation(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-50"
                    >
                        Decline
                    </button>
                </div>
            </div>

            <div className="flex gap-8 min-h-[calc(100vh-280px)]">
                <div className="w-80 bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm shrink-0">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Gavel size={20} className="text-purple-600" />
                            Assigned projects
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {assignedProjects.length === 0 ? (
                            <p className="text-sm text-slate-500 px-2">
                                No submissions to review yet, or your account has no judge assignments for this filter.
                            </p>
                        ) : (
                            assignedProjects.map((project) => (
                                <button
                                    key={project._id}
                                    onClick={() => setActiveProject(project)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                                        activeProject?._id === project._id
                                            ? 'bg-purple-50 border-2 border-purple-200'
                                            : 'hover:bg-gray-50 border-2 border-transparent'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900 line-clamp-1">
                                            {project.project_title || 'Untitled project'}
                                        </span>
                                        {project.status === 'Scored' && (
                                            <Star size={14} className="text-yellow-500 fill-yellow-500 shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {project.team_name || 'Team'}
                                        </span>
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                project.status === 'Scored'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}
                                        >
                                            {project.status || 'Submitted'}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto min-w-0">
                    {activeProject ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8"
                        >
                            <div className="flex justify-between items-start gap-4 flex-wrap">
                                <div>
                                    <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-1 uppercase tracking-widest">
                                        <Users size={14} />
                                        {activeProject.team_name || 'Team'}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {activeProject.project_title || 'Project'}
                                    </h1>
                                    {activeProject.submission_url && (
                                        <a
                                            href={activeProject.submission_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-purple-600 font-bold mt-2 inline-block"
                                        >
                                            Open submission →
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-lg">
                                    <Star size={24} className="fill-purple-600" />
                                    {Object.values(scores).reduce((a, b) => a + b, 0) / 4 || 0}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {(
                                        [
                                            ['innovation', 'Innovation & originality'],
                                            ['technicality', 'Technical execution'],
                                            ['impact', 'Real-world impact'],
                                            ['presentation', 'Presentation & UI/UX'],
                                        ] as const
                                    ).map(([key, label]) => (
                                        <div key={key} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700">{label}</label>
                                                <span className="text-sm font-black text-purple-600">
                                                    {scores[key]}/10
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={0}
                                                max={10}
                                                value={scores[key]}
                                                onChange={(e) =>
                                                    handleScoreChange(key, parseInt(e.target.value, 10))
                                                }
                                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <MessageSquare size={16} className="text-purple-500" />
                                        Evaluation comments
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Provide constructive feedback for the team..."
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end gap-4">
                                <button
                                    onClick={() => setActiveProject(null)}
                                    className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveScore}
                                    disabled={saving || activeProject.status === 'Scored'}
                                    className="px-8 py-3 bg-[#0f172a] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {activeProject.status === 'Scored' ? 'Already scored' : saving ? 'Saving…' : 'Submit evaluation'}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-12 text-center min-h-[400px]">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Gavel size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Select a project to evaluate
                            </h3>
                            <p className="max-w-xs text-sm">
                                Choose one of your assigned submissions from the left panel. Only submissions where your
                                email is in the assignment list appear here.
                            </p>
                            <ChevronRight className="mt-6 animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JudgeDashboard;
