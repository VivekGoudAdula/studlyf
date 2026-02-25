
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { ShoppingCart } from 'lucide-react';



const StudlyfLogo = ({ className = "h-6 sm:h-8" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <span className="font-syne font-black text-white italic tracking-tighter text-lg sm:text-2xl">STUDLYF</span>
  </div>
);

interface BentoCardProps {
  title: string;
  desc: string;
  children?: React.ReactNode;
  className?: string;
  to?: string;
}

const BentoCard = ({ title, desc, children, className = "", to = "#" }: BentoCardProps) => (
  <Link to={to} className={`bg-white/80 backdrop-blur-sm rounded-[1.5rem] p-5 relative overflow-hidden group border border-transparent hover:border-[#7C3AED]/20 hover:shadow-xl transition-all ${className}`}>
    <div className="relative z-10">
      <h3 className="text-base font-bold text-[#111827] mb-1.5 tracking-tight group-hover:text-[#7C3AED] transition-colors">{title}</h3>
      <p className="text-[11px] text-[#6B7280] leading-relaxed max-w-[180px] mb-3">{desc}</p>
    </div>
    {children}
  </Link>
);

const LearnDropdown = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
    <BentoCard to="/learn/courses" title="Courses" desc="Role-focused tracks for elite engineering readiness." className="md:col-span-2 md:row-span-2 min-h-[160px] md:min-h-[180px]">
      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" className="absolute bottom-0 right-0 w-1/2 h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Courses" />
    </BentoCard>
    <BentoCard to="/learn/company-modules" title="Company Learning Modules" desc="Institutional training for corporate internal teams." className="md:col-span-2 h-[88px]">
      <img src="https://images.unsplash.com/photo-1454165833762-02193567a5d7?auto=format&fit=crop&q=80&w=400" className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full object-cover opacity-20 group-hover:opacity-100 transition-all" alt="Corporate" />
    </BentoCard>
    <BentoCard to="/blog" title="Blog" desc="Technical insights on system ownership." className="md:col-span-2 h-[88px]">
      <div className="absolute bottom-3 right-4 flex gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-[1px] bg-[#7C3AED]"></div>
        <div className="w-5 h-[1px] bg-[#7C3AED]"></div>
      </div>
    </BentoCard>
  </div>
);

const JobPrepDropdown = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
    <BentoCard to="/job-prep/portfolio" title="Build Portfolio" desc="Showcase evidence." className="md:col-span-1 md:row-span-2 min-h-[160px] md:min-h-[180px]">
      <div className="mt-1 bg-[#0F172A] rounded-lg p-3 shadow-xl border border-white/10 group-hover:scale-[1.02] transition-transform h-full">
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-1 h-1 rounded-full bg-red-400"></div>
          <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
          <div className="w-1 h-1 rounded-full bg-green-400"></div>
        </div>
        <div className="space-y-1.5"><div className="h-2 w-2/3 bg-white/10 rounded"></div><div className="h-8 w-full bg-gradient-to-tr from-[#7C3AED]/30 to-transparent rounded border border-white/5"></div></div>
      </div>
    </BentoCard>
    <BentoCard to="/job-prep/resume-builder" title="Resume Builder" desc="Create instant resumes." className="md:col-span-1 md:row-span-2 min-h-[160px] md:min-h-[180px]">
      <div className="mt-2 mx-auto w-3/4 h-full bg-white border border-gray-200 rounded-t-lg shadow-sm group-hover:shadow-md transition-all group-hover:scale-[1.02] group-hover:-translate-y-1 relative overflow-hidden p-2">
        {/* Header */}
        <div className="flex gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0"></div>
          <div className="space-y-1 w-full">
            <div className="h-1.5 w-2/3 bg-gray-800 rounded-full"></div>
            <div className="h-1 w-1/2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        {/* Body Lines */}
        <div className="space-y-1.5">
          <div className="h-0.5 w-full bg-gray-200"></div>
          <div className="flex gap-1">
            <div className="h-1 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-1 w-2/3 bg-gray-100 rounded"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-1 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
          </div>
          <div className="h-0.5 w-full bg-gray-200 mt-1"></div>
          <div className="space-y-1 mt-1">
            <div className="h-1 w-full bg-gray-100 rounded"></div>
            <div className="h-1 w-5/6 bg-gray-100 rounded"></div>
            <div className="h-1 w-4/6 bg-gray-100 rounded"></div>
          </div>
        </div>

        {/* Decor */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500/10 rounded-tl-xl flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </div>
    </BentoCard>
    <BentoCard to="/learn/assessment" title="Skill Assessment" desc="Find your strengths with clinical scoring." className="md:col-span-2 h-[88px]">
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" className="absolute bottom-0 right-0 w-1/4 h-full object-cover opacity-10 group-hover:opacity-60 transition-all" alt="Assessment" />
    </BentoCard>
    <BentoCard to="/job-prep/mock-interview" title="Mock tests & interviews" desc="Practice clinical logic defense." className="h-[88px]">
      <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=200" className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover rounded-tl-xl opacity-30 group-hover:opacity-100 transition-all" alt="Mock" />
    </BentoCard>
    <BentoCard to="/job-prep/projects" title="Build projects" desc="Deconstruct tech giant systems." className="h-[88px]">
      <div className="flex gap-1.5 mt-0.5 opacity-40 group-hover:opacity-100 transition-all">
        <div className="h-6 w-6 bg-white rounded flex items-center justify-center p-0.5 border border-gray-100"><img src="https://www.vectorlogo.zone/logos/swiggy/swiggy-icon.svg" className="h-3" alt="Swiggy" /></div>
        <div className="h-6 w-6 bg-black rounded flex items-center justify-center p-0.5"><img src="https://www.vectorlogo.zone/logos/uber/uber-icon.svg" className="h-3 invert" alt="Uber" /></div>
      </div>
    </BentoCard>
  </div>
);

const JobsDropdown = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
    <BentoCard to="/employers/get-hired" title="Get Hired" desc="Connect with partners looking for verified talent." className="md:col-span-2 h-[120px]">
      <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=600" className="absolute bottom-0 right-0 w-1/3 h-full object-cover grayscale opacity-20 group-hover:opacity-100 transition-all" alt="Get Hired" />
    </BentoCard>
    <BentoCard to="/employers/hire" title="Hire Talent" desc="Access verified engineering professionals." className="md:col-span-2 h-[120px]">
      <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600" className="absolute bottom-0 right-0 w-1/3 h-full object-cover grayscale opacity-20 group-hover:opacity-100 transition-all" alt="Hire" />
    </BentoCard>
  </div>
);

const FeaturesDropdown = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
    <div className="space-y-4">
      <h4 className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.3em]">Learning Authority</h4>
      <div className="grid gap-2">
        <BentoCard to="/learn/courses" title="Hero Tracks" desc="Role-focused engineering specialization." className="h-[110px]" />
        <BentoCard to="/learn/company-modules" title="Corporate Training" desc="Institutional internal modules." className="h-[110px]" />
      </div>
    </div>
    <div className="space-y-4">
      <h4 className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.3em]">Placement Protocol</h4>
      <div className="grid gap-2">
        <BentoCard to="/job-prep/portfolio" title="Proof of Skill" desc="Evidence-based developer portfolios." className="h-[110px]" />
        <BentoCard to="/job-prep/resume-builder" title="Clinical Resumes" desc="Instant verification-ready resumes." className="h-[110px]" />
        <BentoCard to="/learn/assessment" title="Calculated Scoring" desc="Clinical skill assessment." className="h-[110px]" />
      </div>
    </div>
    <div className="space-y-4">
      <h4 className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.3em]">Marketplace</h4>
      <div className="grid gap-2">
        <BentoCard to="/employers/get-hired" title="Elite Intake" desc="Direct pipeline to industry partners." className="h-[110px]" />
        <BentoCard to="/employers/hire" title="Verified Supply" desc="Access clinically vetted talent." className="h-[110px]" />
        <BentoCard to="/blog" title="Engineering Blog" desc="Technical insights on systems." className="h-[110px]" />
      </div>
    </div>
  </div>
);

const Navigation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/learn') || pathname.startsWith('/job-prep');

  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (window.innerWidth < 1024) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    timeoutRef.current = window.setTimeout(() => setActiveMenu(null), 200);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <nav className="fixed top-0 z-[100] w-full px-2 py-4 sm:px-6 sm:py-6 lg:px-12">
        <div className="max-w-7xl mx-auto relative" onMouseLeave={handleMouseLeave}>
          {/* Main Purple Nav Bar */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-[110] h-14 sm:h-20 bg-[#7C3AED] rounded-[1.25rem] sm:rounded-[2rem] px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-2xl shadow-[#7C3AED]/40 border border-[#7C3AED]/50"
          >
            <div className="flex items-center lg:w-[250px] gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>

              <Link to="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95">
                <StudlyfLogo />
              </Link>
            </div>

            {/* Desktop Center Links */}
            <div className="flex-grow flex justify-center h-full">
              <div className="hidden lg:flex items-center space-x-12 h-full">
                {isDashboard ? (
                  // Full Dashboard Navbar
                  <>
                    {['learn', 'jobprep', 'jobs'].map((id) => (
                      <button
                        key={id}
                        onMouseEnter={() => handleMouseEnter(id)}
                        className={`flex items-center space-x-2 transition-all h-full uppercase tracking-[0.25em] font-bold text-[11px] ${activeMenu === id ? 'text-white' : 'text-white/80'} hover:text-white`}
                      >
                        <span>{id === 'jobprep' ? 'Job Prep' : id.charAt(0).toUpperCase() + id.slice(1)}</span>
                        <motion.svg animate={{ rotate: activeMenu === id ? 180 : 0 }} className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></motion.svg>
                      </button>
                    ))}
                  </>
                ) : (
                  // Simplified Landing Navbar
                  <>
                    <Link to="/about" className="text-white/80 text-[11px] font-bold uppercase tracking-[0.25em] hover:text-white h-full flex items-center">About</Link>
                    <button
                      onMouseEnter={() => handleMouseEnter('features')}
                      className={`flex items-center space-x-2 transition-all h-full uppercase tracking-[0.25em] font-bold text-[11px] ${activeMenu === 'features' ? 'text-white' : 'text-white/80'} hover:text-white`}
                    >
                      <span>Features</span>
                      <motion.svg animate={{ rotate: activeMenu === 'features' ? 180 : 0 }} className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></motion.svg>
                    </button>
                    {user && (
                      <Link to="/dashboard/learner" className="text-white/90 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white h-full flex items-center bg-white/10 px-6 rounded-xl border border-white/10 ml-4">
                        My Console
                      </Link>

                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center lg:w-[250px] justify-end shrink-0 gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Cart Icon */}
                  <Link
                    to="/learn/cart"
                    className="relative p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="View Cart"
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </Link>

                  <Link
                    to="/dashboard"
                    className="hidden sm:flex flex-col items-end mr-1 group/profile hover:opacity-80 transition-opacity"
                  >

                    <span className="text-[8px] text-white font-black uppercase tracking-widest leading-none mb-0.5 group-hover/profile:text-[#A78BFA] transition-colors">{user.displayName || 'MEMBER'}</span>
                    <span className="text-[7px] text-white/60 font-medium truncate max-w-[100px]">{user.email}</span>
                  </Link>

                  <motion.button
                    onClick={() => signOut(auth)}
                    whileHover={{ scale: 0.96 }}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.25em] border border-white/20 backdrop-blur-md"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="hidden sm:block text-white/80 text-[10px] font-bold uppercase tracking-[0.25em] hover:text-white px-4"
                  >
                    Login
                  </button>
                  <motion.button
                    onClick={() => navigate('/signup')}
                    whileHover={{ scale: 0.96, backgroundColor: '#f9fafb' }}
                    className="bg-white text-[#7C3AED] px-4 py-2 sm:px-10 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.25em] shadow-xl whitespace-nowrap"
                  >
                    Get Started
                  </motion.button>
                </div>
              )}
            </div>

          </motion.div>

          {/* Desktop Dropdown Menus */}
          <AnimatePresence>
            {activeMenu && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/10 backdrop-blur-md z-[80] pointer-events-none" />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  className="hidden lg:block absolute top-[calc(100%+12px)] left-0 right-0 bg-[#F5F3FF] border border-[#7C3AED]/10 py-10 px-10 z-[90] shadow-[0_40px_80px_rgba(124,58,237,0.15)] rounded-[3rem]"
                  onMouseEnter={() => handleMouseEnter(activeMenu)}
                >
                  <div className="w-full">
                    {activeMenu === 'features' && <FeaturesDropdown />}
                    {activeMenu === 'learn' && <LearnDropdown />}
                    {activeMenu === 'jobprep' && <JobPrepDropdown />}
                    {activeMenu === 'jobs' && <JobsDropdown />}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Mobile Full Screen Menu Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="lg:hidden absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-[#7C3AED]/10 rounded-[2rem] shadow-2xl z-[120] overflow-hidden max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em] ml-2">Main Navigation</p>
                    <div className="grid gap-2">
                      {(isDashboard ? [
                        { to: '/dashboard/learner', label: 'My Console' },
                        { to: '/learn/courses', label: 'Courses' },
                        { to: '/job-prep/portfolio', label: 'Job Prep' },
                        { to: '/employers/get-hired', label: 'Marketplace' },
                        { to: '/about', label: 'About' }
                      ] : [
                        { to: '/', label: 'Home' },
                        { to: '/about', label: 'About Studlyf' },
                        { to: '/learn/courses', label: 'Explore Features' }
                      ]).map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full text-left px-5 py-4 bg-gray-50 rounded-xl text-xs font-bold text-[#111827] uppercase tracking-widest hover:bg-[#7C3AED] hover:text-white transition-all"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-[#F5F3FF] rounded-2xl border border-[#7C3AED]/5">
                    <p className="text-[9px] font-bold text-[#7C3AED]/60 uppercase tracking-widest mb-2">{user ? 'Signed in as ' + (user.displayName || user.email) : 'Member Access'}</p>
                    {user ? (
                      <button
                        onClick={() => { signOut(auth); setMobileMenuOpen(false); }}
                        className="w-full py-4 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-[0.25em]"
                      >
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                        className="w-full py-4 bg-[#7C3AED] text-white rounded-xl text-xs font-bold uppercase tracking-[0.25em]"
                      >
                        Login
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div >
      </nav >
    </>
  );
};

export default Navigation;
