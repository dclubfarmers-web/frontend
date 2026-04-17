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
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-500">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800">{currentPathName}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{user?.name || 'Admin'}</span>
              <span className="text-xs text-slate-500">{user?.email || 'admin@djairindia.com'}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0369A1] font-bold">
               {(user?.name || 'AD').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
