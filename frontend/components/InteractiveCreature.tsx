import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface InteractiveCreatureProps {
    targetButtonText?: string;
    className?: string;
    isCursor?: boolean;
}

const InteractiveCreature: React.FC<InteractiveCreatureProps> = ({
    targetButtonText = 'Try now',
    className = "",
    isCursor = false
}) => {
    const [isNearButton, setIsNearButton] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });
    const creatureRef = useRef<HTMLDivElement>(null);
    const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Spring physics for smooth movement
    const x = useMotionValue(0);
    const y = useMotionValue(isCursor ? 0 : 30);

    const springConfig = isCursor
        ? { damping: 25, stiffness: 200, mass: 0.5 } // More responsive for cursor
        : { damping: 20, stiffness: 100, mass: 0.8 };

    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setIsActive(true);
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
            activityTimeoutRef.current = setTimeout(() => setIsActive(false), 2000);

            if (!creatureRef.current) return;

            if (isCursor) {
                // For cursor mode, follow mouse coordinates directly
                x.set(e.clientX);
                y.set(e.clientY);

                // Look at the center of the viewport
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const deltaX = centerX - e.clientX;
                const deltaY = centerY - e.clientY;
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100, 1);

                setEyeDirection({
                    x: Math.cos(angle) * distance * 5,
                    y: Math.sin(angle) * distance * 5
                });

                // Interaction with buttons even in cursor mode
                const targetButton = Array.from(document.querySelectorAll('button')).find(
                    btn => {
                        const rect = btn.getBoundingClientRect();
                        return e.clientX > rect.left && e.clientX < rect.right &&
                            e.clientY > rect.top && e.clientY < rect.bottom;
                    }
                );
                setIsNearButton(!!targetButton);

                return;
            }

            // Enhanced logic for auth flow: React to ANY button
            const buttons = Array.from(document.querySelectorAll('button'));
            const targetButton = buttons.find(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return text.includes('log in') ||
                    text.includes('sign up') ||
                    text.includes('create account') ||
                    text.includes('google') ||
                    text.includes('github') ||
                    text.includes(targetButtonText.toLowerCase());
            });

            let targetX = 0;
            let targetY = 30;

            if (isActive) targetY = 20;

            if (targetButton) {
                const buttonRect = targetButton.getBoundingClientRect();
                const buttonCenterX = buttonRect.left + buttonRect.width / 2;
                const buttonCenterY = buttonRect.top + buttonRect.height / 2;

                // Distance from mouse to button
                const mouseToButtonDist = Math.sqrt(
                    Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
                );

                const creatureRect = creatureRef.current.getBoundingClientRect();
                const creatureCenterX = creatureRect.left + creatureRect.width / 2;
                const creatureCenterY = creatureRect.top + creatureRect.height / 2;

                const deltaX = e.clientX - creatureCenterX;
                const deltaY = e.clientY - creatureCenterY;
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100, 1);

                setEyeDirection({
                    x: Math.cos(angle) * distance * 5,
                    y: Math.sin(angle) * distance * 5
                });

                // If mouse is near one of our target buttons, keep the reaction (blinking/scaling)
                // but we fixed the creature position to (0, 30) or center.
                const triggerDistance = 450;
                setIsNearButton(mouseToButtonDist < triggerDistance);
            }

            // Fix position to center
            x.set(0);
            y.set(30);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        };
    }, [x, y, isActive, targetButtonText, isCursor]);

    return (
        <motion.div
            ref={creatureRef}
            style={{
                x: xSpring,
                y: ySpring,
                position: isCursor ? 'fixed' : 'relative',
                left: isCursor ? 0 : 'auto',
                top: isCursor ? 0 : 'auto',
                zIndex: isCursor ? 9999 : 'auto',
                pointerEvents: 'none',
                transform: isCursor ? 'translate(-50%, -50%)' : 'none'
            }}
            className={className}
        >
            <motion.div
                animate={{
                    rotate: isNearButton ? [0, -10, 10, -10, 0] : 0,
                    scale: isNearButton ? 0.7 : isCursor ? 0.6 : 1, // Scaled down for cursor
                }}
                transition={{
                    rotate: { duration: 0.4, repeat: isNearButton ? Infinity : 0 },
                }}
            >
                {/* Main Body - Premium Purple 3D Look */}
                <div className="w-24 h-24 bg-[radial-gradient(circle_at_30%_30%,_#C4B5FD_0%,_#7C3AED_60%,_#5B21B6_100%)] rounded-full shadow-2xl shadow-purple-500/40 relative border-[3px] border-white/90">

                    {/* Eyes Container */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                            <motion.div
                                animate={{ x: eyeDirection.x, y: eyeDirection.y }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-4 h-4 bg-[#4C1D95] rounded-full"
                            >
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                            </motion.div>
                        </div>
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                            <motion.div
                                animate={{ x: eyeDirection.x, y: eyeDirection.y }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="w-4 h-4 bg-[#4C1D95] rounded-full"
                            >
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Mouth */}
                    <motion.div
                        animate={{
                            height: isNearButton ? 14 : 10,
                            width: isNearButton ? 28 : 20,
                            borderRadius: isNearButton ? "0 0 20px 20px" : "0 0 10px 10px"
                        }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#4C1D95] opacity-80"
                    />

                    {/* Cheeks */}
                    <div className="absolute top-12 left-2 w-4 h-2.5 bg-purple-300 rounded-full blur-[3px] opacity-40" />
                    <div className="absolute top-12 right-2 w-4 h-2.5 bg-purple-300 rounded-full blur-[3px] opacity-40" />

                    {/* Arms */}
                    <motion.div
                        animate={{ rotate: isNearButton ? [0, -45, 0] : 0 }}
                        transition={{ duration: 0.4, repeat: isNearButton ? Infinity : 0 }}
                        className="absolute -left-1 top-12 w-5 h-8 bg-[#7C3AED] rounded-full border-2 border-white/80 origin-top-right transform -translate-x-1"
                    />
                    <motion.div
                        animate={{ rotate: isNearButton ? [0, 45, 0] : 0 }}
                        transition={{ duration: 0.4, repeat: isNearButton ? Infinity : 0 }}
                        className="absolute -right-1 top-12 w-5 h-8 bg-[#7C3AED] rounded-full border-2 border-white/80 origin-top-left transform translate-x-1"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default InteractiveCreature;
