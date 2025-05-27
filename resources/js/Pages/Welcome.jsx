import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import {
  Brain,
  Trophy,
  Users,
  BarChart,
  CheckCircle,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Star,
  Hexagon,
  Play,
  ChevronDown,
  Award,
} from "lucide-react"

export default function Welcome() {
  // Add Head component for Inertia.js integration
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Add a hook to track window size for responsive design
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])



  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <Head title="Welcome" />
      {/* Custom Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Webkit browsers (Chrome, Safari) */
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #0a1f44;
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #152a4e;
        }
        
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #0a1f44 #f1f1f1;
        }
      `}} />
      {/* Honeycomb Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.5v35L30 60 0 42.5v-35L30 0zm0 5.764L5.764 20v30l24.236 14.236L54.236 50V20L30 5.764z' fill='%230a1f44' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a1f44]/95 py-2 shadow-lg" : "bg-[#0a1f44] py-4"}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Hexagon className="h-10 w-10 text-yellow-400" fill="#0a1f44" />
              <Brain className="h-5 w-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-2xl font-bold text-white">QuizHive</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-white hover:text-yellow-400 transition-colors flex items-center space-x-1 group"
            >
              <span>Features</span>
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-yellow-400 transition-colors flex items-center space-x-1 group"
            >
              <span>How It Works</span>
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#testimonials"
              className="text-white hover:text-yellow-400 transition-colors flex items-center space-x-1 group"
            >
              <span>Testimonials</span>
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-yellow-400 transition-colors flex items-center space-x-1 group"
            >
              <span>Pricing</span>
              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </nav>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="px-4 py-2 rounded-md border border-white/70 hover:border-white hover:bg-white/10 transition-all text-white"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1f44] rounded-md hover:from-yellow-300 hover:to-yellow-400 transition-all font-medium shadow-lg shadow-yellow-500/20"
            >
              Sign Up Free
            </a>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1f44]/95 py-4 backdrop-blur-sm animate-fadeIn">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <a
                href="#features"
                className="text-white hover:text-yellow-400 transition-colors py-2 border-b border-white/10"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-white hover:text-yellow-400 transition-colors py-2 border-b border-white/10"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-white hover:text-yellow-400 transition-colors py-2 border-b border-white/10"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-white hover:text-yellow-400 transition-colors py-2 border-b border-white/10"
              >
                Pricing
              </a>
              <div className="flex space-x-4 pt-4">
                <a
                  href="#"
                  className="flex-1 px-4 py-3 rounded-md border border-white/70 hover:bg-white/10 transition-all text-white text-center"
                >
                  Login
                </a>
                <a
                  href="#"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1f44] rounded-md hover:from-yellow-300 hover:to-yellow-400 transition-all font-medium text-center"
                >
                  Sign Up Free
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="relative h-screen flex flex-col justify-center bg-gradient-to-b from-[#0a1f44] to-[#152a4e] text-white overflow-hidden pt-16">
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <Hexagon
              key={i}
              className="absolute text-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 80 + 40}px`,
                height: `${Math.random() * 80 + 40}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 md:ml-16">
            <div className="inline-block px-4 py-1 bg-yellow-400/20 rounded-full text-yellow-300 font-medium text-sm mb-6">
              #1 Quiz Platform for Educators
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create <span className="text-yellow-400">Engaging</span> Quizzes with QuizHive
            </h1>
            <p className="text-xl mb-8 text-gray-300 leading-relaxed">
              The ultimate quiz platform for educators, businesses, and quiz enthusiasts. Create, share, and analyze
              quizzes with ease.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1f44] rounded-md hover:from-yellow-300 hover:to-yellow-400 transition-all font-bold flex items-center justify-center shadow-lg shadow-yellow-500/20 group"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 justify-end items-center">
            <div className="relative inline-block mr-20 ml-0">
              <div className="w-[700px] h-[700px] relative animate-float">
                <img 
                  src="/images/robot_bee_yellow_rigged_360-1.png" 
                  alt="3D Mechanical Bee" 
                  className="w-full h-full object-contain drop-shadow-2xl scale-125"
                />
              </div>
              <style jsx>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-20px); }
                }
                .animate-float {
                  animation: float 6s ease-in-out infinite;
                }
              `}</style>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-[#0a1f44] rounded-full text-white font-medium text-sm mb-4">
              COMPETITION FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#0a1f44]">
              Everything You Need for an <span className="text-yellow-500">Exciting</span> Quiz Bee
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple yet powerful tools to host engaging quiz bee competitions for your event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#0a1f44] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#152a4e] group hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-[#0a1f44] to-[#152a4e] p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Easy Question Setup</h3>
              <p className="text-gray-300 mb-6">
                Quickly create multiple-choice, true/false, and open-ended questions for your competition rounds.
              </p>
              <div className="flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0a1f44] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#152a4e] group hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-[#0a1f44] to-[#152a4e] p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Team Management</h3>
              <p className="text-gray-300 mb-6">
                Register participants, create teams, and manage contestant information all in one place.
              </p>
              <div className="flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0a1f44] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#152a4e] group hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-[#0a1f44] to-[#152a4e] p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <BarChart className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Live Scoreboard</h3>
              <p className="text-gray-300 mb-6">
                Display real-time scores and rankings to keep audience and participants engaged throughout the event.
              </p>
              <div className="flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0a1f44] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#152a4e] group hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-[#0a1f44] to-[#152a4e] p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Competition Rounds</h3>
              <p className="text-gray-300 mb-6">
                Organize different rounds with varying difficulty levels - from easy to elimination rounds.
              </p>
              <div className="flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#0a1f44] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#152a4e] group hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-[#0a1f44] to-[#152a4e] p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Timer Controls</h3>
              <p className="text-gray-300 mb-6">
                Set customizable timers for each question or round to keep your competition running smoothly.
              </p>
              <div className="flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#0a1f44] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#152a4e] group hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-[#0a1f44] to-[#152a4e] p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Results & Certificates</h3>
              <p className="text-gray-300 mb-6">Generate competition results and printable certificates for winners.</p>
              <div className="flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1f44] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <Hexagon className="h-10 w-10 text-yellow-400" fill="#0a1f44" />
                  <Brain className="h-5 w-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-2xl font-bold">QuizHive</span>
              </div>
              <p className="text-gray-300 mb-6">
                The ultimate quiz platform for educators, businesses, and quiz enthusiasts.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} QuizHive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
