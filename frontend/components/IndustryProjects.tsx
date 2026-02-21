import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Rocket,
    Cpu,
    Globe,
    ArrowRight,
    Zap,
    Users,
    Layers,
    Code
} from 'lucide-react';

interface Project {
    id: number;
    title: string;
    shortDesc: string;
    longDesc: string;
    tag: string;
    skills: string[];
    techStack: string[];
    image: string;
    icon: React.ReactNode;
}

const projects: Project[] = [
    {
        id: 1,
        title: "AI-Powered Medical Diagnosis System",
        shortDesc: "Building a neural network to detect diseases from medical imaging with 98% accuracy.",
        longDesc: "This project involves developing a sophisticated deep learning model using Convolutional Neural Networks (CNNs) to analyze medical imagery. You will work with large-scale datasets, implement data augmentation techniques, and deploy the model using AWS SageMaker.",
        tag: "Artificial Intelligence",
        skills: ["Computer Vision", "Deep Learning", "Cloud Deployment"],
        techStack: ["Python", "PyTorch", "AWS", "Docker"],
        image: "https://images.unsplash.com/photo-1576091160550-2173599211d0?auto=format&fit=crop&q=80&w=800",
        icon: <Cpu className="w-5 h-5" />
    },
    {
        id: 2,
        title: "Next-Gen Fintech Trading Engine",
        shortDesc: "High-performance microservices architecture for real-time stock market data processing.",
        longDesc: "Build a low-latency trading engine capable of processing millions of transactions per second. Focus on event-driven architecture, distributed systems, and real-time data streaming using Kafka and Go.",
        tag: "Backend Engineering",
        skills: ["System Design", "Concurrency", "Message Queues"],
        techStack: ["Go", "Kafka", "Redis", "Kubernetes"],
        image: "https://images.unsplash.com/photo-1611974717482-aa8a2993880c?auto=format&fit=crop&q=80&w=800",
        icon: <Zap className="w-5 h-5" />
    },
    {
        id: 3,
        title: "Web3 Decentralized Identity Protocol",
        shortDesc: "Designing a privacy-first identity solution on the Ethereum blockchain.",
        longDesc: "Implement a decentralized identity system using Zero-Knowledge Proofs. Explore blockchain security, smart contract audit processes, and cross-chain interoperability.",
        tag: "Blockchain",
        skills: ["Smart Contracts", "Cryptography", "Soliditry"],
        techStack: ["Solidity", "Hardhat", "Ethers.js", "IPFS"],
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
        icon: <Globe className="w-5 h-5" />
    },
    {
        id: 4,
        title: "Real-time Collaborative IDE",
        shortDesc: "Building a browser-based code editor with live collaboration features.",
        longDesc: "Create a rich-text editing experience with operational transforms or CRDTs for seamless multi-user collaboration. Implement terminal integration and file system virtualization.",
        tag: "Fullstack",
        skills: ["WebSockets", "Conflict Resolution", "WASM"],
        techStack: ["Next.js", "Node.js", "Socket.io", "Monaco Editor"],
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
        icon: <Rocket className="w-5 h-5" />
    }
];

const IndustryProjects: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const detailRef = useRef<HTMLDivElement>(null);

    const nextProject = () => {
        setCurrentIndex((prev) => (prev + 1) % (projects.length - 1));
    };

    const prevProject = () => {
        setCurrentIndex((prev) => (prev === 0 ? projects.length - 2 : prev - 1));
    };

    const handleViewProject = (project: Project) => {
        if (selectedProject?.id === project.id) {
            setSelectedProject(null);
        } else {
            setSelectedProject(project);
            setTimeout(() => {
                detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return (
        <section className="py-24 bg-[#0B0B0F] overflow-hidden relative font-poppins text-white">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C3BFF]/10 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#6C3BFF]/5 blur-[120px] rounded-full translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-none uppercase">
                            Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D7CFF] to-[#C5B6FF]">Projects</span> Industry People <br />
                            Are Working On
                        </h2>
                        <p className="text-[#CFCFEA]/60 text-lg font-medium max-w-2xl mx-auto">
                            Hands-on real-world projects designed with industry experts.
                        </p>
                    </motion.div>
                </div>

                {/* Main Component Grid */}
                <div className="grid lg:grid-cols-12 gap-6 mb-12">
                    {/* Left: Featured Card (Matches wireframe: Title -> Text -> Button) */}
                    <div className="lg:col-span-4">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="h-full bg-[#15151F] rounded-[3rem] border border-white/5 p-10 flex flex-col shadow-2xl relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-6 group-hover:text-[#9D7CFF] transition-colors leading-tight uppercase tracking-tighter">
                                    {projects[0].title}
                                </h3>
                                <p className="text-[#CFCFEA]/70 text-base mb-10 leading-relaxed">
                                    {projects[0].shortDesc}
                                </p>
                            </div>

                            <div className="mt-auto relative z-10">
                                <button
                                    onClick={() => handleViewProject(projects[0])}
                                    className="px-8 py-4 bg-[#6C3BFF] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#9D7CFF] transition-all shadow-xl shadow-[#6C3BFF]/20"
                                >
                                    View
                                </button>
                            </div>

                            {/* Background image fade */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-20 group-hover:opacity-30 transition-opacity">
                                <img src={projects[0].image} alt="" className="w-full h-full object-cover" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Two smaller cards side-by-side (As per wireframe) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="wait">
                            {projects.slice(currentIndex + 1, currentIndex + 3).map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="flex flex-col bg-[#15151F] rounded-[3.5rem] border border-white/5 overflow-hidden group hover:border-[#6C3BFF]/30 transition-all cursor-pointer shadow-xl h-full min-h-[400px]"
                                    onClick={() => handleViewProject(project)}
                                >
                                    <div className="h-56 relative overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#15151F] to-transparent opacity-60" />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h4 className="text-xl font-bold mb-3 group-hover:text-[#9D7CFF] transition-colors uppercase tracking-tight">
                                            {project.title}
                                        </h4>
                                        <p className="text-sm text-[#CFCFEA]/50 line-clamp-2 leading-relaxed">
                                            {project.shortDesc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Controls - Moved below cards as per wireframe */}
                <div className="flex flex-col items-center gap-6 mt-16">
                    <div className="flex gap-2">
                        {Array.from({ length: projects.length - 1 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-12 bg-[#6C3BFF]' : 'w-2 bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={prevProject}
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#6C3BFF] hover:border-[#6C3BFF] transition-all group shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={nextProject}
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#6C3BFF] hover:border-[#6C3BFF] transition-all group shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Detail Panel Reveal (Matches wireframe bottom box) */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            ref={detailRef}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="mt-20 pt-10 border-t border-white/5"
                        >
                            <div className="bg-gradient-to-br from-[#15151F] to-[#0B0B0F] border border-[#6C3BFF]/20 rounded-[4rem] p-12 md:p-16 shadow-[0_0_100px_-20px_rgba(108,59,255,0.2)] relative overflow-hidden">
                                <div className="grid lg:grid-cols-2 gap-16 relative z-10">
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-4xl font-black mb-8 uppercase tracking-tighter">
                                            {selectedProject.title}
                                        </h3>
                                        <div className="space-y-6 mb-12">
                                            <p className="text-[#CFCFEA] text-lg leading-relaxed opacity-80">
                                                {selectedProject.longDesc}
                                            </p>
                                            <p className="text-[#CFCFEA]/60 text-base leading-relaxed">
                                                Gain hands-on experience through clinical evidence deconstructed from real-world systems.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 mb-12">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <img src="https://cdn.simpleicons.org/google/FFFFFF" className="w-8 h-8 opacity-50" alt="Partner" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6C3BFF]">Working for Logo</span>
                                        </div>

                                        <button className="w-fit px-12 py-5 bg-[#6C3BFF] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-2xl shadow-[#6C3BFF]/30">
                                            Collab
                                        </button>
                                    </div>

                                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                                        <img src={selectedProject.image} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#6C3BFF]/20 to-transparent" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default IndustryProjects;
