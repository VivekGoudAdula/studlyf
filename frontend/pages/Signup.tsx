import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import { User, Briefcase } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'hiring_partner'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = 'admin@studlyf.com';

  const redirectByRole = (role: string) => {
    if (role === 'super_admin' || role === 'admin') {
      navigate('/admin');
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

      const finalRole =
        email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
          ? 'super_admin'
          : selectedRole;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email,
        role: finalRole,
        createdAt: new Date().toISOString(),
        status: 'active',
      });

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
        const finalRole =
          user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
            ? 'super_admin'
            : selectedRole;

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

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 text-sm mb-1";

  const labelClasses =
    "block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <AuthLayout>
      <AuthCard title="Sign Up" maxWidth="max-w-[450px]">

        {/* Role Selection */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100/50 rounded-2xl border border-gray-200/50">
          <button
            onClick={() => setSelectedRole('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'student'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User size={14} /> Student
          </button>

          <button
            onClick={() => setSelectedRole('hiring_partner')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'hiring_partner'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Briefcase size={14} /> Hiring Partner
          </button>
        </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Password</label>
              <input
                type="password"
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
                className={inputClasses}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white rounded-[16px] font-bold text-xs uppercase tracking-widest shadow-lg"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </motion.button>
        </form>

      </AuthCard>
    </AuthLayout>
  );
};

export default Signup;