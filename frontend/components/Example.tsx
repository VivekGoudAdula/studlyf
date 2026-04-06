import React, { useContext } from "react";
import { motion } from "framer-motion";
import { BatteryCharging as FiBatteryCharging, Wifi as FiWifi } from "lucide-react";

// Context to receive color and text from parent (DashboardHome)
export const ExampleColorContext = React.createContext({
  gradient: "#301040",
  accent: "#E03070",
  headline: "Feature Headline",
  text: "Studlyf Product Brief",
  image: "",
});
const Example = () => {
  const { gradient, accent, headline, text, image } = useContext(ExampleColorContext);
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 md:p-6" style={{ background: gradient, maxWidth: '800px', margin: '0 auto', minHeight: '340px' }}>
      {/* Text on the left (outside mobile) */}
      <div
        className="max-w-sm text-white mb-4 md:mb-0 md:mr-16 md:ml-0 ml-0 flex flex-col justify-center -translate-x-2 md:-translate-x-4"
        style={{ color: '#fff', textAlign: 'left', minHeight: '280px' }}
      >
        {headline && (
          <h3 className="font-bold text-xl sm:text-2xl lg:text-[1.6rem] mb-3 whitespace-nowrap tracking-tight underline decoration-white/30 decoration-2 underline-offset-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            {headline}
          </h3>
        )}
        <p className="text-base sm:text-lg font-normal text-justify leading-relaxed text-white/90" style={{ fontFamily: 'Times New Roman, Times, serif', fontWeight: 400 }}>
          {text}
        </p>
      </div>
      {/* Mobile with image inside */}
      <FloatingPhone image={image} accent={accent} />
    </section>
  );
};

const FloatingPhone = ({ image, accent }: { image: string; accent: string }) => {
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-30deg) rotateX(15deg)",
      }}
      className="rounded-[24px] bg-violet-500"
    >
      <motion.div
        initial={{
          transform: "translateZ(8px) translateY(-2px)",
        }}
        animate={{
          transform: "translateZ(32px) translateY(-8px)",
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2,
          ease: "easeInOut",
        }}
        className="relative h-96 w-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white border-l-neutral-200 border-t-neutral-200 bg-neutral-900 p-1 pl-[3px] pt-[3px]"
      >
        <HeaderBar />
        <Screen image={image} accent={accent} />
      </motion.div>
    </div>
  );
};

const HeaderBar = () => {
  return (
    <>
      <div className="absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md bg-neutral-900"></div>
      <div className="absolute right-3 top-2 z-10 flex gap-2">
        <FiWifi className="text-neutral-600" />
        <FiBatteryCharging className="text-neutral-600" />
      </div>
    </>
  );
};

const Screen = ({ image, accent }: { image: string; accent: string }) => {
  return (
    <div className="relative z-0 grid h-full w-full place-content-center overflow-hidden rounded-[20px] bg-white">
      {image && (
        <img
          src={image}
          alt="Product Brief"
          className="max-h-80 max-w-[98%] mx-auto rounded-xl object-contain"
          style={{ border: `2px solid ${accent}`, marginTop: '-18px' }}
        />
      )}
      {/* Removed Get Started button as requested */}
      {/* Removed blue color curve as requested */}
    </div>
  );
};

export default Example;
