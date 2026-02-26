import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
import WebImage from '../components/WebImage';
import { useAuth } from '../AuthContext';

interface Course {
  _id: string;
  title: string;
  description: string;
  role_tag: string;
  difficulty: string;
  // UI helper fields
  skills?: string[];
  duration?: string;
  image?: string;
  standard?: string;
  category?: string;
  price?: number;
  rating?: number;
  total_reviews?: number;
  total_hours?: number | string;
  level?: string;
  key_topics?: string[];
  last_updated?: string;
  instructor?: string;
  is_bestseller?: boolean;
  is_premium?: boolean;
  user_state?: 'NOT_PURCHASED' | 'IN_CART' | 'ENROLLED';
}

/* ─────────────────────────── mock fallback data ─────────────────────────── */
const MOCK_COURSES: Course[] = [
  {
    _id: 'm1',
    title: 'Transformer Architectures',
    description: 'Deep dive into the architecture that powered the AI revolution. Build GPT-like models from scratch.',
    role_tag: 'AI',
    difficulty: 'Advanced',
    skills: ['PyTorch', 'LLMs', 'Neural Networks'],
    duration: '6 Weeks',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    standard: 'AI_PROTOCOL_01',
    price: 49.99,
    rating: 4.9,
    total_reviews: 1250,
  },
  {
    _id: 'm2',
    title: 'Distributed System Design',
    description: 'Master the art of building systems that handle millions of requests. CAP theorem, consensus, and sharding.',
    role_tag: 'Software Engineering',
    difficulty: 'Advanced',
    skills: ['Microservices', 'System Design', 'Redis'],
    duration: '8 Weeks',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    standard: 'SWE_PROTOCOL_04',
    price: 59.99,
    rating: 4.8,
    total_reviews: 850,
  },
  {
    _id: 'm3',
    title: 'Data Engineering Pipelines',
    description: 'Build production-grade ETL pipelines using Spark, Airflow, and Snowflake.',
    role_tag: 'Data',
    difficulty: 'Intermediate',
    skills: ['Spark', 'Airflow', 'SQL'],
    duration: '5 Weeks',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    standard: 'DATA_PROTOCOL_02',
    price: 39.99,
    rating: 4.7,
    total_reviews: 620,
  },
  {
    _id: 'm4',
    title: 'Product Discovery Protocols',
    description: 'Learn to find product-market fit using data-driven discovery techniques and user research.',
    role_tag: 'PM',
    difficulty: 'Beginner',
    skills: ['Discovery', 'Strategy', 'Analytics'],
    duration: '4 Weeks',
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop',
    standard: 'PM_PROTOCOL_01',
    price: 29.99,
    rating: 4.9,
    total_reviews: 430,
  },
  {
    _id: 'm5',
    title: 'Offensive Security Ops',
    description: 'Become a certified defender by mastering offensive tactics, penetration testing, and vulnerability research.',
    role_tag: 'Cyber',
    difficulty: 'Advanced',
    skills: ['Pentesting', 'Metasploit', 'Linux'],
    duration: '10 Weeks',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    standard: 'CYBER_PROTOCOL_09',
    price: 69.99,
    rating: 4.9,
    total_reviews: 890,
  },
  {
    _id: 'm6',
    title: 'React Performance Mastery',
    description: 'Go beyond basic hooks. Master fiber architectue, concurrent rendering, and high-entropy UI optimization.',
    role_tag: 'Frontend',
    difficulty: 'Intermediate',
    skills: ['React', 'Performance', 'WASM'],
    duration: '4 Weeks',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    standard: 'FE_PROTOCOL_03',
    price: 34.99,
    rating: 4.8,
    total_reviews: 740,
  }
];

const CourseCard = ({
  _id,
  title,
  description,
  role_tag,
  difficulty,
  skills,
  duration,
  image,
  standard,
  rating = 4.5,
  price = 0,
  is_bestseller = false,
  is_premium = false,
  user_state = 'NOT_PURCHASED',
  onCardClick,
}: Course & { onCardClick: (course: Course) => void }) => {
  // Default values for missing UI fields from DB
  const displaySkills = skills || ["System Design", "Scalability", "Security"];
  const displayDuration = duration || "12 Weeks";
  const displayImage = image || "https://miro.medium.com/max/938/0*lbtSAeYRtmUMAWeY.png";
  const displayStandard = standard || "PROTOCOL_X";

  const handleClick = () => {
    onCardClick({ _id, title, description, role_tag, difficulty, skills, duration, image, standard, rating, price, is_bestseller, is_premium, user_state } as Course);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -12 }}
      className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-3xl transition-all flex flex-col group relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-64 relative overflow-hidden">
        <WebImage src={displayImage} alt={title} aspectRatio="aspect-video" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        <div className="absolute top-6 left-6 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md text-[#7C3AED] text-[8px] font-black px-4 py-2 uppercase tracking-widest rounded-full shadow-lg">{displayDuration}</span>
          <span className="bg-[#7C3AED] text-white text-[8px] font-black px-4 py-2 uppercase tracking-widest rounded-full shadow-lg">{difficulty}</span>
          {is_bestseller && (
            <span className="bg-yellow-500 text-white text-[8px] font-black px-4 py-2 uppercase tracking-widest rounded-full shadow-lg">Bestseller</span>
          )}
          {is_premium && (
            <span className="bg-purple-600 text-white text-[8px] font-black px-4 py-2 uppercase tracking-widest rounded-full shadow-lg">Premium</span>
          )}
        </div>

        <div className="absolute top-6 right-6">
          <span className="font-mono text-[7px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white/20 uppercase tracking-[0.2em]">{displayStandard}</span>
        </div>

        <div className="absolute bottom-6 left-10 right-10">
          <h3 className="text-2xl font-black text-white mb-2 font-sans leading-tight uppercase tracking-tighter">{title}</h3>
          <div className="h-1 w-12 bg-[#7C3AED] rounded-full group-hover:w-full transition-all duration-500" />
        </div>
      </div>

      <div className="p-10 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-[0.3em]">{role_tag}</span>
          {rating && (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < Math.floor(rating) ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
              <span className="text-[8px] font-bold text-gray-600">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-[#6B7280] mb-8 leading-relaxed font-medium line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {displaySkills.map((s: string) => (
            <span key={s} className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] bg-[#F9FAFB] px-4 py-2 rounded-xl border border-gray-100 group-hover:bg-[#F5F3FF] group-hover:border-[#7C3AED]/10 transition-colors">{s}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
          <div>
            {price && price > 0 ? (
              <div className="text-2xl font-black text-[#111827]">${price.toFixed(2)}</div>
            ) : (
              <div className="text-lg font-black text-[#7C3AED]">FREE</div>
            )}
          </div>

          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#6B7280]">
            {user_state === 'ENROLLED' && '✓ Enrolled'}
            {user_state === 'IN_CART' && '🛒 In Cart'}
            {user_state === 'NOT_PURCHASED' && 'Tap to preview'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStates, setUserStates] = useState<{ [key: string]: string }>({});

  const userId = user?.uid || 'test-user';

  const createSlug = (title: string, id: string) => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    // Append full ID for reliable extraction
    return `${slug}--${id}`;
  };

  const handleCourseClick = (course: Course) => {
    // Navigate to course detail page with slug
    const slug = createSlug(course.title, course._id);
    navigate(`/learn/courses/${slug}`);
  };

  // Fetch courses and user state
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all courses
        const coursesRes = await fetch(`${API_BASE_URL}/api/courses`);
        const coursesData = await coursesRes.json();
        setCourses(coursesData && coursesData.length > 0 ? coursesData : MOCK_COURSES);

        // Get user course states
        if (userId) {
          const stateRes = await fetch(`${API_BASE_URL}/api/user-courses/${userId}`);
          const stateData = await stateRes.json();

          const states: { [key: string]: string } = {};
          stateData.enrolled.forEach((c: Course) => {
            states[c._id] = 'ENROLLED';
          });
          stateData.in_cart.forEach((c: Course) => {
            states[c._id] = 'IN_CART';
          });
          stateData.available.forEach((c: Course) => {
            states[c._id] = 'NOT_PURCHASED';
          });

          setUserStates(states);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCourses(MOCK_COURSES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const categories = ['All', 'Backend', 'Frontend', 'Software Engineering', 'Data', 'AI', 'Cyber'];

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'All') return courses;
    return courses.filter(c => c.role_tag === activeCategory);
  }, [activeCategory, courses]);

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-xs tracking-widest uppercase text-[#7C3AED]">Synchronizing Protocol...</div>;

  return (
    <div className="pt-40 pb-32 px-6 bg-white min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-tech opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#7C3AED]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-[#F5F3FF] border border-[#7C3AED]/10 px-6 py-2 rounded-full mb-8"
          >
            <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.4em]">Proprietary Curriculum</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black text-[#111827] mb-8 tracking-tighter uppercase leading-[0.9]"
          >
            Engineering <br /><span className="text-[#7C3AED]">Readiness.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#6B7280] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Access tracks designed by elite architects. We don't teach theory; we build clinical competence through high-entropy simulation.
          </motion.p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-20 border-b border-gray-100 pb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === cat
                ? 'bg-[#111827] text-white border-[#111827] shadow-xl shadow-black/10 scale-105'
                : 'bg-white text-gray-400 border-gray-100 hover:border-[#7C3AED]/30 hover:text-gray-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.div key={course._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CourseCard
                  {...course}
                  user_state={(userStates[course._id] || 'NOT_PURCHASED') as any}
                  onCardClick={handleCourseClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;
