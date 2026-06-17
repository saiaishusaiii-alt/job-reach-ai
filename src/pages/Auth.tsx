import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (isSignUp) {
      if (!formData.fullName) {
        setError('Please enter your full name');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data in localStorage (beginner-friendly)
      const userData = {
        email: formData.email,
        fullName: formData.fullName || 'User',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('jobreach_user', JSON.stringify(userData));
      localStorage.setItem('jobreach_auth_token', 'token_' + Date.now());

      showToast(
        isSignUp ? 'Account created successfully!' : 'Logged in successfully!',
        'success'
      );

      setTimeout(() => {
        navigate('/resume');
      }, 1000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card p-8 md:p-12">
          {/* Header */}
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-400">
              {isSignUp
                ? 'Join JobReach AI today'
                : 'Sign in to your account'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name (Sign Up Only) */}
            {isSignUp && (
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-violet-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 glass-card border border-white/10 rounded-lg focus:border-violet-400 focus:outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Email */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-violet-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 glass-card border border-white/10 rounded-lg focus:border-violet-400 focus:outline-none transition-all"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-violet-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 glass-card border border-white/10 rounded-lg focus:border-violet-400 focus:outline-none transition-all"
                />
              </div>
            </motion.div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-violet-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 glass-card border border-white/10 rounded-lg focus:border-violet-400 focus:outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                variants={fadeInUp}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              variants={fadeInUp}
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight size={18} />
            </motion.button>

            {/* Toggle Auth Mode */}
            <motion.div className="text-center text-sm text-slate-400" variants={fadeInUp}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
                }}
                className="text-violet-400 hover:text-violet-300 font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </motion.div>
          </motion.form>
        </div>

        {/* Info Box */}
        <motion.div
          className="mt-8 p-6 glass-card border border-cyan-500/20 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm text-slate-300">
            💡 <strong>Demo Mode:</strong> This is a demo authentication. Your data will be stored locally in your browser for this session.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
