import React from 'react';
import { useAuthStore } from '../store/authStore.js';
import CustomerDashboard from '../components/CustomerDashboard.jsx';
import SellerDashboard from '../components/SellerDashboard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';

const Profile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="glass-card-light p-10 rounded-2xl max-w-md text-center">
          <h3 class="font-serif text-2xl font-bold text-luxury-blue mb-2">Authentication Required</h3>
          <p class="text-sm text-luxury-gray-dark mb-4">Please log in to access your profile assets.</p>
        </div>
      </div>
    );
  }

  // Dynamically load role-specific dashboard displays
  return (
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="mb-8 text-left">
        <span class="text-xs text-luxury-gold font-bold tracking-widest uppercase block mb-1">Exchange Central</span>
        <h1 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Account Portal</h1>
      </div>

      {user.role === 'Admin' && <AdminDashboard />}
      {(user.role === 'Business Seller' || user.role === 'Individual Seller') && <SellerDashboard />}
      {user.role === 'Customer' && <CustomerDashboard />}
    </div>
  );
};

export default Profile;
