
import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './AuthContext';
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
import AdminLayout from './pages/admin/layout/AdminLayout';
import AdminDashboardOverview from './pages/admin/dashboard/Overview';
import AdminStudentManagement from './pages/admin/students/StudentManagement';
import AdminCourseManagement from './pages/admin/courses/CourseManagement';
import AdminAssessmentManagement from './pages/admin/assessments/AssessmentManagement';
import AdminHiringPipeline from './pages/admin/hiring/HiringPipeline';
import AdminAnalytics from './pages/admin/analytics/Analytics';
import AdminMockInterviews from './pages/admin/interviews/MockInterviews';
import AdminProtectedRoute from './AdminProtectedRoute';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  const isLoginPage = pathname === '/login' || pathname === '/signup';
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');
  const isPlayer = pathname.startsWith('/learn/course-player');
  const isCheckout = pathname === '/learn/checkout';
  const isHome = pathname === '/';
  const isFeaturePreview = pathname.startsWith('/feature-preview');
  const isOnboarding = pathname === '/learn/career-onboarding';

  // GLOBAL ADMIN SENTINEL
  // If you are the admin, you should NOT be anywhere else but /admin
  useEffect(() => {
    if (!loading && user?.email?.toLowerCase() === 'admin@studlyf.com') {
      if (!pathname.startsWith('/admin')) {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, pathname, loading, navigate]);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#7C3AED] selection:text-white ${isDashboard || isAdmin ? 'bg-transparent' : 'bg-white'}`}>
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
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardOverview />} />
              <Route path="students" element={<AdminStudentManagement />} />
              <Route path="courses" element={<AdminCourseManagement />} />
              <Route path="assessments" element={<AdminAssessmentManagement />} />
              <Route path="mock-interviews" element={<AdminMockInterviews />} />
              <Route path="hiring" element={<AdminHiringPipeline />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="mentors" element={<div className="p-8"><h1>Mentor Management Coming Soon</h1></div>} />
              <Route path="companies" element={<div className="p-8"><h1>Company Management Coming Soon</h1></div>} />
              <Route path="payments" element={<div className="p-8"><h1>Payment Management Coming Soon</h1></div>} />
              <Route path="content" element={<div className="p-8"><h1>CMS Management Coming Soon</h1></div>} />
              <Route path="settings" element={<div className="p-8"><h1>System Settings Coming Soon</h1></div>} />
              <Route path="audit-logs" element={<div className="p-8"><h1>Audit Logs Coming Soon</h1></div>} />
            </Route>

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
