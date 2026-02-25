
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard/learner');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard/learner');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
      navigate('/dashboard/learner');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout targetButtonText="Log In">
      <AuthCard title="Login">
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-red-500/10 text-red-400 text-xs rounded-xl font-bold border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white px-1 uppercase tracking-widest opacity-40">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/40 focus:bg-white/[0.08] transition-all outline-none text-white placeholder:text-gray-600 shadow-inner"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-white uppercase tracking-widest opacity-40">Password</label>
              <button type="button" className="text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest">
                Recover
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/40 focus:bg-white/[0.08] transition-all outline-none text-white placeholder:text-gray-600 shadow-inner"
              required
            />
          </div>

          <motion.button
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-500/20 transition-all mt-6 text-xs"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[9px] text-white/30 font-black uppercase tracking-[0.3em]">Direct Access</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex-1 py-3 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/[0.1] hover:border-white/20 transition-all font-bold text-white shadow-sm"
            >
              <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-5 h-5 transition-all" alt="Google" />
              <span className="text-xs uppercase tracking-widest">Google</span>
            </button>
            <button
              onClick={handleGithubLogin}
              className="flex-1 py-3 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/[0.1] hover:border-white/20 transition-all font-bold text-white shadow-sm"
            >
              <img src="https://www.vectorlogo.zone/logos/github/github-icon.svg" className="w-5 h-5 transition-all" alt="GitHub" />
              <span className="text-xs uppercase tracking-widest">GitHub</span>
            </button>
          </div>
        </div>

        <div className="mt-10 text-center text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
          No account?{' '}
          <Link to="/signup" className="text-purple-400 font-black hover:text-white transition-all underline decoration-purple-500/30 underline-offset-4">
            Sign up
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
