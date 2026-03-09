// Studlyf Engineering Protocol - Core Routing Engine
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
import AssessmentIntro from './pages/AssessmentIntro';
import JobSimulation from './pages/JobSimulation';
import PortfolioBuilder from './pages/PortfolioBuilder';
import Projects from './pages/Projects';
import SystemDeconstructionLab from './pages/SystemDeconstructionLab';
import SDLProjectCreate from './pages/SDLProjectCreate';
import SDLProjectDetail from './pages/SDLProjectDetail';
import MockInterview from './pages/MockInterview';
import GroupDiscussion from './pages/GroupDiscussion';
import PlayLearnEarn from './pages/PlayLearnEarn';
import GoalSelector from './pages/GoalSelector';
import About from './pages/About';
import UnifiedAuth from './pages/UnifiedAuth';
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
import CoursesOverview from './pages/CoursesOverview';
import TrackDetail from './pages/TrackDetail';
import EnrollmentFlow from './pages/EnrollmentFlow';

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
import AdminAnalytics from './pages/admin/analytics/Analytics';
import AdminMockInterviews from './pages/admin/interviews/MockInterviews';
import AdminSDLManagement from './pages/admin/sdl/SDLManagement';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdsManagement from './pages/admin/ads/AdsManagement';

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
  const { user, loading } = useAuth();

  const isLoginPage = pathname === '/login' || pathname === '/signup';
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');
  const isPlayer = pathname.startsWith('/learn/course-player');
  const isCheckout = pathname === '/learn/checkout';
  const isHome = pathname === '/';
  const isFeaturePreview = pathname.startsWith('/feature-preview');
  const isOnboarding = pathname === '/learn/career-onboarding';

  // Admin Redirect Logic
  useEffect(() => {
    if (!loading && user?.email?.toLowerCase() === 'admin@studlyf.com') {
      if (!pathname.startsWith('/admin')) {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, pathname, loading, navigate]);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#7C3AED] selection:text-white ${isDashboard || isAdmin ? 'bg-transparent' : 'bg-white'}`}>

      {(!isLoginPage && !isPlayer && !isCheckout && !isAdmin && !isHome) && <Navigation />}

      <main className="flex-grow">
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">
            Synchronizing Protocol...
          </div>
        }>
          <Routes>

            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />

            <Route path="/learn/courses-overview" element={<ProtectedRoute><CoursesOverview /></ProtectedRoute>} />
            <Route path="/learn/track/:trackId" element={<ProtectedRoute><TrackDetail /></ProtectedRoute>} />
            <Route path="/learn/enroll/:trackId" element={<ProtectedRoute><EnrollmentFlow /></ProtectedRoute>} />
            <Route path="/learn/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/learn/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/learn/course-player/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
            <Route path="/learn/career-fit" element={<ProtectedRoute><CareerFit /></ProtectedRoute>} />
            <Route path="/learn/assessment-intro" element={<ProtectedRoute><AssessmentIntro /></ProtectedRoute>} />
            <Route path="/learn/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/learn/company-modules" element={<ProtectedRoute><CompanyModules /></ProtectedRoute>} />
            <Route path="/learn/visualizer/stack" element={<ProtectedRoute><StackPage /></ProtectedRoute>} />
            <Route path="/learn/visualizer/queue" element={<ProtectedRoute><QueuePage /></ProtectedRoute>} />
            <Route path="/learn/visualizer/linked-list" element={<ProtectedRoute><LinkedListPage /></ProtectedRoute>} />
            <Route path="/learn/visualizer/bst" element={<ProtectedRoute><BSTPage /></ProtectedRoute>} />
            <Route path="/learn/visualizer/hash-table" element={<ProtectedRoute><HashTablePage /></ProtectedRoute>} />
            <Route path="/stack" element={<ProtectedRoute><StackPage /></ProtectedRoute>} />
            <Route path="/queue" element={<ProtectedRoute><QueuePage /></ProtectedRoute>} />
            <Route path="/linked-list" element={<ProtectedRoute><LinkedListPage /></ProtectedRoute>} />
            <Route path="/bst" element={<ProtectedRoute><BSTPage /></ProtectedRoute>} />
            <Route path="/hash-table" element={<ProtectedRoute><HashTablePage /></ProtectedRoute>} />
            <Route path="/learn/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/learn/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            <Route path="/job-prep/job-simulation" element={<ProtectedRoute><JobSimulation /></ProtectedRoute>} />
            <Route path="/job-prep/portfolio" element={<ProtectedRoute><PortfolioBuilder /></ProtectedRoute>} />
            <Route path="/job-prep/projects" element={<ProtectedRoute><SystemDeconstructionLab /></ProtectedRoute>} />
            <Route path="/job-prep/projects/create" element={<ProtectedRoute><SDLProjectCreate /></ProtectedRoute>} />
            <Route path="/job-prep/projects/:projectId" element={<ProtectedRoute><SDLProjectDetail /></ProtectedRoute>} />
            <Route path="/job-prep/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/job-prep/group-discussion" element={<ProtectedRoute><GroupDiscussion /></ProtectedRoute>} />
            <Route path="/job-prep/play-learn-earn" element={<ProtectedRoute><PlayLearnEarn /></ProtectedRoute>} />
            <Route path="/job-prep/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />

            <Route path="/goal-selector" element={<ProtectedRoute><GoalSelector /></ProtectedRoute>} />


            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/feature-preview/:id" element={<PublicRoute><FeaturePreview /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><UnifiedAuth /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><UnifiedAuth /></PublicRoute>} />
            <Route path="/ai-tools" element={<AITools />} />

            <Route path="/dashboard" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/learner" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            <Route path="/dashboard/partner" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            <Route path="/learn/career-onboarding" element={<ProtectedRoute><CareerOnboarding /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardOverview />} />
              <Route path="students" element={<AdminStudentManagement />} />
              <Route path="courses" element={<AdminCourseManagement />} />
              <Route path="assessments" element={<AdminAssessmentManagement />} />
              <Route path="mock-interviews" element={<AdminMockInterviews />} />
              <Route path="sdl-projects" element={<AdminSDLManagement />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="mentors" element={<div className="p-8"><h1>Mentor Management Coming Soon</h1></div>} />
              <Route path="companies" element={<div className="p-8"><h1>Company Management Coming Soon</h1></div>} />
              <Route path="payments" element={<div className="p-8"><h1>Payment Management Coming Soon</h1></div>} />
              <Route path="content" element={<AdsManagement />} />
              <Route path="ads" element={<AdsManagement />} />
              <Route path="settings" element={<div className="p-8"><h1>System Settings Coming Soon</h1></div>} />
              <Route path="audit-logs" element={<div className="p-8"><h1>Audit Logs Coming Soon</h1></div>} />
            </Route>

          </Routes>
        </Suspense>
      </main>

      {isHome && (
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ScrollToTop />
        <App />
      </AuthProvider>
    </Router>
  </HeroUIProvider>
);

export default AppWrapper;