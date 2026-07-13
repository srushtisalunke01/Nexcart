import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Lock, ArrowLeft, Loader2, CheckCircle2, Compass } from 'lucide-react';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`/api/auth/reset-password/${resetToken}`, { password: data.password });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Token is invalid or has expired. Please request a new recovery link.');
    } finally {
      setIsLoading(false);
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
        {/* Header */}
        <div class="text-center mb-8">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-luxury-blue to-luxury-gold flex items-center justify-center shadow-md mb-4">
            <Compass className="text-white w-7 h-7" />
          </div>
          <h2 class="font-serif text-3xl font-bold text-luxury-blue-dark">Reset Key</h2>
          <p class="text-xs text-luxury-gray-dark mt-2 tracking-wide uppercase font-semibold">Define your new credentials</p>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            class="text-center space-y-5"
          >
            <div class="w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full flex items-center justify-center mx-auto text-luxury-gold">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Security Key Cleared</h3>
            <p class="text-sm text-luxury-gray-dark leading-relaxed">
              Your password has been reset successfully. All previous active sessions have been securely terminated.
            </p>
            <div class="pt-4">
              <Link to="/login" class="btn-primary w-full py-3 text-xs uppercase tracking-widest bg-luxury-blue text-white rounded-xl">
                Sign In With New Credentials
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleSubmit(onSubmit)} class="space-y-5">
            {error && (
              <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            {/* Password input */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">New Password</label>
              <div class="relative">
                <Lock className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  class="luxury-input pl-12"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
              </div>
              {errors.password && <span class="text-[10px] font-bold text-red-500">{errors.password.message}</span>}
            </div>

            {/* Confirm password input */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Confirm New Password</label>
              <div class="relative">
                <Lock className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  class="luxury-input pl-12"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => value === passwordValue || 'Passwords do not match'
                  })}
                />
              </div>
              {errors.confirmPassword && <span class="text-[10px] font-bold text-red-500">{errors.confirmPassword.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              class="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-widest bg-luxury-blue text-white rounded-xl hover:bg-luxury-blue-light disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Updating Records...
                </>
              ) : (
                'Commit New Password'
              )}
            </button>

            <div class="text-center pt-2">
              <Link to="/login" class="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
                <ArrowLeft className="w-4 h-4" /> Cancel Recovery
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
