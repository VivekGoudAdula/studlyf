
import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { HeroUIProvider } from "@heroui/react";


// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CareerFit from './pages/CareerFit';
import Assessment from './pages/Assessment';
import JobSimulation from './pages/JobSimulation';
import PortfolioBuilder from './pages/PortfolioBuilder';
import Projects from './pages/Projects';
import MockInterview from './pages/MockInterview';
import GroupDiscussion from './pages/GroupDiscussion';
import PlayLearnEarn from './pages/PlayLearnEarn';
import GetHired from './pages/GetHired';
import Hire from './pages/Hire';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LearnerDashboard from './pages/LearnerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import DashboardHome from './pages/DashboardHome';
import Blog from './pages/Blog';
import CompanyModules from './pages/CompanyModules';
import ResumeBuilder from './pages/ResumeBuilder';
import CoursePlayer from './pages/CoursePlayer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';
import FeaturePreview from './pages/FeaturePreview';
import CareerOnboarding from './pages/CareerOnboarding';

// Unique Components
import EnquiryForm from './components/EnquiryForm';
import ResourceCenter from './components/ResourceCenter';
import Testimonials from './components/Testimonials';
import Impact from './components/Impact';
import Achievements from './components/Achievements';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import StudentManagement from './pages/admin/StudentManagement';
import CourseManagement from './pages/admin/CourseManagement';
import AssessmentManagement from './pages/admin/AssessmentManagement';
import HiringPipeline from './pages/admin/HiringPipeline';
import AnalyticsPage from './pages/admin/Analytics';
import AuditLogs from './pages/admin/AuditLogs';
import AdminSettings from './pages/admin/Settings';
import ContentManagement from './pages/admin/ContentManagement';
import MentorManagement from './pages/admin/MentorManagement';
import MockInterviewManagement from './pages/admin/MockInterviewManagement';
import CompanyManagement from './pages/admin/CompanyManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import ResumeManagement from './pages/admin/ResumeManagement';
import AdminRoute from './AdminRoute';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login' || pathname === '/signup';
  const isAdmin = pathname.startsWith('/admin');
  const isDashboard = pathname.startsWith('/dashboard') || isAdmin;
  const isPlayer = pathname.startsWith('/learn/course-player');
  const isCheckout = pathname === '/learn/checkout';
  const isHome = pathname === '/';
  const isFeaturePreview = pathname.startsWith('/feature-preview');
  const isOnboarding = pathname === '/learn/career-onboarding';

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#7C3AED] selection:text-white ${isDashboard ? 'bg-transparent' : 'bg-white'}`}>
      {(!isLoginPage && !isPlayer && !isCheckout && !isHome && !isFeaturePreview && !isOnboarding && !isAdmin) && <Navigation />}
      <main className="flex-grow">
        <Suspense fallback={<div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">Synchronizing Protocol...</div>}>
          <Routes>
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/learn/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/learn/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/learn/course-player/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
            <Route path="/learn/career-fit" element={<ProtectedRoute><CareerFit /></ProtectedRoute>} />
            <Route path="/learn/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/learn/company-modules" element={<ProtectedRoute><CompanyModules /></ProtectedRoute>} />
            <Route path="/learn/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/learn/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            <Route path="/job-prep/job-simulation" element={<ProtectedRoute><JobSimulation /></ProtectedRoute>} />
            <Route path="/job-prep/portfolio" element={<ProtectedRoute><PortfolioBuilder /></ProtectedRoute>} />
            <Route path="/job-prep/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/job-prep/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/job-prep/group-discussion" element={<ProtectedRoute><GroupDiscussion /></ProtectedRoute>} />
            <Route path="/job-prep/play-learn-earn" element={<ProtectedRoute><PlayLearnEarn /></ProtectedRoute>} />
            <Route path="/job-prep/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />

            <Route path="/employers/get-hired" element={<GetHired />} />
            <Route path="/employers/hire" element={<Hire />} />

            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/feature-preview/:id" element={<PublicRoute><FeaturePreview /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Dashboards */}
            <Route path="/dashboard" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/learner" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            <Route path="/dashboard/partner" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            <Route path="/learn/career-onboarding" element={<ProtectedRoute><CareerOnboarding /></ProtectedRoute>} />

            {/* Admin System */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminOverview /></AdminRoute>} />
            <Route path="/admin/students" element={<AdminRoute><StudentManagement /></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><CourseManagement /></AdminRoute>} />
            <Route path="/admin/assessments" element={<AdminRoute><AssessmentManagement /></AdminRoute>} />
            <Route path="/admin/hiring-pipeline" element={<AdminRoute><HiringPipeline /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
            <Route path="/admin/audit-logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/content" element={<AdminRoute><ContentManagement /></AdminRoute>} />
            <Route path="/admin/mentors" element={<AdminRoute><MentorManagement /></AdminRoute>} />
            <Route path="/admin/mock-interviews" element={<AdminRoute><MockInterviewManagement /></AdminRoute>} />
            <Route path="/admin/companies" element={<AdminRoute><CompanyManagement /></AdminRoute>} />
            <Route path="/admin/payments" element={<AdminRoute><PaymentManagement /></AdminRoute>} />
            <Route path="/admin/resumes" element={<AdminRoute><ResumeManagement /></AdminRoute>} />

          </Routes>

        </Suspense>
      </main>
      {(!isLoginPage && !isDashboard && !isCheckout && !isOnboarding && !isAdmin) && (
        <>
          <Impact />
          <Testimonials />
          <ResourceCenter />
          <EnquiryForm />
          <Footer />
        </>
      )}
    </div>
  );
};




const AppWrapper = () => (
  <HeroUIProvider>
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <App />
      </AuthProvider>
    </Router>
  </HeroUIProvider>
);

export default AppWrapper;
