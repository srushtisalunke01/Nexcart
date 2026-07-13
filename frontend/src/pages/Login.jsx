import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import { ShieldCheck, Mail, Lock, Loader2, Compass } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div class="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-white to-luxury-gray-light">
      {/* Decorative blurred backgrounds */}
      <div class="absolute top-20 left-20 w-72 h-72 rounded-full bg-luxury-blue/5 blur-3xl animate-luxury-float"></div>
      <div class="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-luxury-gold/5 blur-3xl animate-luxury-float" style={{ animationDelay: '2.5s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        class="glass-card-light w-full max-w-md p-8 md:p-10 rounded-3xl shadow-luxury border border-white/60 relative z-10"
      >
        {/* Branding header */}
        <div class="text-center mb-8">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-luxury-blue to-luxury-gold flex items-center justify-center shadow-md mb-4">
            <Compass className="text-white w-7 h-7" />
          </div>
          <h2 class="font-serif text-3xl font-bold text-luxury-blue-dark">Welcome Back</h2>
          <p class="text-xs text-luxury-gray-dark mt-2 tracking-wide uppercase font-semibold">Sign in to your premium trade account</p>
        </div>

        {/* Server Validation Message */}
        {authError && (
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            ⚠️ {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} class="space-y-5">
          {/* Email Input */}
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Email Address</label>
            <div class="relative">
              <Mail className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
              <input
                type="email"
                placeholder="client@nexusone.com"
                class="luxury-input pl-12"
                {...register('email', { 
                  required: 'Email address is required',
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
            </div>
            {errors.email && <span class="text-[10px] font-bold text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password Input */}
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase">Password</label>
              <Link to="/forgot-password" class="text-xs font-bold text-luxury-gold-dark hover:text-luxury-gold transition-colors">Forgot Password?</Link>
            </div>
            <div class="relative">
              <Lock className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
              <input
                type="password"
                placeholder="••••••••"
                class="luxury-input pl-12"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <span class="text-[10px] font-bold text-red-500">{errors.password.message}</span>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            class="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm uppercase tracking-widest bg-luxury-blue text-white rounded-xl hover:bg-luxury-blue-light disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4.5 h-4.5" /> Establish Connection
              </>
            )}
          </button>
        </form>

        {/* Footer toggles */}
        <div class="mt-8 pt-6 border-t border-luxury-gray-medium/50 text-center">
          <p class="text-xs text-luxury-gray-dark">
            New to the gateway?{' '}
            <Link to="/register" class="font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
              Become a Member
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
