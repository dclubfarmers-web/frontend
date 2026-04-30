import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
const Home = React.lazy(() => import('./pages/Home'));
const Career = React.lazy(() => import('./pages/Career'));
const JobDetails = React.lazy(() => import('./pages/JobDetails'));
const About = React.lazy(() => import('./pages/About'));
const Investors = React.lazy(() => import('./pages/Investors'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const Maintenance = React.lazy(() => import('./pages/Maintenance'));

// Admin Pages
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ManageJobs = React.lazy(() => import('./pages/admin/ManageJobs'));
const ManageApplications = React.lazy(() => import('./pages/admin/ManageApplications'));
const ViewApplication = React.lazy(() => import('./pages/admin/ViewApplication'));
const ManageDPRs = React.lazy(() => import('./pages/admin/ManageDPRs'));
const ViewDPR = React.lazy(() => import('./pages/admin/ViewDPR'));
const ManageInbox = React.lazy(() => import('./pages/admin/ManageInbox'));
const ManageBlogs = React.lazy(() => import('./pages/admin/ManageBlogs'));
const ManageAdmins = React.lazy(() => import('./pages/admin/ManageAdmins'));
const SiteSettings = React.lazy(() => import('./pages/admin/SiteSettings'));
const AdminSetup = React.lazy(() => import('./pages/AdminSetup'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const ManageAbout = React.lazy(() => import('./pages/admin/ManageAbout'));
const AcceptInvitation = React.lazy(() => import('./pages/AcceptInvitation'));

import { useSettings } from './context/SettingsContext';
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
    <React.Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAF8' }}>
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      </div>
    }>
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
              <Route path="applications/:id" element={<ViewApplication />} />
              <Route path="dprs" element={<ManageDPRs />} />
              <Route path="dprs/view/:id" element={<ViewDPR />} />
              <Route path="inbox" element={<ManageInbox />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="users" element={<ManageAdmins />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="about" element={<ManageAbout />} />
            </Route>
          </Route>

        </Routes>
      </AnimatePresence>
    </React.Suspense>
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
