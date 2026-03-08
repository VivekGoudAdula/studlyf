import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Tool {
    name: string;
    description: string;
    logo: string;
    category: string;
    url: string;
}

const AIToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="group bg-white border border-gray-100 rounded-[1.5rem] p-6 flex flex-col h-full relative overflow-hidden hover:border-[#7C3AED]/20 hover:shadow-[0_20px_40px_rgba(124,58,237,0.08)] transition-all"
        >
            {/* Category Badge */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-gray-100 p-2 flex items-center justify-center overflow-hidden group-hover:border-[#7C3AED]/20 transition-colors">
                    <img
                        src={tool.logo}
                        alt={tool.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=AI'; }}
                    />
                </div>
                <span className="px-3 py-1 bg-[#F5F3FF] text-[#7C3AED] text-[10px] uppercase font-black tracking-widest rounded-full border border-[#7C3AED]/10">
                    {tool.category}
                </span>
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#7C3AED] transition-colors tracking-tight">
                    {tool.name}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3 mb-6 font-medium">
                    {tool.description}
                </p>
            </div>

            <motion.a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C3AED]/20"
            >
                Visit Tool
                <ExternalLink className="w-4 h-4" />
            </motion.a>
        </motion.div>
    );
};

export default AIToolCard;
