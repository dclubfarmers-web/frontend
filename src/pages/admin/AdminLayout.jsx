import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Target, 
  LogOut, 
  Mail, 
  Shield, 
  Settings,
  X,
  Menu,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: <Briefcase size={20} /> },
    { name: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
    { name: 'DPR Requests', path: '/admin/dprs', icon: <Target size={20} /> },
    { name: 'Inbox', path: '/admin/inbox', icon: <Mail size={20} /> },
    { name: 'Manage Blogs', path: '/admin/blogs', icon: <FileText size={20} /> },
    { name: 'About Page', path: '/admin/about', icon: <Rocket size={20} /> },
    { name: 'Admin Users', path: '/admin/users', icon: <Shield size={20} /> },
    { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const currentPathName = navItems.find(n => n.path === location.pathname)?.name || 'Admin Panel';

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans overflow-hidden">
      
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[60] shadow-2xl transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-50">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                location.pathname === item.path
                  ? 'bg-[#1A3D24] text-white shadow-lg shadow-green-900/20'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className={`mr-3 ${location.pathname === item.path ? 'text-white' : 'text-slate-400'}`}>{item.icon}</span>
              <span>{item.name}</span>
              {location.pathname === item.path && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                location.pathname === item.path
                  ? 'bg-green-50 text-[#1A3D24]'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className={`mr-3 ${location.pathname === item.path ? 'text-[#1A3D24]' : 'text-slate-400'}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
            </button>
            <h2 className="text-base lg:text-lg font-bold text-slate-800 truncate">{currentPathName}</h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">{user?.name || 'Admin'}</span>
              <span className="text-[10px] lg:text-xs text-slate-500 truncate max-w-[150px]">{user?.email || 'admin@djairindia.com'}</span>
            </div>
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0369A1] font-bold text-sm">
               {(user?.name || 'AD').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
