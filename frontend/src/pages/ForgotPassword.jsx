import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Compass } from 'lucide-react';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/forgot-password', { email: data.email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit password reset request.');
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
        {/* Logo and title */}
        <div class="text-center mb-8">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-luxury-blue to-luxury-gold flex items-center justify-center shadow-md mb-4">
            <Compass className="text-white w-7 h-7 animate-spin-slow" />
          </div>
          <h2 class="font-serif text-3xl font-bold text-luxury-blue-dark">Recover Key</h2>
          <p class="text-xs text-luxury-gray-dark mt-2 tracking-wide uppercase font-semibold">Request a secure password reset token</p>
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
            <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Reset Link Generated</h3>
            <p class="text-sm text-luxury-gray-dark leading-relaxed">
              We have generated your password reset authorization. For development simulation:
            </p>
            <div class="p-4 rounded-xl bg-luxury-blue-deep text-left text-white text-xs font-mono space-y-2 select-text">
              <span class="text-luxury-gold block font-bold">检查控制台 / CHECK SERVER CONSOLE:</span>
              <span>Look at your backend server process console terminal window to copy the generated reset URL.</span>
            </div>
            <div class="pt-4">
              <Link to="/login" class="btn-primary inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-luxury-blue text-white rounded-xl">
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Reset Form */
          <form onSubmit={handleSubmit(onSubmit)} class="space-y-6">
            {error && (
              <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Registered Email Address</label>
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

            <button
              type="submit"
              disabled={isLoading}
              class="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-widest bg-luxury-blue text-white rounded-xl hover:bg-luxury-blue-light disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Verifying Records...
                </>
              ) : (
                'Generate Security Token'
              )}
            </button>

            <div class="text-center pt-2">
              <Link to="/login" class="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
