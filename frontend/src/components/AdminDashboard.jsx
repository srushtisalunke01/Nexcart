import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { 
  Users, ShieldCheck, Layers, FileText, Gift, BarChart3, Settings,
  Check, X, Trash2, Plus, Clock, ShieldAlert, Award
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Admin Data states
  const [usersList, setUsersList] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);

  // Category and Coupon forms state
  const [newCatName, setNewCatName] = useState('');
  const [newCouponFields, setNewCouponFields] = useState({
    code: '', discountType: 'Percentage', discountValue: '', minPurchaseAmount: '', expiryDate: '', usageLimit: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      if (activeTab === 'analytics') {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setGlobalStats(res.data.stats);
          setMonthlySales(res.data.salesByMonth);
        }
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        if (res.data.success) setUsersList(res.data.users);
      } else if (activeTab === 'businesses') {
        const res = await api.get('/admin/businesses/pending');
        if (res.data.success) setPendingBusinesses(res.data.businesses);
      } else if (activeTab === 'products') {
        const res = await api.get('/products?limit=100');
        if (res.data.success) setProductsList(res.data.products);
      } else if (activeTab === 'categories') {
        const res = await api.get('/categories');
        if (res.data.success) setCategoriesList(res.data.categories);
      } else if (activeTab === 'reports') {
        const res = await api.get('/admin/reports');
        if (res.data.success) setReportsList(res.data.reports);
      } else if (activeTab === 'coupons') {
        const res = await api.get('/coupons');
        if (res.data.success) setCouponsList(res.data.coupons);
      }
    } catch (err) {
      console.error('Failed to load admin metadata:', err);
    }
  };

  const handleVerifyBusiness = async (id, status) => {
    try {
      const res = await api.put(`/admin/businesses/${id}/verify`, { status, notes: `Approved by admin panel.` });
      if (res.data.success) {
        setPendingBusinesses(prev => prev.filter(b => b._id !== id));
        alert(`Business verification updated to: ${status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setUsersList(prev => prev.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserRole = async (id, role) => {
    try {
      const res = await api.put(`/admin/users/${id}`, { role });
      if (res.data.success) {
        setUsersList(prev => prev.map(u => u._id === id ? res.data.user : u));
        alert('User role successfully updated!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product listing?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setProductsList(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const slug = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      const res = await api.post('/categories', { name: newCatName, slug });
      if (res.data.success) {
        setCategoriesList(prev => [...prev, res.data.category]);
        setNewCatName('');
        alert('Category successfully created!');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/coupons', {
        ...newCouponFields,
        discountValue: Number(newCouponFields.discountValue),
        minPurchaseAmount: Number(newCouponFields.minPurchaseAmount || 0),
        usageLimit: newCouponFields.usageLimit ? Number(newCouponFields.usageLimit) : null,
      });

      if (res.data.success) {
        setCouponsList(prev => [res.data.coupon, ...prev]);
        setNewCouponFields({ code: '', discountType: 'Percentage', discountValue: '', minPurchaseAmount: '', expiryDate: '', usageLimit: '' });
        alert('Coupon successfully created!');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create coupon.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await api.delete(`/admin/coupons/${id}`);
      if (res.data.success) {
        setCouponsList(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId, status, deleteTarget = false) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, {
        status,
        deleteTarget,
        notes: `Resolved by admin moderation.`
      });
      if (res.data.success) {
        setReportsList(prev => prev.map(r => r._id === reportId ? { ...r, status } : r));
        alert('Report status updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[75vh] text-left">
      {/* Navigation sidebar */}
      <div class="lg:col-span-1 glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm flex flex-col justify-between h-fit">
        <div class="space-y-2">
          {[
            { id: 'analytics', label: 'Global Analytics', icon: BarChart3 },
            { id: 'users', label: 'Users registry', icon: Users },
            { id: 'businesses', label: 'Verifications (B2B)', icon: ShieldCheck },
            { id: 'products', label: 'Products Control', icon: Layers },
            { id: 'categories', label: 'Categories Matrix', icon: Award },
            { id: 'reports', label: 'Violations Reports', icon: ShieldAlert },
            { id: 'coupons', label: 'Coupons system', icon: Gift },
            { id: 'settings', label: 'System settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                class={`w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-luxury-blue text-white shadow-md' 
                    : 'text-luxury-blue-dark/70 hover:bg-luxury-blue/5 hover:text-luxury-blue'
                }`}
              >
                <Icon class="w-4.5 h-4.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main sheets display */}
      <div class="lg:col-span-3 space-y-6">
        
        {/* TAB SHEET: GLOBAL ANALYTICS */}
        {activeTab === 'analytics' && globalStats && (
          <div class="space-y-6 text-left">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="glass-card-light p-5 rounded-2xl border border-white/60 bg-white">
                <span class="text-[9px] text-luxury-gray font-bold uppercase">System Revenue</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark mt-1">${globalStats.totalRevenue}</h4>
              </div>
              <div class="glass-card-light p-5 rounded-2xl border border-white/60 bg-white">
                <span class="text-[9px] text-luxury-gray font-bold uppercase">Registered users</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark mt-1">{globalStats.usersCount}</h4>
              </div>
              <div class="glass-card-light p-5 rounded-2xl border border-white/60 bg-white">
                <span class="text-[9px] text-luxury-gray font-bold uppercase">Products Cataloged</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark mt-1">{globalStats.productsCount}</h4>
              </div>
              <div class="glass-card-light p-5 rounded-2xl border border-white/60 bg-white">
                <span class="text-[9px] text-luxury-gray font-bold uppercase">Escrow Dispatches</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark mt-1">{globalStats.ordersCount}</h4>
              </div>
            </div>

            <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white">
              <h3 class="font-serif text-lg font-bold text-luxury-blue-dark pb-4 border-b">Sales Volume By Quarter</h3>
              <div class="space-y-3 mt-4 text-xs font-semibold">
                {monthlySales.map((item, idx) => (
                  <div key={idx} class="flex justify-between items-center py-2 border-b last:border-0 border-luxury-gray-medium/30">
                    <span class="text-luxury-gray-dark font-bold">{item.month} Sales Total</span>
                    <span class="text-luxury-blue-dark font-serif">${item.sales}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB SHEET: USERS REGISTRY */}
        {activeTab === 'users' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">System Users</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Alter roles, inspect credentials, or terminate users.</p>
            </div>

            <div class="space-y-4 mt-6">
              {usersList.map(u => (
                <div key={u._id} class="p-4 rounded-xl border border-luxury-gray-medium/35 bg-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold">
                  <div class="text-left">
                    <h4 class="font-bold text-sm text-luxury-blue-dark leading-tight">{u.name}</h4>
                    <span class="block text-[9px] text-luxury-gray font-semibold mt-0.5">{u.email}</span>
                  </div>

                  <div class="flex items-center gap-3">
                    <select
                      class="luxury-input py-1.5 px-3 text-[10px] bg-white font-bold"
                      value={u.role}
                      onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                    >
                      <option value="Customer">Customer</option>
                      <option value="Individual Seller">Individual Seller</option>
                      <option value="Business Seller">Business Seller</option>
                      <option value="Admin">Admin</option>
                    </select>

                    <button 
                      onClick={() => handleDeleteUser(u._id)}
                      class="p-2 border border-luxury-gray-medium/55 rounded-lg text-luxury-gray hover:text-red-600 hover:border-red-500 transition-colors bg-white"
                      title="Terminate user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SHEET: VERIFICATIONS (B2B) */}
        {activeTab === 'businesses' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Business Verifications</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Inspect business registration filings and issue verification badges.</p>
            </div>

            <div class="space-y-4 mt-6">
              {pendingBusinesses.length === 0 ? (
                <div class="text-center py-10 text-xs font-semibold text-luxury-gray">No business registration requests pending review.</div>
              ) : (
                pendingBusinesses.map(bus => (
                  <div key={bus._id} class="border border-luxury-gray-medium/35 rounded-xl p-5 bg-white/20 text-xs font-semibold space-y-4">
                    <div class="flex justify-between items-start border-b pb-3">
                      <div class="text-left">
                        <h4 class="text-sm font-bold text-luxury-blue-dark leading-tight">{bus.companyName}</h4>
                        <span class="block text-[9px] text-luxury-gray mt-0.5">Owner: {bus.owner?.name} ({bus.owner?.email})</span>
                      </div>
                      <div class="flex gap-2">
                        <button 
                          onClick={() => handleVerifyBusiness(bus._id, 'Rejected')}
                          class="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-wider bg-white flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                        <button 
                          onClick={() => handleVerifyBusiness(bus._id, 'Approved')}
                          class="p-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 text-[10px] font-bold uppercase tracking-wider bg-white flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div>
                        <span class="text-[9px] text-luxury-gray font-bold block uppercase">License ID</span>
                        <p class="pt-0.5 text-luxury-blue-dark font-bold">{bus.businessRegistrationNumber}</p>
                      </div>
                      <div>
                        <span class="text-[9px] text-luxury-gray font-bold block uppercase">VAT / Tax code</span>
                        <p class="pt-0.5 text-luxury-blue-dark font-bold">{bus.taxId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB SHEET: PRODUCTS CONTROL */}
        {activeTab === 'products' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Listing Moderation</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Review active marketplace product details or delete listings.</p>
            </div>

            <div class="space-y-4 mt-6">
              {productsList.map(prod => (
                <div key={prod._id} class="p-4 rounded-xl border border-luxury-gray-medium/35 bg-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold">
                  <div class="flex items-center gap-3 text-left">
                    <div class="w-10 h-10 rounded overflow-hidden bg-luxury-gray-light flex-shrink-0">
                      <img src={prod.images?.[0]} alt="thumb" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 class="font-bold text-luxury-blue-dark leading-tight line-clamp-1">{prod.name}</h4>
                      <span class="block text-[8px] text-luxury-gray font-semibold mt-0.5">Seller ID: {prod.seller} ({prod.sellerType})</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteProduct(prod._id)}
                    class="p-2 border border-luxury-gray-medium/55 rounded-lg text-luxury-gray hover:text-red-600 hover:border-red-500 transition-colors bg-white"
                    title="Moderate delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SHEET: CATEGORIES MATRIX */}
        {activeTab === 'categories' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white text-left space-y-6">
            <h3 class="font-serif text-xl font-bold text-luxury-blue-dark pb-4 border-b">Manage Categories</h3>

            <form onSubmit={handleCreateCategory} class="p-4 border rounded-xl flex gap-3 items-end bg-white/40">
              <div class="flex-grow space-y-1.5">
                <label class="text-[10px] font-bold text-luxury-gray uppercase block">Create Category Name</label>
                <input 
                  type="text" 
                  class="luxury-input py-2 text-xs bg-white" 
                  placeholder="e.g. Property"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <button type="submit" class="btn-primary py-2 px-5 text-[10px] uppercase tracking-widest bg-luxury-blue rounded-xl flex-shrink-0 font-bold">
                Add Category
              </button>
            </form>

            <div class="space-y-2 mt-4 text-xs font-semibold text-luxury-blue-dark">
              {categoriesList.map(cat => (
                <div key={cat._id} class="p-3 rounded-lg border border-luxury-gray-medium/30 bg-white/30 flex justify-between items-center">
                  <span>{cat.name}</span>
                  <span class="text-[9px] text-luxury-gray font-bold">Slug: {cat.slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SHEET: VIOLATIONS REPORTS */}
        {activeTab === 'reports' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white text-left space-y-6">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Moderation Tickets</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Review listing complaints filed by members.</p>
            </div>

            <div class="space-y-4">
              {reportsList.length === 0 ? (
                <div class="text-center py-10 text-xs font-semibold text-luxury-gray">No reports filed.</div>
              ) : (
                reportsList.map(report => (
                  <div key={report._id} class="border border-luxury-gray-medium/35 rounded-xl p-5 bg-white/20 text-xs font-semibold space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                      <div>
                        <span class="font-bold text-luxury-blue-dark">Ticket ID: {report._id}</span>
                        <span class="block text-[8px] text-luxury-gray mt-0.5">Reporter: {report.reporter?.name}</span>
                      </div>
                      <span class={`text-[9px] font-bold uppercase px-2 py-0.5 border rounded ${
                        report.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <div class="space-y-2">
                      <p class="text-xs text-luxury-blue-dark font-bold">Reason: <span class="text-red-500 font-bold">{report.reason}</span></p>
                      <p class="text-[10px] text-luxury-gray-dark leading-relaxed">"{report.description}"</p>
                    </div>

                    {report.status === 'Pending' && (
                      <div class="pt-3 border-t flex gap-2 justify-end">
                        <button 
                          onClick={() => handleResolveReport(report._id, 'Dismissed')}
                          class="px-2.5 py-1.5 border hover:bg-luxury-gray-light rounded text-[9px] font-bold uppercase text-luxury-blue bg-white"
                        >
                          Dismiss Ticket
                        </button>
                        <button 
                          onClick={() => handleResolveReport(report._id, 'Resolved', true)}
                          class="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-bold uppercase tracking-wider"
                        >
                          Delete Target Listing
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB SHEET: COUPONS SYSTEM */}
        {activeTab === 'coupons' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white text-left space-y-6">
            <h3 class="font-serif text-xl font-bold text-luxury-blue-dark pb-4 border-b">Manage Coupons</h3>

            <form onSubmit={handleCreateCoupon} class="p-5 border rounded-xl bg-white/40 space-y-4 text-xs font-semibold text-luxury-blue-dark">
              <h4 class="font-serif text-sm font-bold">Create Coupon Code</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-luxury-gray uppercase block">Coupon Code</label>
                  <input 
                    type="text" 
                    class="luxury-input py-2 text-xs bg-white uppercase font-bold" 
                    placeholder="WINTER50"
                    required
                    value={newCouponFields.code}
                    onChange={(e) => setNewCouponFields({ ...newCouponFields, code: e.target.value })}
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-luxury-gray uppercase block">Discount Type</label>
                  <select 
                    class="luxury-input py-2 text-xs bg-white font-bold"
                    value={newCouponFields.discountType}
                    onChange={(e) => setNewCouponFields({ ...newCouponFields, discountType: e.target.value })}
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="FixedAmount">Fixed Amount ($)</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-luxury-gray uppercase block">Discount Value</label>
                  <input 
                    type="number" 
                    class="luxury-input py-2 text-xs bg-white" 
                    required
                    value={newCouponFields.discountValue}
                    onChange={(e) => setNewCouponFields({ ...newCouponFields, discountValue: e.target.value })}
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-luxury-gray uppercase block">Minimum Purchase Amount ($)</label>
                  <input 
                    type="number" 
                    class="luxury-input py-2 text-xs bg-white" 
                    value={newCouponFields.minPurchaseAmount}
                    onChange={(e) => setNewCouponFields({ ...newCouponFields, minPurchaseAmount: e.target.value })}
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-luxury-gray uppercase block">Expiry Date</label>
                  <input 
                    type="date" 
                    class="luxury-input py-2 text-xs bg-white" 
                    required
                    value={newCouponFields.expiryDate}
                    onChange={(e) => setNewCouponFields({ ...newCouponFields, expiryDate: e.target.value })}
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-luxury-gray uppercase block">Usage Limit (Optional)</label>
                  <input 
                    type="number" 
                    class="luxury-input py-2 text-xs bg-white" 
                    value={newCouponFields.usageLimit}
                    onChange={(e) => setNewCouponFields({ ...newCouponFields, usageLimit: e.target.value })}
                  />
                </div>
              </div>

              <div class="pt-2 text-left">
                <button type="submit" class="btn-primary py-2.5 px-6 text-[10px] uppercase tracking-widest bg-luxury-blue rounded-xl font-bold">
                  Generate Coupon
                </button>
              </div>
            </form>

            <div class="space-y-3 mt-4 text-xs font-semibold text-luxury-blue-dark">
              {couponsList.map(c => (
                <div key={c._id} class="p-4 rounded-xl border border-luxury-gray-medium/30 bg-white/20 flex justify-between items-center">
                  <div>
                    <span class="font-bold text-luxury-blue-dark">{c.code}</span>
                    <span class="block text-[9px] text-luxury-gray font-semibold mt-0.5">
                      Expiry: {new Date(c.expiryDate).toLocaleDateString()} | Min: ${c.minPurchaseAmount || 0}
                    </span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-luxury-gold-dark font-bold font-serif">
                      {c.discountType === 'Percentage' ? `${c.discountValue}%` : `$${c.discountValue}`} Off
                    </span>
                    <button 
                      onClick={() => handleDeleteCoupon(c._id)}
                      class="p-2 border border-luxury-gray-medium/55 rounded-lg text-luxury-gray hover:text-red-600 hover:border-red-500 bg-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SHEET: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm bg-white text-left space-y-6 text-xs font-semibold text-luxury-blue-dark">
            <h3 class="font-serif text-lg font-bold text-luxury-blue-dark pb-4 border-b">Site Configuration</h3>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-luxury-gray uppercase block">Escrow Commission Rate (%)</label>
                <input type="number" class="luxury-input py-2 text-xs bg-white font-bold" defaultValue={2} />
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-luxury-gray uppercase block">Free secured shipping threshold ($)</label>
                <input type="number" class="luxury-input py-2 text-xs bg-white font-bold" defaultValue={500} />
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-luxury-gray uppercase block">Support routing Email address</label>
                <input type="email" class="luxury-input py-2 text-xs bg-white font-bold" defaultValue="safeguard@nexusone.com" />
              </div>

              <div class="pt-2">
                <button 
                  onClick={() => alert('Site configurations successfully saved!')}
                  class="btn-primary py-2.5 px-6 text-[10px] uppercase tracking-widest bg-luxury-blue rounded-xl font-bold"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
