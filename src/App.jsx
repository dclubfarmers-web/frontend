import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Career from './pages/Career';
import JobDetails from './pages/JobDetails';
import About from './pages/About';
import Investors from './pages/Investors';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Todos from './pages/Todos';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Maintenance from './pages/Maintenance';
import { useSettings } from './context/SettingsContext';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageJobs from './pages/admin/ManageJobs';
import ManageApplications from './pages/admin/ManageApplications';
import ManageDPRs from './pages/admin/ManageDPRs';
import ManageInbox from './pages/admin/ManageInbox';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageAdmins from './pages/admin/ManageAdmins';
import SiteSettings from './pages/admin/SiteSettings';
import AdminSetup from './pages/AdminSetup';
import AdminLogin from './pages/admin/AdminLogin';
import ManageAbout from './pages/admin/ManageAbout';
import AcceptInvitation from './pages/AcceptInvitation';
import { ProtectedRoute } from './components/ProtectedRoute';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const MaintenanceGuard = ({ children }) => {
  const { settings, loading } = useSettings();
  const location = useLocation();
  
  if (loading) return null;
  
  const maintenance = settings?.maintenance;
  
  if (maintenance?.enabled) {
    // Basic paths that are always allowed
    if (location.pathname.startsWith('/admin') || location.pathname === '/maintenance') {
      return children;
    }
    
    // Check if entire site is locked or specific page
    const isLocked = !maintenance.pages || maintenance.pages.length === 0 || maintenance.pages.includes(location.pathname);
    
    if (isLocked) {
      return <Navigate to="/maintenance" replace />;
    }
  }
  
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* MAINTENANCE PAGE */}
        <Route path="/maintenance" element={<Maintenance />} />

        {/* PUBLIC SITE WITH HEADER/FOOTER */}
        <Route element={
          <MaintenanceGuard>
            <ScrollToTop />
            <Layout />
          </MaintenanceGuard>
        }>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/career" element={<PageWrapper><Career /></PageWrapper>} />
            <Route path="/career/:id" element={<PageWrapper><JobDetails /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/investors" element={<PageWrapper><Investors /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
            <Route path="/terms-of-service" element={<PageWrapper><TermsOfService /></PageWrapper>} />
            <Route path="/todos" element={<PageWrapper><Todos /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
            
            {/* Compatibility Redirects */}
            <Route path="/setup" element={<Navigate to="/admin/setup" replace />} />
            <Route path="/accept-invite" element={<Navigate to="/admin/accept-invite" replace />} />
        </Route>

        {/* ADMIN AREA WITHOUT PUBLIC HEADER/FOOTER */}
        <Route path="/admin">
           <Route path="login" element={<AdminLogin />} />
           <Route path="setup" element={<AdminSetup />} />
           <Route path="accept-invite" element={<AcceptInvitation />} />

           <Route element={
             <ProtectedRoute adminOnly>
               <AdminLayout />
             </ProtectedRoute>
           }>
             <Route index element={<Dashboard />} />
             <Route path="jobs" element={<ManageJobs />} />
             <Route path="applications" element={<ManageApplications />} />
             <Route path="dprs" element={<ManageDPRs />} />
             <Route path="inbox" element={<ManageInbox />} />
             <Route path="blogs" element={<ManageBlogs />} />
             <Route path="users" element={<ManageAdmins />} />
             <Route path="settings" element={<SiteSettings />} />
             <Route path="about" element={<ManageAbout />} />
           </Route>
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
