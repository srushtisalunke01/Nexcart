import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import { UserPlus, Mail, Lock, User, Phone, Briefcase, Loader2, Compass } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: signup, isLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Customer');

  const onSubmit = async (data) => {
    const result = await signup(
      data.name,
      data.email,
      data.password,
      data.role,
      data.phoneNumber
    );
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div class="min-h-[85vh] flex items-center justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-white to-luxury-gray-light">
      {/* Decorative background shapes */}
      <div class="absolute top-20 left-20 w-72 h-72 rounded-full bg-luxury-blue/5 blur-3xl animate-luxury-float"></div>
      <div class="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-luxury-gold/5 blur-3xl animate-luxury-float" style={{ animationDelay: '2.5s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        class="glass-card-light w-full max-w-xl p-8 md:p-10 rounded-3xl shadow-luxury border border-white/60 relative z-10"
      >
        {/* Header */}
        <div class="text-center mb-8">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-luxury-blue to-luxury-gold flex items-center justify-center shadow-md mb-4">
            <Compass className="text-white w-7 h-7 animate-spin-slow" />
          </div>
          <h2 class="font-serif text-3xl font-bold text-luxury-blue-dark">Join the Gateway</h2>
          <p class="text-xs text-luxury-gray-dark mt-2 tracking-wide uppercase font-semibold">Establish your premium trader profile</p>
        </div>

        {/* Server Validation Message */}
        {authError && (
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            ⚠️ {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Input */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Full Name</label>
              <div class="relative">
                <User className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
                <input
                  type="text"
                  placeholder="Arthur Dent"
                  class="luxury-input pl-12"
                  {...register('name', { required: 'Full name is required' })}
                />
              </div>
              {errors.name && <span class="text-[10px] font-bold text-red-500">{errors.name.message}</span>}
            </div>

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

            {/* Phone Number Input */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Phone Number</label>
              <div class="relative">
                <Phone className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
                <input
                  type="tel"
                  placeholder="+1 555-0199"
                  class="luxury-input pl-12"
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                />
              </div>
              {errors.phoneNumber && <span class="text-[10px] font-bold text-red-500">{errors.phoneNumber.message}</span>}
            </div>

            {/* Role Select */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Membership Type</label>
              <div class="relative">
                <Briefcase className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
                <select
                  class="luxury-input pl-12 pr-8 appearance-none bg-no-repeat bg-[right_1rem_center]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a5568'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                  {...register('role', { 
                    required: 'Please select a membership type',
                    onChange: (e) => setSelectedRole(e.target.value)
                  })}
                >
                  <option value="Customer">Customer (Buyer)</option>
                  <option value="Individual Seller">Individual Seller (C2C)</option>
                  <option value="Business Seller">Business Seller (B2B)</option>
                </select>
              </div>
              {errors.role && <span class="text-[10px] font-bold text-red-500">{errors.role.message}</span>}
            </div>
          </div>

          {/* Password Input */}
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Password</label>
            <div class="relative">
              <Lock className="absolute left-4 top-3.5 text-luxury-gray w-5 h-5" />
              <input
                type="password"
                placeholder="•••••••• (Min 6 characters)"
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

          {/* Role specific notice banner */}
          {selectedRole === 'Business Seller' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              class="p-4 rounded-xl bg-luxury-gold/10 border border-luxury-gold/30 text-xs text-luxury-blue-dark"
            >
              💼 <strong>Business Onboarding Info:</strong> As a Business Seller, you can input your license number and upload company branding assets (logo/banner) directly in your vendor dashboard after registering.
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            class="btn-primary w-full py-3.5 mt-4 flex items-center justify-center gap-2 text-sm uppercase tracking-widest bg-luxury-blue text-white rounded-xl hover:bg-luxury-blue-light disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Provisioning Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4.5 h-4.5" /> Initialize Membership
              </>
            )}
          </button>
        </form>

        {/* Footer toggles */}
        <div class="mt-8 pt-6 border-t border-luxury-gray-medium/50 text-center">
          <p class="text-xs text-luxury-gray-dark">
            Already registered?{' '}
            <Link to="/login" class="font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
              Access the Gateway
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
