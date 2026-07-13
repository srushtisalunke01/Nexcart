import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { Compass } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isLoading } = useAuthStore();

  // Show a premium glassmorphic loading screen while checking auth state
  if (isLoading) {
    return (
      <div class="min-screen flex items-center justify-center bg-luxury-gray-light">
        <div class="glass-card-light p-10 rounded-2xl flex flex-col items-center gap-4 max-w-sm text-center border border-white/60">
          <Compass className="w-12 h-12 text-luxury-gold animate-spin-slow" />
          <h3 class="font-serif text-lg font-bold text-luxury-blue">Authenticating</h3>
          <p class="text-xs text-luxury-gray-dark">Verifying your secure session certificates. Please hold.</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user session is absent
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home or warning page if role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
