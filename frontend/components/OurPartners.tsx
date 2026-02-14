import React from 'react';

const partners = [
    { name: 'Google', logo: '/images/google.png' },
    { name: 'Microsoft', logo: '/images/microsoft.png' },
    { name: 'Amazon', logo: '/images/amazon.png' },
    { name: 'Apple', logo: '/images/apple.png' },
    { name: 'Meta', logo: '/images/meta.png' },
    { name: 'Netflix', logo: '/images/netflix.png' },
    { name: 'Tesla', logo: '/images/tesla.png' },
    { name: 'NVIDIA', logo: '/images/nvidia.png' },
    { name: 'Adobe', logo: '/images/adobe.png' },
    { name: 'Oracle', logo: '/images/oracle.png' },
    { name: 'Salesforce', logo: '/images/salesforce.png' },
    { name: 'IBM', logo: '/images/ibm.png' },
    { name: 'Intel', logo: '/images/intel.png' },
    { name: 'Uber', logo: '/images/uber.png' },
    { name: 'Airbnb', logo: '/images/airbnb.png' },
    { name: 'LinkedIn', logo: '/images/linkedin.png' },
    { name: 'Stripe', logo: '/images/stripe.png' },
    { name: 'PayPal', logo: '/images/paypal.png' },
];

const OurPartners: React.FC = () => {
    // Triple for seamless loop
    const allPartners = [...partners, ...partners, ...partners];

    return (
        <section className="bg-gradient-to-b from-white to-purple-50/30 py-4 overflow-hidden relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-right-to-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-100% / 3)); }
                }
                .scroll-rtl {
                    display: flex;
                    gap: 3rem;
                    width: max-content;
                    animation: scroll-right-to-left 45s linear infinite;
                }
                .scroll-rtl:hover {
                    animation-play-state: paused;
                }
            ` }} />

            {/* Section Title */}
            <div className="text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold text-black mb-2 tracking-tight uppercase">
                    Our <span className="text-[#6C4DFF]">Partners</span>
                </h2>
                <p className="text-base md:text-lg text-gray-500 font-['Poppins'] font-medium">
                    Collaborating with industry-leading technology platforms
                </p>
            </div>

            <div className="relative">
                {/* Edge Gradients */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-white via-purple-50/30 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-white via-purple-50/30 to-transparent z-10 pointer-events-none"></div>

                <div className="scroll-rtl py-8 px-4">
                    {allPartners.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-6 transition-all duration-300 hover:scale-110"
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-w-full max-h-full object-contain transition-all duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `<span class="text-lg font-['Poppins'] font-bold text-gray-700">${partner.name}</span>`;
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

export default OurPartners;
