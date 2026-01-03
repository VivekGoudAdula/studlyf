
import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';



// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
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
import LearnerDashboard from './pages/LearnerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import Blog from './pages/Blog';
import CompanyModules from './pages/CompanyModules';
import ResumeBuilder from './pages/ResumeBuilder';
import CoursePlayer from './pages/CoursePlayer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';
  const isDashboard = pathname.startsWith('/dashboard');
  const isPlayer = pathname.startsWith('/learn/course-player');
  const isCheckout = pathname === '/learn/checkout';

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#7C3AED] selection:text-white bg-white">
      {(!isLoginPage && !isDashboard && !isPlayer && !isCheckout) && <Navigation />}
      <main className="flex-grow">
        <Suspense fallback={<div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">Synchronizing Protocol...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/courses" element={<Courses />} />
            <Route path="/learn/course-player/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
            <Route path="/learn/career-fit" element={<CareerFit />} />
            <Route path="/learn/assessment" element={<Assessment />} />
            <Route path="/learn/company-modules" element={<CompanyModules />} />
            <Route path="/learn/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/learn/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            <Route path="/job-prep/job-simulation" element={<JobSimulation />} />
            <Route path="/job-prep/portfolio" element={<PortfolioBuilder />} />
            <Route path="/job-prep/projects" element={<Projects />} />
            <Route path="/job-prep/mock-interview" element={<MockInterview />} />
            <Route path="/job-prep/group-discussion" element={<GroupDiscussion />} />
            <Route path="/job-prep/play-learn-earn" element={<PlayLearnEarn />} />
            <Route path="/job-prep/resume-builder" element={<ResumeBuilder />} />

            <Route path="/employers/get-hired" element={<GetHired />} />
            <Route path="/employers/hire" element={<Hire />} />

            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />

            {/* Dashboards */}
            <Route path="/dashboard/learner" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/partner" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      {(!isLoginPage && !isDashboard && !isCheckout) && <Footer />}
    </div>
  );
};



const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <ScrollToTop />
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;

