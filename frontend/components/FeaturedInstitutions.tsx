import React from 'react';

const institutions = [
    { name: 'MIT', logo: '/images/mit.png' },
    { name: 'Stanford', logo: '/images/stanford.png' },
    { name: 'Harvard', logo: '/images/harvard.png' },
    { name: 'Oxford', logo: '/images/oxford.png' },
    { name: 'Cambridge', logo: '/images/cambridge.png' },
    { name: 'IIT Delhi', logo: '/images/iit-delhi.png' },
    { name: 'IIT Bombay', logo: '/images/iit-bombay.png' },
    { name: 'Berkeley', logo: '/images/berkeley.png' },
    { name: 'Carnegie Mellon', logo: '/images/cmu.png' },
    { name: 'ETH Zurich', logo: '/images/eth.png' },
];

const FeaturedInstitutions: React.FC = () => {
    // Triple for seamless loop
    const allInstitutions = [...institutions, ...institutions, ...institutions];

    return (
        <section className="bg-white py-4 overflow-hidden relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left-to-right {
                    0% { transform: translateX(calc(-100% / 3)); }
                    100% { transform: translateX(0); }
                }
                .scroll-ltr {
                    display: flex;
                    gap: 3rem;
                    width: max-content;
                    animation: scroll-left-to-right 40s linear infinite;
                }
                .scroll-ltr:hover {
                    animation-play-state: paused;
                }
            ` }} />

            {/* Section Title */}
            <div className="text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold text-black mb-2 tracking-tight uppercase">
                    Featured <span className="text-[#6C4DFF]">Institutions</span>
                </h2>
                <p className="text-base md:text-lg text-gray-500 font-['Poppins'] font-medium">
                    Learning from the world's most prestigious universities
                </p>
            </div>

            <div className="relative">
                {/* Edge Gradients */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                <div className="scroll-ltr py-8 px-4">
                    {allInstitutions.map((institution, index) => (
                        <div
                            key={`${institution.name}-${index}`}
                            className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-6 transition-all duration-300 hover:scale-110"
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={institution.logo}
                                    alt={institution.name}
                                    className="max-w-full max-h-full object-contain transition-all duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `<span class="text-xl font-['Poppins'] font-bold text-gray-700">${institution.name}</span>`;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedInstitutions;
