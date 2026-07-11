import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Lock, CheckCircle, AlertCircle, Shield, Image, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
const WALLPAPERS = [
  { id: 1, name: 'Windows 11 Bloom',   url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { id: 2, name: 'MacOS Monterey',     url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=2574&auto=format&fit=crop' },
  { id: 3, name: 'Abstract Dark',      url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2560&auto=format&fit=crop' },
  { id: 4, name: 'Minimal Landscape',  url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqrmOoFjpdglnj7J5GykueFDurhTjtwjhMka-sLWoVQ&s=10' },
  { id: 5, name: 'Neon City',          url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2560&auto=format&fit=crop' },
  { id: 6, name: 'Abstract Fluid',     url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2560&auto=format&fit=crop' },
];

const NAV_ITEMS = [
  { id: 'personalization', label: 'Personalization', icon: Image },
  { id: 'admin',           label: 'Admin Access',    icon: Shield },
];


const PersonalizationTab = () => {
  const { wallpaper, setWallpaper } = useStore();
  const [justSaved, setJustSaved] = useState(false);

  const handleSelect = (url) => {
    setWallpaper(url);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Background</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Choose a wallpaper. Your selection is saved automatically.
          </p>
        </div>
        {justSaved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium animate-pulse">
            <CheckCircle size={13} />
            Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {WALLPAPERS.map((wp) => {
          const isActive = wallpaper === wp.url;
          return (
            <div
              key={wp.id}
              onClick={() => handleSelect(wp.url)}
              className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                ${isActive
                  ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#202020] shadow-lg shadow-blue-500/20'
                  : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
                }`}
            >
              <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />

              {/* Active badge */}
              {isActive && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5 shadow">
                  <CheckCircle size={13} />
                </div>
              )}

              {/* Hover label */}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md px-3 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <p className="text-xs font-medium text-white text-center">{wp.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const AdminTab = () => {
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [status, setStatus]       = useState(null); 
  const [errMsg, setErrMsg]       = useState('');
 const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');

    try {
      const data = await loginAdmin(password);
      localStorage.setItem('adminToken', data.token);
      setStatus('success');
      navigate('/admin/dashboard');
      setPassword('');
    } catch (error) {
      setStatus('error');
      setErrMsg(error.response?.data?.message || 'Error logging in');
    }
  };

  

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Admin Access</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Sign in to access the portfolio admin dashboard.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] p-5 max-w-sm">
        {/* Lock icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Lock size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Administrator</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter your admin password</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Password field */}
          <div className="relative">
            <input
              id="settings-admin-password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={12} />
              {errMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {status === 'loading' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Lock size={13} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};


const SettingsApp = () => {
  const [activeTab, setActiveTab] = useState('personalization');

  return (
    <div className="h-full flex bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-white">

      {/* Sidebar */}
      <div className="w-44 sm:w-56 border-r border-gray-200 dark:border-gray-700/60 p-3 shrink-0 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 pt-1 pb-2">Settings</p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-white/5'
                }`}
            >
              <Icon size={15} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-7 overflow-y-auto custom-scrollbar">
        {activeTab === 'personalization' && <PersonalizationTab />}
        {activeTab === 'admin'           && <AdminTab />}
      </div>
    </div>
  );
};

export default SettingsApp;



