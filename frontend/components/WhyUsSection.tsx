import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Server, Users, GraduationCap, Building2,
    Pause, Play, Sun, Moon, Cloud,
    Sunrise as SunriseIcon, Sunset as SunsetIcon
} from 'lucide-react';

const stats = [
    { value: "20+", label: "Sessions", icon: <Server className="w-5 h-5 text-[#7C3AED]" /> },
    { value: "15+", label: "Colleges", icon: <GraduationCap className="w-5 h-5 text-[#7C3AED]" /> },
    { value: "10+", label: "Partnerships", icon: <Building2 className="w-5 h-5 text-[#7C3AED]" /> },
    { value: "3+", label: "Startups", icon: <Users className="w-5 h-5 text-[#7C3AED]" /> },
];

const features = [
    "Industry Expert Mentors",
    "Direct Hiring Pipeline",
    "Verified Proficiency Score",
    "Hands-on Project Portfolio"
];

interface StripeBurstProps {
    isPaused: boolean;
    theme: string;
}

const themes: Record<string, string[]> = {
    'Pre-dawn': ['#1E1B4B', '#312E81', '#4338CA', '#5850EC'],
    'Sunrise': ['#F59E0B', '#EF4444', '#7C3AED', '#A78BFA'],
    'Daytime': ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
    'Dusk': ['#7C3AED', '#A78BFA', '#DDD6FE', '#C4B5FD'],
    'Sunset': ['#F87171', '#F472B6', '#818CF8', '#6366F1'],
    'Night': ['#0F172A', '#1E293B', '#334155', '#475569']
};

const StripeBurst: React.FC<StripeBurstProps> = ({ isPaused, theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        let height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;

        const particles: any[] = [];
        const particleCount = 200;

        class Particle {
            x: number;
            y: number;
            angle: number;
            length: number;
            speed: number;
            opacity: number;
            color: string;
            lineWidth: number;

            constructor() {
                this.x = width / 2;
                this.y = height;
                this.angle = (Math.random() * Math.PI) - Math.PI;
                this.length = Math.random() * 200 + 100;
                this.speed = Math.random() * 3 + 1.5;
                this.opacity = Math.random() * 0.8 + 0.3;
                this.lineWidth = Math.random() * 2 + 0.5;
                const colors = themes[theme] || themes['Dusk'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.lineWidth = this.lineWidth;
                const endX = this.x + Math.cos(this.angle) * this.length;
                const endY = this.y + Math.sin(this.angle) * this.length;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(endX, endY, this.lineWidth * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                if (isPaused) return;
                this.length += this.speed;
                this.opacity -= 0.003;
                if (this.opacity <= 0) {
                    this.reset();
                }
            }

            reset() {
                this.x = width / 2;
                this.y = height;
                this.angle = (Math.random() * Math.PI) - Math.PI;
                this.length = Math.random() * 100 + 50;
                this.opacity = Math.random() * 0.7 + 0.4;
                const colors = themes[theme] || themes['Dusk'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPaused, theme]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

const Counter: React.FC<{ value: string; delay: number }> = ({ value, delay }) => {
    const [count, setCount] = useState(0);
    const target = parseInt(value.match(/\d+/)?.[0] || '0');
    const suffix = value.replace(/[0-9]/g, '');
    const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

    useEffect(() => {
        if (isNaN(target)) return;

        let startTime: number | null = null;
        const duration = 2000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(easeProgress * target));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        const timeoutId = setTimeout(() => {
            rafRef.current = requestAnimationFrame(animate);
        }, delay * 1000);

        return () => {
            clearTimeout(timeoutId);
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [target, delay]);

    return (
        <span>
            {count}{suffix}
        </span>
    );
};

const WhyUsSection: React.FC = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('Dusk');
    const [showThemePanel, setShowThemePanel] = useState(false);

    const themeIcons: Record<string, React.ReactNode> = {
        'Pre-dawn': <Moon className="w-3 h-3" />,
        'Sunrise': <SunriseIcon className="w-3 h-3" />,
        'Daytime': <Sun className="w-3 h-3" />,
        'Dusk': <Cloud className="w-3 h-3" />,
        'Sunset': <SunsetIcon className="w-3 h-3" />,
        'Night': <Moon className="w-3 h-3 text-indigo-400" />
    };

    return (
        <section className="py-24 bg-white overflow-hidden relative font-poppins">
            <div className="max-w-7xl mx-auto px-6">

                {/* Title */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl sm:text-7xl font-black text-[#111827] uppercase tracking-tighter"
                    >
                        Why <span className="text-[#7C3AED]">Us?</span>
                    </motion.h2>
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2.5rem] p-8 mb-16 flex flex-wrap justify-around items-center border border-gray-100 shadow-[0_32px_64px_-16px_rgba(124,58,237,0.1)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7C3AED]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="flex flex-col items-center px-10 py-4 border-r border-gray-100 last:border-none relative z-10"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: i * 0.1 + 0.5, type: 'spring' }}
                                className="w-12 h-12 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-4 text-[#7C3AED]"
                            >
                                {stat.icon}
                            </motion.div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-5xl sm:text-6xl font-black text-[#111827] tracking-tighter">
                                    <Counter value={stat.value} delay={i * 0.2 + 0.3} />
                                </span>
                            </div>
                            <span className="text-xs font-black text-[#7C3AED] uppercase tracking-[0.3em] opacity-80">{stat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Content & Animation */}
                <div className="grid lg:grid-cols-2 gap-12 items-stretch">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col h-full"
                    >
                        {/* Image Container */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#7C3AED]/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                            <div className="relative bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                    alt="Why Us Illustration"
                                    className="w-full h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Text Content - Pushed to Bottom */}
                        <div className="mt-auto pt-12 space-y-6">
                            <h3 className="text-3xl font-bold text-[#111827] uppercase tracking-tight">The Growth Engine for Engineers.</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-[#F5F3FF] transition-colors group"
                                    >
                                        <div className="w-2 h-2 bg-[#7C3AED] rounded-full group-hover:scale-150 transition-transform" />
                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right: Stripe Animation */}
                    <div className="relative h-[600px] flex items-end justify-center bg-gradient-to-b from-transparent to-[#F5F3FF]/30 rounded-[3rem]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="absolute inset-0 z-0 bg-white shadow-inner rounded-[3rem] border border-[#7C3AED]/10 overflow-hidden"
                        >
                            <StripeBurst isPaused={isPaused} theme={currentTheme} />
                        </motion.div>

                        {/* Controls Overlay */}
                        <div className="absolute top-8 right-8 z-20 flex flex-col gap-2 items-end">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 text-gray-600 hover:text-[#7C3AED] hover:shadow-lg transition-all shadow-sm"
                                >
                                    {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                                </button>
                                <button
                                    onClick={() => setShowThemePanel(!showThemePanel)}
                                    className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 text-gray-600 hover:text-[#7C3AED] hover:shadow-lg transition-all shadow-sm"
                                >
                                    <Sun className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Theme Selector Panel */}
                            {showThemePanel && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-gray-100 shadow-2xl flex flex-col gap-1 w-40"
                                >
                                    {Object.keys(themes).map(theme => (
                                        <button
                                            key={theme}
                                            onClick={() => {
                                                setCurrentTheme(theme);
                                                setShowThemePanel(false);
                                            }}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme === theme
                                                ? 'bg-[#7C3AED] text-white shadow-lg'
                                                : 'text-gray-500 hover:bg-[#F5F3FF] hover:text-[#7C3AED]'
                                                }`}
                                        >
                                            {themeIcons[theme]}
                                            {theme}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#7C3AED]/5 blur-[120px] rounded-full -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7C3AED]/5 blur-[150px] rounded-full translate-x-1/4 translate-y-1/4" />
        </section>
    );
};

export default WhyUsSection;
