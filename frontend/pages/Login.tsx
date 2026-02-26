import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUser = async (user: any) => {
    // Immediate admin redirect
    if (user.email?.toLowerCase() === 'admin@studlyf.com') {
      navigate('/admin');
      return;
    }

    // Fetch role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();

      if (userData.role === 'super_admin' || userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard/learner');
      }
    } else {
      navigate('/dashboard/learner');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectUser(userCredential.user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (type: 'google' | 'github') => {
    const provider = type === 'google' ? googleProvider : githubProvider;

    try {
      const result = await signInWithPopup(auth, provider);
      await redirectUser(result.user);
    } catch (err: any) {
      setError(err.message || `${type} sign-in failed`);
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 text-sm mb-1";

  const labelClasses =
    "block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <AuthLayout>
      <AuthCard title="Login" maxWidth="max-w-[450px]">
        <form onSubmit={handleLogin} className="space-y-2.5">
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">
              {error}
            </div>
          )}

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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={labelClasses}>Password</label>
              <Link
                to="#"
                className="text-[10px] font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className={inputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01, translateY: -1 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white rounded-[16px] font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Log In'}
          </motion.button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-grow h-[1px] bg-gray-100" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-grow h-[1px] bg-gray-100" />
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('google')}
            className="flex-1 py-4 border border-gray-100 rounded-[16px] flex items-center justify-center transition-all duration-200"
            title="Google"
          >
            Google
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('github')}
            className="flex-1 py-4 border border-gray-100 rounded-[16px] flex items-center justify-center transition-all duration-200"
            title="GitHub"
          >
            GitHub
          </motion.button>
        </div>

        <div className="mt-6 text-center pt-2 border-t border-gray-100">
          <p className="text-gray-500 text-xs">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-purple-600 hover:text-purple-700 transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;