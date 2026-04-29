
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Building2, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthCard from './AuthCard';

interface SignupFormProps {
    onSwitchToLogin: () => void;
    transparent?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, transparent = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Auth State
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    // Role detection from URL
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role') || 'student';

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Institution Email Check
        if (selectedRole === 'institution') {
            const personalDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com"];
            const domain = email.split("@").pop()?.toLowerCase();
            if (domain && personalDomains.includes(domain)) {
                setError("Please use your institution's official email (e.g., @university.edu). Personal Gmail/Yahoo accounts are not permitted for institutional registration.");
                return;
            }
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8000/api/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setStep(2);
                setResendCooldown(60); // 60 seconds cooldown
                setSuccessMsg('Verification code sent to your email.');
            } else {
                setError(data.detail || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('Connection failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // 0. Client-side Strength Check
            const strength = getPasswordStrength(password);
            if (strength < 4) {
                setError("Password is not strong enough. Please include at least 8 characters, an uppercase letter, a number, and a special character.");
                setLoading(false);
                return;
            }

            // 1. Verify OTP
            const verifyRes = await fetch('http://localhost:8000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, name: fullName })
            });

            if (!verifyRes.ok) {
                const data = await verifyRes.json();
                setError(data.detail || 'Invalid verification code.');
                setLoading(false);
                return;
            }

            // 2. Complete Signup in MongoDB
            const signupRes = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName,
                    role: selectedRole
                })
            });

            if (signupRes.ok) {
                setStep(3);
                setTimeout(() => onSwitchToLogin(), 3000);
            } else {
                const data = await signupRes.json();
                setError(data.detail || 'Registration failed.');
            }
        } catch (err) {
            setError('System error during registration.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 text-sm";
    const labelClasses = "block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <AuthCard 
            title={step === 3 ? "Welcome Aboard" : "Create Account"} 
            maxWidth="max-w-[450px]" 
            transparent={transparent}
        >
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleRequestOTP}
                        className="space-y-4"
                    >
                        {error && <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">{error}</div>}
                        
                        <div>
                            <label className={labelClasses}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Nagasiva Kumari"
                                    className={inputClasses + " pl-10"}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-300" size={18} />
                                <input
                                    type="email"
                                    placeholder="naga@institution.org"
                                    className={inputClasses + " pl-10"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-300" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={inputClasses + " pl-10"}
                                    value={password}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 50) {
                                            setPassword(e.target.value);
                                        }
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-purple-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {password.length > 0 && (
                                <div className="mt-2 flex gap-1 px-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div 
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                getPasswordStrength(password) >= level 
                                                    ? (getPasswordStrength(password) <= 2 ? 'bg-orange-400' : 'bg-green-500')
                                                    : 'bg-gray-100'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending Code...' : 'Verify Email'}
                            <ArrowRight size={16} />
                        </button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleVerifyAndSignup}
                        className="space-y-6 text-center"
                    >
                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                            <p className="text-[10px] uppercase font-black text-purple-600 tracking-widest mb-1">Check your inbox</p>
                            <p className="text-xs text-gray-600">We sent a verification code to <b>{email}</b></p>
                        </div>

                        {error && <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">{error}</div>}

                        <input
                            type="text"
                            placeholder="0 0 0 0 0 0"
                            className="w-full text-center text-3xl font-black tracking-[0.6em] py-5 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-500 transition-all outline-none shadow-sm placeholder:text-gray-200 text-gray-900"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                            maxLength={6}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                        >
                            {loading ? 'Finalizing...' : 'Complete Registration'}
                        </button>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <button 
                                    type="button"
                                    disabled={resendCooldown > 0 || loading}
                                    onClick={handleRequestOTP}
                                    className={`text-[10px] font-bold uppercase tracking-widest transition-all ${resendCooldown > 0 ? 'text-gray-300' : 'text-purple-600 hover:text-purple-700 underline underline-offset-4'}`}
                                >
                                    Resend Verification Code
                                </button>
                                {resendCooldown > 0 && (
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                                        Wait {resendCooldown}s
                                    </span>
                                )}
                            </div>

                            <button 
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-purple-600"
                            >
                                Back to Details
                            </button>
                        </div>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-2">Registration Complete</h2>
                        <p className="text-gray-500 text-sm mb-8">Your identity has been verified and stored securely in our MongoDB cluster.</p>
                        <div className="flex items-center justify-center gap-2 text-purple-600 font-bold text-[10px] uppercase tracking-widest">
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            Redirecting to Login...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {step < 3 && (
                <div className="mt-8 text-center pt-6 border-t border-gray-50">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-purple-600 hover:text-purple-700 transition-colors ml-1"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            )}
        </AuthCard>
    );
};

export default SignupForm;
