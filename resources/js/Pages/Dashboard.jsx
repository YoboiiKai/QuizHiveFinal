import { useState, useEffect } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import ParticipantsLayout from "@/Layouts/ParticipantsLayout"
import { Head, usePage } from "@inertiajs/react"
import {
  Trophy,
  Users,
  Calendar,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Star,
  Zap,
  BookOpen,
  UserCheck,
  Layers,
  AlertTriangle,
  Activity,
  BarChart2,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  Bell,
  Filter,
  PieChart,
  UserCircle,
  DollarSign
} from "lucide-react"

// Admin Dashboard Component
const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("week")
  const [animateStats, setAnimateStats] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  
  // Trigger animations when component mounts
  useEffect(() => {
    setAnimateStats(true)
    
    // Auto-hide notification after 5 seconds
    const timer = setTimeout(() => {
      setShowNotification(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  // Mock data for the dashboard
  const stats = [
    {
      title: "Active Competitions",
      value: "12",
      change: "+3",
      changeType: "positive",
      icon: Trophy,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      description: "Currently running quiz competitions"
    },
    {
      title: "Registered Teams",
      value: "48",
      change: "+5",
      changeType: "positive",
      icon: Users,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      description: "Teams participating in competitions"
    },
    {
      title: "Questions Bank",
      value: "1,250",
      change: "+120",
      changeType: "positive",
      icon: BookOpen,
      color: "amber",
      bgGradient: "from-amber-500 to-amber-600",
      description: "Total questions available in system"
    },
    {
      title: "Completion Rate",
      value: "92%",
      change: "-2%",
      changeType: "negative",
      icon: CheckCircle,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      description: "Competitions completed successfully"
    },
  ]

  const upcomingCompetitions = [
    {
      id: 1,
      name: "National Science Quiz Bee",
      date: "May 15, 2025",
      time: "10:00 AM",
      teams: 16,
      status: "Scheduled",
      category: "Science",
    },
    {
      id: 2,
      name: "Regional Math Challenge",
      date: "May 22, 2025",
      time: "9:30 AM",
      teams: 12,
      status: "Registration Open",
      category: "Mathematics",
    },
    {
      id: 3,
      name: "Inter-School History Bowl",
      date: "June 5, 2025",
      time: "1:00 PM",
      teams: 8,
      status: "Scheduled",
      category: "History",
    },
    {
      id: 4,
      name: "Tech & Programming Quiz",
      date: "June 12, 2025",
      time: "11:00 AM",
      teams: 10,
      status: "Registration Open",
      category: "Technology",
    },
  ]

  const topPerformers = [
    {
      id: 1,
      name: "Quantum Minds",
      school: "Einstein Academy",
      score: 98,
      wins: 5,
      category: "Science",
    },
    {
      id: 2,
      name: "Mathmagicians",
      school: "Pythagoras High School",
      score: 95,
      wins: 4,
      category: "Mathematics",
    },
    {
      id: 3,
      name: "History Hunters",
      school: "Heritage Institute",
      score: 92,
      wins: 4,
      category: "History",
    },
    {
      id: 4,
      name: "Code Warriors",
      school: "Tech Academy",
      score: 90,
      wins: 3,
      category: "Technology",
    },
    {
      id: 5,
      name: "Literary Lions",
      school: "Shakespeare High",
      score: 88,
      wins: 3,
      category: "Literature",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "New team registered",
      subject: "Quantum Physics Team",
      time: "10 minutes ago",
      icon: UserCheck,
      color: "blue",
    },
    {
      id: 2,
      action: "Competition completed",
      subject: "Junior Science Quiz Bee",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 3,
      action: "New questions added",
      subject: "Advanced Mathematics",
      time: "3 hours ago",
      icon: BookOpen,
      color: "purple",
    },
    {
      id: 4,
      action: "Competition rescheduled",
      subject: "Regional History Bowl",
      time: "Yesterday",
      icon: Calendar,
      color: "amber",
    },
    {
      id: 5,
      action: "Technical issue reported",
      subject: "Scoring System",
      time: "Yesterday",
      icon: AlertTriangle,
      color: "red",
    },
  ]

  const categoryPerformance = [
    { name: "Science", completion: 94, questions: 320 },
    { name: "Mathematics", completion: 88, questions: 280 },
    { name: "History", completion: 82, questions: 240 },
    { name: "Literature", completion: 78, questions: 200 },
    { name: "Technology", completion: 76, questions: 180 },
  ]

  return (
    <AdminLayout>
      {/* Welcome Banner with enhanced styling */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0a1f44] to-[#152a4e] rounded-xl p-8 mb-6 text-white shadow-xl border border-blue-900/20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -mb-10 -ml-10 blur-xl"></div>
        
        {/* Notification banner */}
        {showNotification && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500/90 to-amber-600/90 py-2 px-4 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center text-white text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Welcome to the new QuizHive dashboard! Explore our new features.</span>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div>
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
              <h1 className="text-3xl font-bold">Quiz Bee Dashboard</h1>
            </div>
            <p className="text-blue-100 max-w-2xl mt-3 ml-11">
              Monitor competitions, track team performance, and manage quiz bee events all in one place.
            </p>
            <div className="ml-11 mt-4 flex items-center text-xs text-blue-200">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
            <button className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center border border-white/20 hover:shadow-lg hover:shadow-blue-900/20">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Event
            </button>
            <button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-[#0a1f44] font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg hover:shadow-amber-600/20 transform hover:-translate-y-0.5">
              <Zap className="mr-2 h-5 w-5" />
              New Competition
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview with enhanced styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={`h-1 w-full bg-gradient-to-r ${stat.bgGradient}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    {stat.title}
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {index === 0 ? 'Live' : ''}
                    </span>
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0a1f44] group-hover:text-[#152a4e] transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {stat.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium flex items-center ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"} bg-${stat.changeType === "positive" ? "green" : "red"}-50 px-2 py-0.5 rounded-full`}
                    >
                      {stat.changeType === "positive" ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.bgGradient} text-white shadow-md`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming Competitions with enhanced styling */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="bg-gradient-to-r from-[#0a1f44] to-[#152a4e] px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 opacity-80" />
              Upcoming Competitions
            </h3>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                className={`text-xs px-3 py-1.5 rounded-md transition-all ${timeRange === "week" ? "bg-white text-[#0a1f44] shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                onClick={() => setTimeRange("week")}
              >
                This Week
              </button>
              <button
                className={`text-xs px-3 py-1.5 rounded-md transition-all ${timeRange === "month" ? "bg-white text-[#0a1f44] shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                onClick={() => setTimeRange("month")}
              >
                This Month
              </button>
              <button
                className={`text-xs px-3 py-1.5 rounded-md transition-all ${timeRange === "all" ? "bg-white text-[#0a1f44] shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                onClick={() => setTimeRange("all")}
              >
                All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Competition</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Teams</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingCompetitions.map((competition, index) => (
                  <tr key={competition.id} className={`hover:bg-blue-50/50 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                            competition.category === "Science"
                              ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                              : competition.category === "Mathematics"
                                ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                                : competition.category === "History"
                                  ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                                  : "bg-gradient-to-br from-green-400 to-green-600 text-white"
                          }`}
                        >
                          {competition.category === "Science" ? (
                            <Zap className="h-5 w-5" />
                          ) : competition.category === "Mathematics" ? (
                            <Layers className="h-5 w-5" />
                          ) : competition.category === "History" ? (
                            <BookOpen className="h-5 w-5" />
                          ) : (
                            <Trophy className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 flex items-center">
                            {competition.name}
                            {index === 0 && <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">New</span>}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{competition.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-800 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                        {competition.date}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        {competition.time}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-800 flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                        {competition.teams}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Registered</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          competition.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                            : "bg-green-100 text-green-800 ring-1 ring-green-200"
                        }`}
                      >
                        {competition.status === "Scheduled" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {competition.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center ml-auto px-3 py-1.5 rounded-lg transition-all">
                        Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center py-3 border-t border-gray-100">
            <button className="text-sm text-[#0a1f44] hover:text-[#152a4e] font-medium flex items-center justify-center mx-auto">
              View all competitions
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Top Performing Teams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <h3 className="text-lg font-semibold text-[#0a1f44] mb-6">Top Performing Teams</h3>
          <div className="space-y-5">
            {topPerformers.map((team, index) => (
              <div key={team.id} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a1f44] text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">{team.name}</h4>
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{team.score}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">{team.school}</p>
                    <p className="text-xs text-gray-500">{team.wins} wins</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-gradient-to-r from-[#0a1f44] to-[#152a4e] h-1.5 rounded-full"
                      style={{ width: `${team.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full py-2 bg-[#0a1f44] hover:bg-[#152a4e] text-white rounded-lg transition-colors flex items-center justify-center">
              <Trophy className="h-4 w-4 mr-2" />
              View Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <h3 className="text-lg font-semibold text-[#0a1f44] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-${activity.color}-100 text-${activity.color}-500 flex items-center justify-center`}
                >
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.subject}</span> - {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-[#0a1f44] hover:text-[#152a4e] font-medium">View all activity</button>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <h3 className="text-lg font-semibold text-[#0a1f44] mb-4">Category Performance</h3>
          <div className="space-y-4">
            {categoryPerformance.map((category, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0a1f44] to-[#152a4e] text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">{category.name}</h4>
                    <span className="text-xs text-gray-500">{category.questions} questions</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-[#0a1f44] to-[#152a4e] h-1.5 rounded-full"
                        style={{ width: `${category.completion}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">{category.completion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#0a1f44]/5 rounded-lg">
            <h4 className="text-sm font-medium text-[#0a1f44] mb-2">Competition Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Average Score</div>
                <div className="text-lg font-semibold text-[#0a1f44]">86.5%</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Participation</div>
                <div className="text-lg font-semibold text-[#0a1f44]">92%</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Avg. Duration</div>
                <div className="text-lg font-semibold text-[#0a1f44]">45 min</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Difficulty</div>
                <div className="text-lg font-semibold text-[#0a1f44]">Medium</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard;
