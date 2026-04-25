
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AuthCard from './AuthCard';

interface SignupFormProps {
    onSwitchToLogin: () => void;
    transparent?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, transparent = false }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = (queryParams.get('role') as string) || 'student';

    const ADMIN_EMAIL = 'admin@studlyf.com';

    const redirectByRole = (role: string) => {
        if (role === 'super_admin' || role === 'admin') {
            navigate('/admin');
        } else if (role === 'institution') {
            navigate('/institution-dashboard');
        } else {
            navigate('/dashboard/learner');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            const finalRole = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'super_admin' : selectedRole;
            console.log("[Signup] Attempting to save user to Firestore with role:", finalRole);
            localStorage.setItem(`userRole_${user.uid}`, finalRole);
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: name,
                email,
                role: finalRole,
                createdAt: new Date().toISOString(),
                status: 'active',
            });
            console.log("[Signup] Successfully saved user role to Firestore.");
            redirectByRole(finalRole);
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (type: 'google' | 'github') => {
        const provider = type === 'google' ? googleProvider : githubProvider;
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                const finalRole = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'super_admin' : selectedRole;
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    role: finalRole,
                    createdAt: new Date().toISOString(),
                    status: 'active',
                });
                redirectByRole(finalRole);
            } else {
                const userData = userDoc.data();
                redirectByRole(userData.role);
            }
        } catch (err: any) {
            setError(err.message || `${type} sign-in failed`);
        }
    };

    const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 text-sm mb-1";
    const labelClasses = "block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <AuthCard title="Create Account" maxWidth="max-w-[450px]" transparent={transparent}>
            <form onSubmit={handleSignup} className="space-y-2.5">
                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className={inputClasses}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        className={inputClasses}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClasses}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={inputClasses}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Confirm</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={inputClasses}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Start Evolution button — same effects as Try Now */}
                <style>{`
                    @keyframes evo-shimmer {
                        0%   { transform: translateX(-180%) skewX(-20deg); }
                        100% { transform: translateX(300%) skewX(-20deg); }
                    }
                    @keyframes evo-orb1 {
                        0%,100% { transform: translate(0px,0px) scale(1);    opacity: 0.55; }
                        40%     { transform: translate(8px,-6px) scale(1.3);  opacity: 0.9; }
                        70%     { transform: translate(-4px,4px) scale(0.8);  opacity: 0.4; }
                    }
                    @keyframes evo-orb2 {
                        0%,100% { transform: translate(0px,0px) scale(1);     opacity: 0.4; }
                        35%     { transform: translate(-10px,-8px) scale(1.4); opacity: 0.85; }
                        65%     { transform: translate(6px,5px) scale(0.75);   opacity: 0.35; }
                    }
                    @keyframes evo-orb3 {
                        0%,100% { transform: translate(0px,0px) scale(1);    opacity: 0.5; }
                        50%     { transform: translate(6px,8px) scale(1.25);  opacity: 0.9; }
                    }
                    .evo-btn {
                        position: relative;
                        width: 100%;
                        padding: 12px 0;
                        background: linear-gradient(to right, #7C3AED, #6D28D9);
                        color: #fff;
                        border: none;
                        border-radius: 16px;
                        font-weight: 700;
                        font-size: 12px;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                        cursor: pointer;
                        overflow: hidden;
                        margin-top: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                        box-shadow: 0 4px 20px rgba(124,58,237,0.3), 0 1px 0 rgba(255,255,255,0.1) inset;
                    }
                    .evo-btn::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: 16px;
                        background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 55%);
                        pointer-events: none;
                        z-index: 1;
                    }
                    .evo-btn::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0;
                        width: 40%; height: 100%;
                        background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%);
                        animation: evo-shimmer 2.8s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 2;
                    }
                    .evo-btn:hover {
                        transform: translateY(-2px) scale(1.01);
                        box-shadow: 0 0 0 5px rgba(139,92,246,0.15), 0 0 30px 10px rgba(139,92,246,0.4), 0 12px 30px rgba(109,40,217,0.45);
                    }
                    .evo-btn:active { transform: scale(0.98); }
                    .evo-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                    .evo-orb {
                        position: absolute;
                        border-radius: 50%;
                        pointer-events: none;
                        filter: blur(7px);
                        z-index: 1;
                    }
                    .evo-orb1 { width:28px; height:28px; background: radial-gradient(circle, rgba(196,168,255,0.95), transparent 70%); top:-4px; left:18px; animation: evo-orb1 3.2s ease-in-out infinite; }
                    .evo-orb2 { width:22px; height:22px; background: radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%);  bottom:-2px; right:52px; animation: evo-orb2 4s ease-in-out infinite; }
                    .evo-orb3 { width:18px; height:18px; background: radial-gradient(circle, rgba(167,139,250,0.9), transparent 70%); top:4px; right:24px; animation: evo-orb3 2.6s ease-in-out infinite; }
                    .evo-label { position: relative; z-index: 5; }
                `}</style>

                <button
                    type="submit"
                    disabled={loading}
                    className="evo-btn"
                >
                    <span className="evo-orb evo-orb1" />
                    <span className="evo-orb evo-orb2" />
                    <span className="evo-orb evo-orb3" />
                    <span className="evo-label">{loading ? 'Processing...' : 'Start Evolution'}</span>
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="flex-grow h-[1px] bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow h-[1px] bg-gray-100" />
            </div>

            <div className="flex gap-4">
                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('google')}
                    className="flex-1 py-3 border border-gray-100 rounded-[16px] flex items-center justify-center transition-all duration-200"
                    title="Google"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('github')}
                    className="flex-1 py-3 border border-gray-100 rounded-[16px] flex items-center justify-center transition-all duration-200"
                    title="GitHub"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.267 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </motion.button>
            </div>

            <div className="mt-8 text-center pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-xs">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-bold text-purple-600 hover:text-purple-700 transition-colors underline-offset-4 hover:underline">
                        Log in
                    </button>
                </p>
            </div>
        </AuthCard>
    );
};

export default SignupForm;
