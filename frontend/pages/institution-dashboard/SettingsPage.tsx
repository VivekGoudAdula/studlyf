
import React, { useState, useEffect, useRef } from 'react';
import { 
    User, 
    Bell, 
    Shield, 
    Globe, 
    Mail, 
    Phone,
    Building2,
    Save,
    Upload,
    ChevronRight,
    CheckCircle2,
    Loader2,
    CreditCard,
    Zap,
    Star,
    Crown,
    ArrowRight,
    Users,
    MessageSquare,
    Plus,
    Trash2,
    ShieldCheck,
    Gavel
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../apiConfig';

interface SettingsPageProps {
    institutionId: string;
    onProfileUpdate?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ institutionId, onProfileUpdate }) => {
    const [activeSection, setActiveSection] = useState('profile');
    const sections = [
        { id: 'profile', label: 'Institutional Profile', icon: Building2 },
        { id: 'team', label: 'Team & Admins', icon: Users },
        { id: 'notifications', label: 'Email Notifications', icon: Mail },
        { id: 'communications', label: 'Custom Communications', icon: MessageSquare },
        { id: 'onboarding', label: 'Member Onboarding', icon: Plus },
        { id: 'plan', label: 'Plan & Billing', icon: CreditCard },
    ];

    const [profile, setProfile] = useState<any>({
        name: '',
        website: '',
        email: '',
        phone: '',
        bio: '',
        logo_url: '',
        banner_url: '',
        email_custom_message: '',
        team: [],
        social: {
            linkedin: '',
            twitter: '',
            instagram: ''
        },
        notifications: {
            registrations: false,
            submissions: true,
            evaluations: true,
            updates: false
        }
    });

    const [bulkList, setBulkList] = useState<{name: string, email: string, phone: string}[]>([]);
    const [onboardingRole, setOnboardingRole] = useState('student');
    const [isOnboarding, setIsOnboarding] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/v1/institution/profile/${institutionId}`); 
                const data = await res.json();
                setProfile(prev => ({
                    ...prev,
                    ...data,
                    notifications: data.notifications || prev.notifications
                }));
            } catch (err) {
                console.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [institutionId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({
            ...prev,
            social: {
                ...prev.social,
                [id]: value
            }
        }));
    };

    const handleBannerClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfile(prev => ({ ...prev, banner_url: reader.result as string }));
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleToggle = (category: string, key: string) => {
        setProfile(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [category]: {
                    ...prev.notifications?.[category],
                    [key]: !prev.notifications?.[category]?.[key]
                }
            }
        }));
    };

    const addTeamMember = () => {
        setProfile(prev => ({
            ...prev,
            team: [...(prev.team || []), { name: '', email: '', role: 'Coordinator' }]
        }));
    };

    const updateMember = (index: number, field: string, value: string) => {
        const newTeam = [...profile.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setProfile(prev => ({ ...prev, team: newTeam }));
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const lines = content.split('\n');
            const newMembers: any[] = [];
            
            const startIdx = (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('email')) ? 1 : 0;

            for (let i = startIdx; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const parts = line.split(',').map(p => p.trim());
                if (parts.length >= 2) {
                    newMembers.push({
                        name: parts[0],
                        email: parts[1],
                        role: parts[2] || 'Coordinator'
                    });
                }
            }
            
            if (newMembers.length > 0) {
                setProfile(prev => ({
                    ...prev,
                    team: [...(prev.team || []), ...newMembers]
                }));
            }
        };
        reader.readAsText(file);
    };


    const removeTeamMember = (index: number) => {
        const newTeam = [...profile.team];
        newTeam.splice(index, 1);
        setProfile(prev => ({ ...prev, team: newTeam }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { _id, ...cleanProfile } = profile;
            const payload = { ...cleanProfile, institution_id: institutionId };
            
            const res = await fetch(`${API_BASE_URL}/api/v1/institution/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => {
                    if (onProfileUpdate) onProfileUpdate();
                }, 500);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                const errorData = await res.json().catch(() => ({}));
                alert(`Sync Failed: ${res.status}.`);
            }
        } catch (err) {
            alert("Network error. Is the backend running?");
        } finally {
            setSaving(false);
        }
    };

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, logo_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#6C3BFF]" size={40} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Settings...</p>
        </div>
    );

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="relative mb-20">
                            <div 
                                onClick={handleBannerClick}
                                className="w-full h-48 rounded-[3rem] bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden group relative"
                            >
                                {profile.banner_url ? (
                                    <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <Plus className="mx-auto text-slate-300" size={32} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Upload Institutional Banner</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/40">
                                        <Upload className="text-white" size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-12 left-10 group" onClick={handleLogoClick}>
                                <div className="w-32 h-32 rounded-[2rem] bg-white border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden relative cursor-pointer group-hover:scale-105 transition-transform">
                                    {profile.logo_url ? (
                                        <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={32} className="text-slate-200" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="text-white" size={20} />
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            {[
                                { id: 'name', label: 'Institution Name', icon: Building2, placeholder: 'e.g., Stanford University' },
                                { id: 'website', label: 'Official Website', icon: Globe, placeholder: 'https://www.university.edu' },
                                { id: 'email', label: 'Administrative Email', icon: Mail, placeholder: 'admin@university.edu' },
                                { id: 'phone', label: 'Contact Number', icon: Phone, placeholder: '+1 (555) 000-0000' },
                            ].map((field) => (
                                <div key={field.id} className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <field.icon size={14} className="text-[#6C3BFF]" /> {field.label}
                                    </label>
                                    <input 
                                        id={field.id}
                                        type="text" 
                                        placeholder={field.placeholder}
                                        value={profile[field.id]} 
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300" 
                                    />
                                </div>
                            ))}

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 mt-4">
                                {[
                                    { id: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/school/...' },
                                    { id: 'twitter', label: 'Twitter / X', placeholder: 'twitter.com/...' },
                                    { id: 'instagram', label: 'Instagram', placeholder: 'instagram.com/...' },
                                ].map((s) => (
                                    <div key={s.id} className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</label>
                                        <input 
                                            id={s.id}
                                            type="text" 
                                            placeholder={s.placeholder}
                                            value={profile.social?.[s.id] || ''} 
                                            onChange={handleSocialChange}
                                            className="w-full px-5 py-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all text-xs font-bold"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Bio</label>
                                <textarea 
                                    id="bio"
                                    rows={5} 
                                    placeholder="Write a brief description of your institution..."
                                    value={profile.bio}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-[#6C3BFF] outline-none transition-all resize-none font-bold text-slate-800 placeholder:text-slate-300" 
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-md">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Internal Operational Alerts</h3>
                                        <p className="text-sm text-slate-400 mt-0.5">Control which notifications are sent to the institution staff.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {[
                                { cat: 'admin_alerts', id: 'new_submissions', title: 'New Submission Alerts', desc: 'Notify admins when a team finalizes their project' },
                                { cat: 'admin_alerts', id: 'judge_acceptances', title: 'Judge Activity', desc: 'Alert when a judge accepts an invite' },
                                { cat: 'admin_alerts', id: 'judge_evaluations', title: 'Judge Evaluations', desc: 'Notify admins when a judge finishes scoring a project' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-6 border-b border-slate-200/50 last:border-0">
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">{item.title}</p>
                                        <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(item.cat, item.id)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all cursor-pointer ${profile.notifications?.[item.cat]?.[item.id] ? 'bg-[#6C3BFF] shadow-lg shadow-purple-200' : 'bg-slate-200'}`}
                                    >
                                        <div className={`h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${profile.notifications?.[item.cat]?.[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl text-emerald-500 shadow-md">
                                        <Gavel size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Judging Panel Logic</h3>
                                        <p className="text-sm text-slate-400 mt-0.5">Control correspondence for your evaluators.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {[
                                { cat: 'judge_comms', id: 'invitations', title: 'Judge Invitations', desc: 'Sent when you add a judge to an event' },
                                { cat: 'judge_comms', id: 'evaluation_reminders', title: 'Evaluation Reminders', desc: 'Automatic pings to finish scoring before the deadline' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-6 border-b border-slate-200/50 last:border-0">
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">{item.title}</p>
                                        <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(item.cat, item.id)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all cursor-pointer ${profile.notifications?.[item.cat]?.[item.id] ? 'bg-[#6C3BFF] shadow-lg shadow-purple-200' : 'bg-slate-200'}`}
                                    >
                                        <div className={`h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${profile.notifications?.[item.cat]?.[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'team':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Institutional Team</h3>
                                <p className="text-sm text-slate-500 mt-1">Manage staff members and their administrative roles.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => document.getElementById('bulk-member-upload')?.click()}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    <Upload size={16} /> Bulk Upload
                                </button>
                                <input 
                                    id="bulk-member-upload"
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    className="hidden"
                                    onChange={handleBulkUpload}
                                />
                                <button 
                                    onClick={addTeamMember}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#6C3BFF] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#5A2EE5] transition-all shadow-lg shadow-purple-100"
                                >
                                    <Plus size={16} /> Add Member
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {profile.team && profile.team.length > 0 ? profile.team.map((member, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx} 
                                    className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center gap-6"
                                >
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                            <input 
                                                value={member.name}
                                                onChange={(e) => updateMember(idx, 'name', e.target.value)}
                                                placeholder="e.g. Dr. Jane Smith"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                            <input 
                                                value={member.email}
                                                onChange={(e) => updateMember(idx, 'email', e.target.value)}
                                                placeholder="jane.smith@univ.edu"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                                            <select 
                                                value={member.role}
                                                onChange={(e) => updateMember(idx, 'role', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-bold appearance-none"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Coordinator">Coordinator</option>
                                                <option value="Evaluator">Evaluator</option>
                                                <option value="Editor">Editor</option>
                                                <option value="Viewer">Viewer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeTeamMember(idx)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            )) : (
                                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                                    <Users className="mx-auto text-slate-200 mb-4" size={48} />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No team members added yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'communications':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Custom Communications</h2>
                        </div>
                        <div className="p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                            <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Premium Feature</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm">
                                Custom email templates and SMS notifications are available for Premium institutions.
                            </p>
                        </div>
                    </div>
                );
            case 'onboarding':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Member Onboarding</h2>
                                <p className="text-slate-500 text-sm mt-1">Bulk invite judges or students via CSV upload</p>
                            </div>
                            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                                {['student', 'judge'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setOnboardingRole(r)}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black capitalize tracking-widest transition-all ${onboardingRole === r ? 'bg-white text-[#6C3BFF] shadow-sm' : 'text-slate-400'}`}
                                    >
                                        {r}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div className="p-12 bg-purple-50/50 rounded-[3rem] border-2 border-dashed border-purple-200 text-center relative group transition-all hover:bg-purple-50">
                            <input 
                                type="file" 
                                accept=".csv" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const text = event.target?.result as string;
                                            const rows = text.split('\n').slice(1);
                                            const parsed = rows.map(row => {
                                                const parts = row.split(',');
                                                return { name: parts[0]?.trim(), email: parts[1]?.trim(), phone: parts[2]?.trim() };
                                            }).filter(p => p.email && p.email.includes('@'));
                                            setBulkList(prev => [...prev, ...parsed]);
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                            />
                            <div className="space-y-4 relative z-10">
                                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl shadow-purple-200 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                                    <Upload className="text-[#6C3BFF]" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Drop CSV File Here</h3>
                                    <p className="text-slate-400 text-xs mt-2 font-medium">
                                        Columns required: <span className="text-[#6C3BFF] font-bold">Name, Email, Phone</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* List Preview */}
                        {bulkList.length > 0 && (
                            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/20 animate-in zoom-in-95 duration-500">
                                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#6C3BFF] rounded-full flex items-center justify-center text-white text-xs font-black">
                                            {bulkList.length}
                                        </div>
                                        <h3 className="font-bold text-slate-900 font-['Outfit']">Detected Members</h3>
                                    </div>
                                    <button 
                                        onClick={() => setBulkList([])}
                                        className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest px-4 py-2 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        Clear List
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                                                <th className="px-8 py-4">Full Name</th>
                                                <th className="px-8 py-4">Email Address</th>
                                                <th className="px-8 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {bulkList.map((m, i) => (
                                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{m.name || 'N/A'}</td>
                                                    <td className="px-8 py-5 text-sm font-medium text-slate-500">{m.email}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button 
                                                            onClick={() => setBulkList(prev => prev.filter((_, idx) => idx !== i))}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-8 bg-slate-50/50 border-t border-slate-50">
                                    <button 
                                        disabled={isOnboarding}
                                        onClick={async () => {
                                            try {
                                                setIsOnboarding(true);
                                                const res = await fetch(`${API_BASE_URL}/api/v1/institution/members/bulk`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        institution_id: institutionId,
                                                        role: onboardingRole,
                                                        members: bulkList
                                                    })
                                                });
                                                if (res.ok) {
                                                    const result = await res.json();
                                                    alert(`Successfully onboarded ${result.added} ${onboardingRole}s!`);
                                                    setBulkList([]);
                                                }
                                            } catch (err) {
                                                alert("Bulk onboarding failed");
                                            } finally {
                                                setIsOnboarding(false);
                                            }
                                        }}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#6C3BFF] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-purple-100"
                                    >
                                        {isOnboarding ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-white" />}
                                        {isOnboarding ? 'Processing...' : `Onboard All ${onboardingRole}s Now`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'plan':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 bg-gradient-to-br from-[#6C3BFF] to-[#9F6BFF] rounded-[3rem] text-white shadow-2xl shadow-purple-200 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Crown size={28} className="text-amber-300" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Current Plan</span>
                                    </div>
                                    <h3 className="text-4xl font-black mb-2 tracking-tight">Institutional Pro</h3>
                                    <p className="text-purple-100 font-medium opacity-70">Billed Annually • Expires in 245 Days</p>
                                    
                                    <div className="mt-10 space-y-4">
                                        {['Unlimited Opportunities', 'Advanced Analytics', 'White-labeled Certificates', 'Priority Support'].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm font-bold">
                                                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 size={12} className="text-white" />
                                                </div>
                                                {feat}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Abstract background elements */}
                                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            </div>

                            <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Upgrade</h4>
                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">Need custom domain integration, bulk data export, or multiple sub-admin accounts?</p>
                                </div>
                                <div className="mt-8">
                                    <button className="w-full py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-[#6C3BFF] hover:text-[#6C3BFF] transition-all flex items-center justify-center gap-3">
                                        Contact Sales <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20 font-['Outfit']">
            <div className="flex items-end justify-between px-2">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Institutional Settings</h1>
                    <p className="text-slate-500 mt-3 text-xl font-medium">Control your digital presence and operational preferences.</p>
                </div>
                <AnimatePresence>
                    {saveSuccess && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-50"
                        >
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-black uppercase tracking-[0.1em]">Identity Synchronized</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 space-y-3">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center justify-between group px-8 py-5 rounded-[2rem] transition-all ${
                                activeSection === section.id 
                                    ? 'bg-white text-[#6C3BFF] shadow-2xl shadow-purple-100/50 border-r-4 border-[#6C3BFF]' 
                                    : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-2xl transition-all ${
                                    activeSection === section.id ? 'bg-purple-50 scale-110 shadow-lg shadow-purple-50' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-sm'
                                }`}>
                                    <section.icon size={22} />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest">{section.label}</span>
                            </div>
                            <ChevronRight size={18} className={`transition-transform duration-500 ${activeSection === section.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white/40 backdrop-blur-3xl p-3 rounded-[4rem] border border-white/40 shadow-2xl shadow-slate-200/20">
                        <div className="bg-white p-12 lg:p-16 rounded-[3.5rem] shadow-sm relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-[120px] -z-10" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50/30 rounded-full blur-[100px] -z-10" />
                            
                            {renderSectionContent()}

                            <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {saving && (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                                Transmitting Data...
                                            </p>
                                        </>
                                    )}
                                </div>
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-3 px-12 py-5 bg-[#6C3BFF] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#5A2EE5] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-purple-200 disabled:opacity-50 disabled:scale-100"
                                >
                                    {saving ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Save size={20} />
                                    )}
                                    {saving ? 'Saving...' : 'Confirm Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
