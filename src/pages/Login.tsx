import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, Chrome, Github, User } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onLoginSuccess?: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        if (onLoginSuccess) {
          onLoginSuccess(response.email || email);
        }
        onNavigate('home');
      } else {
        setError(response.error || 'Authentication failed.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (platform: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.loginWithSocial(platform);
      if (response.success) {
        if (onLoginSuccess) {
          onLoginSuccess(response.email || `${platform.toLowerCase()}user@nexcart.com`);
        }
        onNavigate('home');
      } else {
        setError(response.error || 'Social login failed.');
      }
    } catch (err) {
      setError('An error occurred during social login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-light dark:bg-premium-dark flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1000px] bg-white dark:bg-premium-cardDark rounded-premium shadow-glass-light dark:shadow-glass-dark border border-slate-100 dark:border-slate-800/40 flex flex-col md:flex-row overflow-hidden min-h-[600px] md:h-[680px]"
      >
        {/* Branding Panel (Left - 45%) */}
        <div className="hidden md:flex md:w-[45%] bg-slate-50 dark:bg-slate-900/40 relative flex-col justify-between p-8 overflow-hidden border-r border-slate-100 dark:border-slate-800/40">
          {/* Decorative Background Glows */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyber-cyan/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer mb-6"
            >
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="NexCart Logo" 
                  className="h-10 w-10 object-contain rounded-xl shadow-soft"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <svg className="h-9 w-9 text-brand-500 fill-current" viewBox="0 0 100 100">
                  <rect width="100" height="100" rx="25" fill="#FF6B00" />
                  <path 
                    d="M30 35 L45 35 L55 65 L75 65" 
                    stroke="white" 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" 
                  />
                  <circle cx="48" cy="78" r="7" fill="white" />
                  <circle cx="71" cy="78" r="7" fill="white" />
                </svg>
              )}
              <span className="text-2xl font-display font-extrabold tracking-wider">
                <span className="text-slate-800 dark:text-white">Nex</span>
                <span className="text-cyber-gold text-glow-gold">Cart</span>
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-slate-800 dark:text-white leading-tight">
              Curated Luxury, <br />Delivered.
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-2 font-medium flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" /> Shop Beyond Limits
            </p>
          </div>

          {/* Premium Watch Image Wrapper */}
          <div className="relative z-10 w-full h-[55%] rounded-2xl overflow-hidden shadow-soft border border-slate-200/50 dark:border-slate-850">
            <img 
              alt="Premium Watch Showcase" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLuXO0vKe0IDHMrr_jXYKc_uplz4iqBXXNQYkbzgJLJu38yzK_S0d4fIFf5GusHOtXb6sxhRzLmNzRa9wotJSy5ARJu0SZX7nmy0YHjFOXutwkBuXLej6PwcvQ1SbnUS7Y73BAYnhSFF9CsZAl41_3CyZ8XzZNCrOUCUwjoI-IzRl0eDWSg0CSw94cfYT4mFTm0UyT7XeT66EfFDQY2cJbd5YeO_MZZfU4Q07BI8TcICE1RJmgUsU_0_Kw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            © 2026 NexCart Luxury Retail.
          </div>
        </div>

        {/* Login Form Panel (Right - 55%) */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* Mobile Header Logo */}
          <div className="md:hidden flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="NexCart Logo" 
                  className="h-10 w-10 object-contain rounded-xl shadow-soft"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <svg className="h-9 w-9 text-brand-500 fill-current" viewBox="0 0 100 100">
                  <rect width="100" height="100" rx="25" fill="#FF6B00" />
                  <path 
                    d="M30 35 L45 35 L55 65 L75 65" 
                    stroke="white" 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" 
                  />
                  <circle cx="48" cy="78" r="7" fill="white" />
                  <circle cx="71" cy="78" r="7" fill="white" />
                </svg>
              )}
              <span className="text-2xl font-display font-extrabold">
                <span className="text-slate-800 dark:text-white">Nex</span>
                <span className="text-cyber-gold text-glow-gold">Cart</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display tracking-[0.2em] font-extrabold uppercase flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-500" /> Shop Beyond Limits
            </p>
          </div>

          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 dark:text-white leading-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-medium">
                Sign in to access your curated collection.
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-xs font-bold text-red-500"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input 
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/60 text-slate-850 dark:text-white text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 placeholder-slate-400 disabled:opacity-50"
                    id="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    required 
                    type="email"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest" htmlFor="password">
                    Password
                  </label>
                  <a 
                    className="text-[11px] font-bold text-brand-500 hover:text-brand-600 transition-colors" 
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isLoading) return;
                      alert("Password reset simulated.");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input 
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900/60 text-slate-850 dark:text-white text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 placeholder-slate-400 disabled:opacity-50"
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                  />
                  <button 
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none" 
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input 
                    className="h-4.5 w-4.5 text-brand-500 focus:ring-brand-500/20 border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900 accent-brand-500 disabled:opacity-50" 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox"
                    checked={rememberMe}
                    disabled={isLoading}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="ml-2 block text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-3">
                <button 
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3.5 px-4 gradient-orange text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/15 hover:shadow-premium-orange transition-all duration-200 disabled:opacity-50" 
                  type="submit"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <button 
                  onClick={async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                      const response = await authService.login('guest@nexcart.com', 'guest-password');
                      if (response.success) {
                        if (onLoginSuccess) onLoginSuccess('guest@nexcart.com');
                        onNavigate('home');
                      }
                    } catch (err) {
                      setError('Failed to log in as guest.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-1.5 py-3.5 px-4 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-700 dark:hover:text-white transition-all duration-200 disabled:opacity-50" 
                  type="button"
                >
                  <User className="h-4 w-4" />
                  Continue as Guest
                </button>
              </div>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800/80"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800/80"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-premium-cardDark font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-200 shadow-soft disabled:opacity-50" 
                type="button"
              >
                <Chrome className="h-4 w-4 text-red-500" />
                Google
              </button>
              <button 
                onClick={() => handleSocialLogin('GitHub')}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-premium-cardDark font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-200 shadow-soft disabled:opacity-50" 
                type="button"
              >
                <Github className="h-4 w-4" />
                GitHub
              </button>
            </div>

            <p className="text-center text-xs font-semibold text-slate-450 dark:text-slate-500 pt-4">
              Don't have an account?{' '}
              <a 
                className="font-bold text-brand-500 hover:text-brand-600 transition-colors" 
                href="#register"
                onClick={async (e) => {
                  e.preventDefault();
                  if (isLoading) return;
                  setIsLoading(true);
                  setError('');
                  try {
                    const response = await authService.login('guest@nexcart.com', 'signup-password');
                    if (response.success) {
                      alert("Registration simulation completed. Logging you in automatically.");
                      if (onLoginSuccess) onLoginSuccess('guest@nexcart.com');
                      onNavigate('home');
                    }
                  } catch (err) {
                    setError('Failed to complete registration.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
