

import { useState, useEffect, useRef } from "react"
import {
  Hexagon,
  Brain,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Home,
  BookOpen,
  Users,
  Award,
  PlayCircle,
  Clock,
  CheckCircle,
  PenTool,
  MessageSquare,
  BarChart2,
  Activity,
  HelpCircle,
  Star,
  Trophy,
  Zap,
  Volume2,
  Shield,
} from "lucide-react"

export default function ParticipantsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(() => {
    // Try to get active menu from localStorage for persistence across page reloads
    return localStorage.getItem('activeMenu') || "dashboard"
  })
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
    analytics: false,
    settings: false,
  })
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: "Server update completed", time: "1 hour ago", read: false },
    { id: 3, title: "New quiz published", time: "3 hours ago", read: true },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Check URL path to set active menu on page load
    const setActiveMenuFromPath = () => {
      const path = window.location.pathname;
      // First check for exact matches
      for (const item of menuItems) {
        if (item.path && path === item.path) {
          setActiveMenu(item.name);
          return;
        }
        // Check submenu items
        if (item.submenu) {
          for (const subItem of item.submenu) {
            if (path === subItem.path) {
              setActiveMenu(subItem.name);
              // Expand the parent menu
              setExpandedMenus(prev => ({...prev, [item.name]: true}));
              return;
            }
          }
        }
      }
      // If no exact match, check for partial matches
      for (const item of menuItems) {
        if (item.path && path.startsWith(item.path) && item.path !== '') {
          setActiveMenu(item.name);
          return;
        }
        // Check submenu items
        if (item.submenu) {
          for (const subItem of item.submenu) {
            if (path.startsWith(subItem.path) && subItem.path !== '') {
              setActiveMenu(subItem.name);
              // Expand the parent menu
              setExpandedMenus(prev => ({...prev, [item.name]: true}));
              return;
            }
          }
        }
      }
    };
    
    setActiveMenuFromPath();

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle clicks outside of dropdown menus and mobile search
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowMobileSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const menuItems = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "dashboard",
    },
    {
      name: "competitions",
      label: "Competitions",
      icon: Trophy,
      path: "/participant/competitions",
      submenu: [
        { name: "upcoming", label: "Upcoming Competitions", path: "/participant/competitions/upcoming" },
        { name: "ongoing", label: "Ongoing Competitions", path: "/participant/competitions/ongoing" },
        { name: "completed", label: "Completed Competitions", path: "/participant/competitions/completed" }
      ],
    },
    {
      name: "quizzes",
      label: "My Quizzes",
      icon: BookOpen,
      path: "/participant/quizzes",
      submenu: [
        { name: "active-quizzes", label: "Active Quizzes", path: "/participant/quizzes/active" },
        { name: "practice-quizzes", label: "Practice Quizzes", path: "/participant/quizzes/practice" },
        { name: "quiz-history", label: "Quiz History", path: "/participant/quizzes/history" }
      ],
    },
    {
      name: "team",
      label: "My Team",
      icon: Users,
      path: "/participant/team",
      submenu: [
        { name: "team-members", label: "Team Members", path: "/participant/team/members" },
        { name: "team-performance", label: "Team Performance", path: "/participant/team/performance" },
        { name: "team-chat", label: "Team Chat", path: "/participant/team/chat" }
      ],
    },
    {
      name: "scores",
      label: "Scores & Results",
      icon: Award,
      path: "/participant/scores",
      submenu: [
        { name: "my-scores", label: "My Scores", path: "/participant/scores/my-scores" },
        { name: "leaderboards", label: "Leaderboards", path: "/participant/scores/leaderboards" },
        { name: "achievements", label: "Achievements", path: "/participant/scores/achievements" }
      ],
    },
    {
      name: "buzzer",
      label: "Buzzer System",
      icon: PlayCircle,
      path: "/participant/buzzer",
      submenu: [
        { name: "buzzer-practice", label: "Buzzer Practice", path: "/participant/buzzer/practice" },
        { name: "buzzer-settings", label: "Buzzer Settings", path: "/participant/buzzer/settings" }
      ],
    },
    {
      name: "study",
      label: "Study Resources",
      icon: PenTool,
      path: "/participant/study",
      submenu: [
        { name: "flashcards", label: "Flashcards", path: "/participant/study/flashcards" },
        { name: "notes", label: "Notes", path: "/participant/study/notes" },
        { name: "practice-questions", label: "Practice Questions", path: "/participant/study/practice-questions" }
      ],
    },
    {
      name: "feedback",
      label: "Feedback & Support",
      icon: MessageSquare,
      path: "/participant/feedback",
      submenu: [
        { name: "submit-feedback", label: "Submit Feedback", path: "/participant/feedback/submit" },
        { name: "support-tickets", label: "Support Tickets", path: "/participant/feedback/tickets" },
        { name: "faq", label: "FAQ", path: "/participant/feedback/faq" }
      ],
    },
    {
      name: "profile",
      label: "My Profile",
      icon: User,
      path: "/participant/profile",
      submenu: [
        { name: "edit-profile", label: "Edit Profile", path: "/participant/profile/edit" },
        { name: "preferences", label: "Preferences", path: "/participant/profile/preferences" },
        { name: "account-settings", label: "Account Settings", path: "/participant/profile/account" }      ],
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Custom Scrollbar Styling for Sidebar */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Webkit browsers (Chrome, Safari) */
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #0a1f44;
          border-radius: 6px;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #152a4e;
        }
        
        /* Firefox */
        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #0a1f44 #f1f1f1;
        }
      `}} />
      {/* Mobile Sidebar Overlay - Enhanced for better touch interaction */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar - Enhanced for mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[300px] sm:max-w-[320px] bg-gradient-to-b from-[#0a1f44] to-[#152a4e] text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarOpen ? "lg:w-72" : "lg:w-20"}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 border-b border-[#152a4e]/50 backdrop-blur-sm bg-[#0a1f44]/90 sticky top-0 z-10 transition-all duration-300">
          <div
            className={`flex items-center ${!sidebarOpen ? "lg:justify-center lg:w-full" : "space-x-3"} transition-all duration-300`}
          >
            <div className="relative flex-shrink-0 group">
              <Hexagon
                className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-yellow-400 transition-all duration-300 group-hover:rotate-12 ${!sidebarOpen && "lg:h-8 lg:w-8"}`}
                fill="#0a1f44"
              />
              <Brain
                className={`h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${!sidebarOpen && "lg:h-4 lg:w-4"}`}
              />
            </div>
            <span
              className={`text-xl font-bold transition-all duration-300 ${!sidebarOpen ? "lg:opacity-0 lg:w-0 lg:translate-x-10" : "opacity-100 translate-x-0"}`}
            >
              QuizHive
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-white p-1 rounded-md hover:bg-[#152a4e] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="py-4 flex flex-col h-[calc(100%-4rem)] overflow-y-auto sidebar-scrollbar">
          <div className="px-4 mb-6">
            <div
              className={`flex items-center ${
                !sidebarOpen ? "lg:justify-center lg:p-2" : "space-x-3 p-3"
              } rounded-lg bg-gradient-to-r from-[#152a4e] to-[#1d3a6a] shadow-lg transition-all duration-300 hover:shadow-xl hover:from-[#1d3a6a] hover:to-[#254980]`}
            >
              <div
                className={`relative ${!sidebarOpen ? "lg:h-9 lg:w-9" : "h-10 w-10"} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300`}
              >
                <Shield
                  className={`${!sidebarOpen ? "lg:h-4 lg:w-4" : "h-5 w-5"} text-[#0a1f44] transition-all duration-300`}
                />
              </div>
              <div
                className={`transition-all duration-300 ${!sidebarOpen ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"}`}
              >
                <div className="font-medium">Super Admin</div>
                <div className="text-xs text-gray-300">Full Access</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Enhanced for mobile */}
          <nav className="flex-1 px-2 sm:px-3">
            <ul className="space-y-1 sm:space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.name} className="group">
                  <a
                    href={item.path}
                    className={`flex items-center ${
                      !sidebarOpen ? "lg:justify-center lg:px-2" : "px-2 sm:px-3"
                    } py-2 sm:py-2.5 rounded-lg transition-all duration-200 ${
                      activeMenu === item.name
                        ? "bg-yellow-400 text-[#0a1f44] font-medium shadow-md"
                        : "text-gray-300 hover:bg-[#152a4e]/70 hover:text-white"
                    }`}
                    onClick={(e) => {
                      if (item.submenu) {
                        e.preventDefault()
                        // Set this menu as active even if it has a submenu
                        setActiveMenu(item.name)
                        // Store active menu in localStorage for persistence
                        localStorage.setItem('activeMenu', item.name);
                        // Toggle the submenu
                        setExpandedMenus(prev => ({
                          ...prev,
                          [item.name]: !prev[item.name]
                        }));
                        // Close mobile menu after selecting an item on mobile
                        if (window.innerWidth < 1024) {
                          setTimeout(() => setMobileMenuOpen(false), 150);
                        }
                      } else {
                        setActiveMenu(item.name)
                        // Store active menu in localStorage for persistence
                        localStorage.setItem('activeMenu', item.name);
                        // Close mobile menu after selecting an item
                        if (window.innerWidth < 1024) {
                          setMobileMenuOpen(false);
                        }
                      }
                    }}
                  >
                    <div
                      className={`relative ${activeMenu === item.name ? "text-[#0a1f44]" : "text-gray-400 group-hover:text-white"} ${!sidebarOpen && "lg:h-5 lg:w-5 lg:flex lg:items-center lg:justify-center"}`}
                    >
                      <item.icon
                        className={`h-5 w-5 transition-transform duration-300 ${activeMenu === item.name ? "scale-110" : "group-hover:scale-110"}`}
                      />
                      {item.badge && (
                        <span
                          className={`absolute -top-1.5 ${!sidebarOpen ? "lg:-right-0.5" : "-right-1.5"} flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white transition-all duration-300`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`ml-3 transition-all duration-300 ${!sidebarOpen ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100 translate-x-0"}`}
                    >
                      {item.label}
                    </span>
                    {item.submenu && (
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform duration-300 ${
                          expandedMenus[item.name] ? "rotate-180" : ""
                        } ${!sidebarOpen ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"} ${
                          activeMenu === item.name ? "text-[#0a1f44]" : ""
                        }`}
                      />
                    )}
                  </a>

                  {/* Submenu - Enhanced for mobile */}
                  {item.submenu && expandedMenus[item.name] && (
                    <ul
                      className={`mt-1 ml-3 sm:ml-4 pl-2 sm:pl-3 border-l border-[#152a4e]/70 space-y-0.5 sm:space-y-1 ${!sidebarOpen ? "lg:hidden" : ""}`}
                    >
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <a
                            href={subItem.path}
                            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-sm rounded-md transition-all duration-200 ${
                              activeMenu === subItem.name
                                ? "bg-yellow-400/80 text-[#0a1f44] font-medium"
                                : "text-gray-300 hover:text-white hover:bg-[#152a4e]/20"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveMenu(subItem.name);
                              // Close mobile menu after selecting a submenu item
                              if (window.innerWidth < 1024) {
                                setTimeout(() => setMobileMenuOpen(false), 150);
                              }
                              // Navigate to the path
                              window.location.href = subItem.path;
                              // Store active menu in localStorage for persistence
                              localStorage.setItem('activeMenu', subItem.name);
                            }}
                          >
                            <span>{subItem.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer - Enhanced for mobile */}
          <div className="mt-auto px-3 sm:px-4 py-3 sm:py-4 border-t border-[#152a4e]/50">
            <a
              href="/logout"
              className={`flex items-center px-3 py-2.5 text-gray-300 rounded-lg hover:bg-[#152a4e]/70 hover:text-white transition-all duration-200 group ${!sidebarOpen && "lg:justify-center"}`}
              onClick={(e) => {
                // For mobile, add a small delay to show the tap effect
                if (window.innerWidth < 1024) {
                  e.preventDefault();
                  const link = e.currentTarget;
                  link.classList.add('bg-[#152a4e]/40');
                  setTimeout(() => {
                    window.location.href = link.href;
                  }, 150);
                }
              }}
            >
              <LogOut className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
              <span
                className={`ml-3 transition-all duration-300 ${!sidebarOpen ? "lg:opacity-0 lg:w-0 lg:translate-x-10" : "opacity-100 translate-x-0"}`}
              >
                Logout
              </span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`bg-white z-10 transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
          {/* Main Header */}
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-100/20 to-yellow-300/20 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-100/20 to-blue-300/20 blur-lg"></div>
            </div>

            {/* Header Content - Enhanced for mobile */}
            <div className="relative flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6 bg-gradient-to-r from-[#0a1f44] to-[#152a4e] text-white shadow-md">
              {/* Left side */}
              <div className="flex items-center relative z-10">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setMobileMenuOpen(!mobileMenuOpen)
                      } else {
                        setSidebarOpen(!sidebarOpen)
                      }
                    }}
                    className="group p-2 sm:p-2.5 rounded-full bg-yellow-400 text-[#0a1f44] hover:bg-yellow-300 shadow-md hover:shadow-lg border border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-200"
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  </button>
                </div>
              </div>
              
              {/* Right side */}
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                {/* User Menu - Enhanced for mobile */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    className={`flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 rounded-full transition-all duration-200 ${
                      showUserMenu
                        ? "bg-yellow-400/30 ring-2 ring-yellow-400/50"
                        : "bg-white/15 text-white hover:bg-white/25 shadow-md hover:shadow-lg border border-white/20"
                    }`}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-[#0a1f44] shadow-md border-2 border-white/30">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="hidden md:block font-medium text-sm text-white">Admin</span>
                    <ChevronDown
                      className={`hidden md:block h-4 w-4 text-white/70 transition-transform duration-200 ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown - keeping the same */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-5">
                      <div className="p-4 border-b border-gray-200/80 text-center bg-gradient-to-r from-[#0a1f44]/5 to-[#152a4e]/5">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0a1f44] to-[#152a4e] flex items-center justify-center text-white mx-auto mb-3 shadow-lg border-4 border-white">
                          <User className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-[#0a1f44] text-lg">Admin User</h3>
                        <p className="text-xs text-gray-500 mt-1">admin@quizhive.com</p>
                        <div className="mt-2 flex justify-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Super Admin
                          </span>
                        </div>
                      </div>
                      <div className="py-1">
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          Profile
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-2 text-gray-500" />
                          Settings
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Activity className="h-4 w-4 mr-2 text-gray-500" />
                          Activity Log
                        </a>
                      </div>
                      <div className="py-1 border-t border-gray-200/80 bg-gray-50">
                        <a
                          href="/logout"
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2 text-red-500" />
                          Logout
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6">
          <div className="w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
