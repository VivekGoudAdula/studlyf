
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const InteractiveCreature: React.FC = () => {
    const [isNearButton, setIsNearButton] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });
    const creatureRef = useRef<HTMLDivElement>(null);
    const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Spring physics for smooth movement (Horizontal X only for tracking)
    const x = useMotionValue(0);
    // Y spring handling the vertical "pop up" logic combined with button tracking
    const y = useMotionValue(30); // Start lowered (peeking)

    const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Activity tracking
            setIsActive(true);
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
            activityTimeoutRef.current = setTimeout(() => setIsActive(false), 2000); // Back to peeking after 2s idle

            if (!creatureRef.current) return;

            // Find the "Try now" button
            const tryNowButton = Array.from(document.querySelectorAll('button')).find(
                btn => btn.textContent?.includes('Try now')
            );

            let targetX = 0;
            let targetY = 30; // Default peeking position (raised)

            if (isActive) {
                targetY = 20; // Active state - pops up slightly to look around
            }

            if (tryNowButton) {
                const buttonRect = tryNowButton.getBoundingClientRect();
                const buttonCenterX = buttonRect.left + buttonRect.width / 2;
                const buttonCenterY = buttonRect.top + buttonRect.height / 2;

                // Calculate distance from cursor to button
                const distanceToButton = Math.sqrt(
                    Math.pow(e.clientX - buttonCenterX, 2) +
                    Math.pow(e.clientY - buttonCenterY, 2)
                );

                // Get creature's current position
                const creatureRect = creatureRef.current.getBoundingClientRect();
                const creatureCenterX = creatureRect.left + creatureRect.width / 2;
                const creatureCenterY = creatureRect.top + creatureRect.height / 2;

                // Calculate eye direction based on cursor
                const deltaX = e.clientX - creatureCenterX;
                const deltaY = e.clientY - creatureCenterY;
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100, 1);

                setEyeDirection({
                    x: Math.cos(angle) * distance * 5,
                    y: Math.sin(angle) * distance * 5
                });

                // Interaction radius
                const triggerDistance = 400;

                if (distanceToButton < triggerDistance) {
                    setIsNearButton(true);

                    // Calculate proximity factor
                    const rawProgress = Math.max(0, (triggerDistance - distanceToButton) / triggerDistance);
                    const proximityFactor = rawProgress * rawProgress;

                    // Calculate direction from creature to button
                    // Note: Since we are in a fixed navbar container, moving Y up implies negative values relative to container
                    // But we want to move towards the button which is usually above the navbar
                    // So targetY should decrease (move up screen) significantly

                    // X Movement
                    targetX = (e.clientX - window.innerWidth / 2) * 0.15; // Increased parallax

                    // Y Movement - "Coming out" logic
                    // If near button, pop up fully and reach high, but just touch!
                    targetY = -70 * proximityFactor;

                    // We don't want it to fly away from navbar completely, just pop out enthusiastically
                } else {
                    setIsNearButton(false);
                }
            }

            x.set(targetX);
            y.set(targetY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        };
    }, [x, y, isActive]);

    return (
        <motion.div
            ref={creatureRef}
            style={{ x: xSpring, y: ySpring }}
            className="relative pointer-events-none" // Relative because it lives inside the flex container now
        >
            {/* Creature Body Animation */}
            <motion.div
                animate={{
                    rotate: isNearButton ? [0, -3, 3, -3, 0] : 0,
                    scale: isNearButton ? 0.5 : 1,
                    filter: isNearButton ? "brightness(1.1)" : "brightness(1)"
                }}
                transition={{
                    rotate: { duration: 0.4, repeat: isNearButton ? Infinity : 0 },
                    scale: { duration: 0.4, repeat: 0 },
                    filter: { duration: 0.2 }
                }}
                className="relative"
            >
                {/* Main Body - Premium Purple 3D Look */}
                <div className="w-24 h-24 bg-[radial-gradient(circle_at_30%_30%,_#C4B5FD_0%,_#7C3AED_60%,_#5B21B6_100%)] rounded-full shadow-2xl shadow-purple-500/40 relative border-[3px] border-white/90">

                    {/* Eyes Container */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
                        {/* Left Eye */}
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                            <motion.div
                                animate={{ x: eyeDirection.x, y: eyeDirection.y }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-4 h-4 bg-[#4C1D95] rounded-full"
                            >
                                {/* Eye reflection */}
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                            </motion.div>
                        </div>

                        {/* Right Eye */}
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                            <motion.div
                                animate={{ x: eyeDirection.x, y: eyeDirection.y }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-4 h-4 bg-[#4C1D95] rounded-full"
                            >
                                {/* Eye reflection */}
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Mouth - Subtle Smile */}
                    <motion.div
                        animate={{
                            height: isNearButton ? 14 : 10,
                            width: isNearButton ? 28 : 20,
                            borderRadius: isNearButton ? "0 0 20px 20px" : "0 0 10px 10px"
                        }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#4C1D95] opacity-80"
                    />

                    {/* Cheeks */}
                    <div className="absolute top-12 left-2 w-4 h-2.5 bg-pink-400 rounded-full blur-[3px] opacity-40" />
                    <div className="absolute top-12 right-2 w-4 h-2.5 bg-pink-400 rounded-full blur-[3px] opacity-40" />

                    {/* Arms - More fluid motion */}
                    <motion.div
                        animate={{ rotate: isNearButton ? [0, -25, 0] : 0 }}
                        transition={{ duration: 0.4, repeat: isNearButton ? Infinity : 0 }}
                        className="absolute -left-1 top-12 w-5 h-8 bg-[#7C3AED] rounded-full border-2 border-white/80 origin-top-right transform -translate-x-1"
                    />
                    <motion.div
                        animate={{ rotate: isNearButton ? [0, 25, 0] : 0 }}
                        transition={{ duration: 0.4, repeat: isNearButton ? Infinity : 0 }}
                        className="absolute -right-1 top-12 w-5 h-8 bg-[#7C3AED] rounded-full border-2 border-white/80 origin-top-left transform translate-x-1"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default InteractiveCreature;
