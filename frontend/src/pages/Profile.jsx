import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setCredentials } from '../store/slices/authSlice';

export default function Profile() {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put('/api/auth/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      dispatch(setCredentials({ user: data.user, token }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <FiUser className="text-slate-900" size={28} />
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {form.avatar ? (
                <img src={form.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-sm" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm">
                  <FiUser size={48} className="text-slate-400" />
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-success'} mb-4`}>
              {user?.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    className="input-field !pl-10" 
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={user?.email} 
                    disabled 
                    className="input-field !pl-10 bg-slate-50 text-slate-500 cursor-not-allowed" 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Email address cannot be changed.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value})} 
                    className="input-field !pl-10" 
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Avatar URL</label>
                <div className="relative">
                  <FiCamera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="url" 
                    value={form.avatar} 
                    onChange={(e) => setForm({...form, avatar: e.target.value})} 
                    className="input-field !pl-10" 
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Addresses (Static UI for now) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Saved Addresses</h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">+ Add New</button>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-start gap-3">
              <FiMapPin className="text-slate-400 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Default Address</p>
                <p className="text-slate-500 text-sm mt-1">
                  123 Commerce Street, Tech Park<br />
                  Bangalore, Karnataka 560001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
