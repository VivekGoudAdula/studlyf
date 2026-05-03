import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, authHeaders } from '../../apiConfig';

type QuizQuestion = {
    type?: string;
    text?: string;
    options?: string[];
    language?: string;
};

const EventQuizPage: React.FC = () => {
    const { eventId, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState<any[]>([]);

    useEffect(() => {
        if (!eventId || !quizId) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_BASE_URL}/api/opportunities/events/${eventId}/quizzes/${quizId}`, {
                    headers: { ...authHeaders() },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.detail || 'Unable to open this quiz');
                if (!cancelled) {
                    setQuiz(data);
                    setAnswers((data.questions || []).map(() => ({})));
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Unable to load quiz');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [eventId, quizId]);

    const canSubmit = useMemo(() => Array.isArray(quiz?.questions) && quiz.questions.length > 0, [quiz?.questions]);

    const submit = async () => {
        if (!eventId || !quizId) return;
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/opportunities/events/${eventId}/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({ answers }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.detail || 'Failed to submit quiz');
            if (data.coding_pending_review) {
                alert('Submitted. Coding answers are pending manual evaluation by the institution.');
            } else {
                alert(`Submitted. Score: ${data.score}% | ${data.passed ? 'Qualified' : 'Not qualified'}`);
            }
            navigate(`/events/${eventId}`);
        } catch (e: any) {
            setError(e?.message || 'Submit failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading quiz...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">{error}</div>;
    if (!quiz) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h1 className="text-2xl font-black text-slate-900">{quiz.title || 'Assessment'}</h1>
                    <p className="text-xs mt-2 text-slate-500 uppercase tracking-wider font-bold">
                        Duration: {quiz.duration || 0} min
                    </p>
                    <div className="mt-6 space-y-6">
                        {(quiz.questions || []).map((q: QuizQuestion, i: number) => (
                            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                                <p className="font-bold text-slate-900 mb-3">{i + 1}. {q.text || 'Question'}</p>
                                {String(q.type || '').toUpperCase() === 'SINGLE_CHOICE' ? (
                                    <div className="space-y-2">
                                        {(q.options || []).map((op, oi) => (
                                            <label key={oi} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                <input
                                                    type="radio"
                                                    name={`q-${i}`}
                                                    checked={answers[i]?.selectedIndex === oi}
                                                    onChange={() => setAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, selectedIndex: oi } : a))}
                                                />
                                                {op}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-500 font-semibold">Coding ({q.language || 'any'})</p>
                                        <textarea
                                            value={answers[i]?.code || ''}
                                            onChange={(e) => setAnswers((prev) => prev.map((a, idx) => idx === i ? { ...a, code: e.target.value, language: q.language || 'text' } : a))}
                                            className="w-full min-h-[180px] rounded-xl border border-slate-200 bg-white p-3 text-sm font-mono"
                                            placeholder="Write your solution here..."
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm">Back</button>
                        <button disabled={!canSubmit || saving} onClick={submit} className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm disabled:opacity-60">
                            {saving ? 'Submitting...' : 'Submit quiz'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventQuizPage;
