
import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import InteractiveCreature from './InteractiveCreature';

// --- Shared Bento Components ---

interface BentoCardProps {
    title: string;
    desc: string;
    children?: React.ReactNode;
    className?: string;
    to?: string;
}

const BentoCard = ({ title, desc, children, className = "", to = "#" }: BentoCardProps) => (
    <Link to={to} className={`bg-white/80 backdrop-blur-sm rounded-[1.5rem] p-5 relative overflow-hidden group border border-transparent hover:border-[#7C3AED]/20 hover:shadow-xl transition-all block w-full text-left ${className}`}>
        <div className="relative z-10">
            <h3 className="text-base font-bold text-[#111827] mb-1.5 tracking-tight group-hover:text-[#7C3AED] transition-colors">{title}</h3>
            <p className="text-[11px] text-[#6B7280] leading-relaxed max-w-[180px] mb-3">{desc}</p>
        </div>
        {children}
    </Link>
);

const LearnDropdown = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 min-w-[300px] md:min-w-[600px]">
        <BentoCard to="/feature-preview/learn-courses" title="Courses" desc="Role-focused tracks for elite engineering readiness." className="md:col-span-2 md:row-span-2 min-h-[160px] md:min-h-[180px]">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" className="absolute bottom-0 right-0 w-1/2 h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Courses" />
        </BentoCard>
        <BentoCard to="/feature-preview/learn-modules" title="Company Learning Modules" desc="Institutional training for corporate internal teams." className="md:col-span-2 h-[88px]">
            <img src="https://images.unsplash.com/photo-1454165833762-02193567a5d7?auto=format&fit=crop&q=80&w=400" className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full object-cover opacity-20 group-hover:opacity-100 transition-all" alt="Corporate" />
        </BentoCard>
        <BentoCard to="/feature-preview/learn-blog" title="Blog" desc="Technical insights on system ownership." className="md:col-span-2 h-[88px]">
            <div className="absolute bottom-3 right-4 flex gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-[1px] bg-[#7C3AED]"></div>
                <div className="w-5 h-[1px] bg-[#7C3AED]"></div>
            </div>
        </BentoCard>
    </div>
);

const JobPrepDropdown = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 min-w-[300px] md:min-w-[600px]">
        <BentoCard to="/feature-preview/prep-portfolio" title="Build Portfolio" desc="Showcase evidence." className="md:col-span-1 md:row-span-2 min-h-[160px] md:min-h-[180px] bg-[#F8FAFC]">
            <div className="mt-1 bg-[#0F172A] rounded-lg p-3 shadow-xl border border-white/10 group-hover:scale-[1.02] transition-transform h-full">
                <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                    <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                    <div className="w-1 h-1 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-1.5"><div className="h-2 w-2/3 bg-white/10 rounded"></div><div className="h-8 w-full bg-gradient-to-tr from-[#7C3AED]/30 to-transparent rounded border border-white/5"></div></div>
            </div>
        </BentoCard>
        <BentoCard to="/feature-preview/prep-resume" title="Resume Builder" desc="Create instant resumes." className="md:col-span-1 md:row-span-2 min-h-[160px] md:min-h-[180px] bg-[#F8FAFC]">
            <div className="mt-2 mx-auto w-3/4 h-full bg-white border border-gray-200 rounded-t-lg shadow-sm group-hover:shadow-md transition-all group-hover:scale-[1.02] group-hover:-translate-y-1 relative overflow-hidden p-2">
                <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div className="space-y-1 w-full">
                        <div className="h-1.5 w-2/3 bg-gray-800 rounded-full"></div>
                        <div className="h-1 w-1/2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="h-0.5 w-full bg-gray-200"></div>
                    <div className="flex gap-1">
                        <div className="h-1 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-1 w-2/3 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex gap-1">
                        <div className="h-1 w-1/4 bg-gray-200 rounded"></div>
                        <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-0.5 w-full bg-gray-200 mt-1"></div>
                    <div className="space-y-1 mt-1">
                        <div className="h-1 w-full bg-gray-100 rounded"></div>
                        <div className="h-1 w-5/6 bg-gray-100 rounded"></div>
                        <div className="h-1 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500/10 rounded-tl-xl flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
            </div>
        </BentoCard>
        <BentoCard to="/feature-preview/prep-assessment" title="Skill Assessment" desc="Find your strengths with clinical scoring." className="md:col-span-2 h-[88px]">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" className="absolute bottom-0 right-0 w-1/4 h-full object-cover opacity-10 group-hover:opacity-60 transition-all" alt="Assessment" />
        </BentoCard>
        <BentoCard to="/feature-preview/prep-mock" title="Mock tests & interviews" desc="Practice clinical logic defense." className="h-[88px]">
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=200" className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover rounded-tl-xl opacity-30 group-hover:opacity-100 transition-all" alt="Mock" />
        </BentoCard>
        <BentoCard to="/feature-preview/prep-projects" title="Build projects" desc="Deconstruct tech giant systems." className="h-[88px]">
            <div className="flex gap-1.5 mt-0.5 opacity-40 group-hover:opacity-100 transition-all">
                <div className="h-6 w-6 bg-white rounded flex items-center justify-center p-0.5 border border-gray-100"><img src="https://www.vectorlogo.zone/logos/swiggy/swiggy-icon.svg" className="h-3" alt="Swiggy" /></div>
                <div className="h-6 w-6 bg-black rounded flex items-center justify-center p-0.5"><img src="https://www.vectorlogo.zone/logos/uber/uber-icon.svg" className="h-3 invert" alt="Uber" /></div>
            </div>
        </BentoCard>
    </div>
);

const JobsDropdown = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 min-w-[300px] md:min-w-[600px]">
        <BentoCard to="/feature-preview/jobs-get-hired" title="Get Hired" desc="Connect with partners looking for verified talent." className="md:col-span-2 h-[120px]">
            <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=600" className="absolute bottom-0 right-0 w-1/3 h-full object-cover grayscale opacity-20 group-hover:opacity-100 transition-all" alt="Get Hired" />
        </BentoCard>
        <BentoCard to="/feature-preview/jobs-hire" title="Hire Talent" desc="Access verified engineering professionals." className="md:col-span-2 h-[120px]">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600" className="absolute bottom-0 right-0 w-1/3 h-full object-cover grayscale opacity-20 group-hover:opacity-100 transition-all" alt="Hire" />
        </BentoCard>
    </div>
);

const PurpleNavbar: React.FC = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const navigate = useNavigate();

    const navItems = [
        {
            label: 'LEARN',
            component: <LearnDropdown />
        },
        {
            label: 'JOB PREP',
            component: <JobPrepDropdown />
        },
        {
            label: 'JOBS',
            component: <JobsDropdown />
        },
    ];

    return (
        <div className="w-full px-0 sm:px-0 absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
            {/* Using pointer-events-none on wrapper so clicks pass through empty areas */}

            <div className="relative flex justify-center w-full items-end h-6">
                {/* Interactive Creature - Z-Index 0 (Behind Navbar) */}
                <div className="absolute inset-x-0 bottom-8 z-0 flex justify-center pointer-events-none">
                    <InteractiveCreature />
                </div>

                {/* Navbar Content - Z-Index 10 (In Front) - Enable pointer events */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-4xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#7C3AED] rounded-t-[0.8rem] sm:rounded-t-[1.2rem] px-6 sm:px-10 py-0.5 sm:py-1 flex items-center justify-center shadow-[0_-10px_40px_-15px_rgba(124,58,237,0.5)] z-10 pointer-events-auto"
                >
                    {/* Navigation Items - Centered */}
                    <div className="flex items-center gap-6 sm:gap-12 relative w-full justify-center">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative py-2"
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className="flex items-center gap-2 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-white/80 transition-colors py-1">
                                    {item.label}
                                    <ChevronUp
                                        size={16}
                                        className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            </div>
                        ))}

                        {/* Centered Dropdown Menu (Upwards) - Relative to Navbar Container */}
                        <AnimatePresence>
                            {activeDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-full mb-6 left-0 right-0 bg-[#F5F3FF] border border-[#7C3AED]/10 p-6 rounded-[2.5rem] shadow-2xl z-[100] cursor-auto mx-4 sm:mx-8"
                                    onMouseEnter={() => setActiveDropdown(activeDropdown)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {navItems.find(i => i.label === activeDropdown)?.component}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PurpleNavbar;
