

import { useState, useEffect } from "react"
import AdminLayout from "../../Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { 
  Search, 
  Users,
  User,
  Trophy,
  Medal,
  X,
  Hexagon,
  Filter,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react"
import AddTeamModal from "../../Components/Admin/AddTeamModal"
import UpdateTeamModal from "../../Components/Admin/UpdateTeamModal"

export default function Team() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [filterCompetition, setFilterCompetition] = useState("all")
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Sample competitions data for filtering
  const competitions = [
    { id: "all", name: "All Competitions" },
    { id: 1, name: "National Science Quiz 2025" },
    { id: 2, name: "Regional Math Challenge" },
    { id: 3, name: "History Trivia Championship" }
  ]

  // Sample teams data (in a real app, this would come from an API)
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Quantum Minds",
      school: "Westfield High School",
      members: [
        { id: 1, name: "Alex Johnson", role: "Captain", email: "alex@example.com", phone: "123-456-7890" },
        { id: 2, name: "Jamie Smith", role: "Member", email: "jamie@example.com", phone: "123-456-7891" },
        { id: 3, name: "Taylor Brown", role: "Member", email: "taylor@example.com", phone: "123-456-7892" }
      ],
      competitionId: 1,
      competitionName: "National Science Quiz 2025",
      location: "New York, NY",
      registrationDate: "2025-02-15"
    },
    {
      id: 2,
      name: "Math Wizards",
      school: "Eastside Academy",
      members: [
        { id: 4, name: "Morgan Lee", role: "Captain", email: "morgan@example.com", phone: "123-456-7893" },
        { id: 5, name: "Casey Wilson", role: "Member", email: "casey@example.com", phone: "123-456-7894" },
        { id: 6, name: "Jordan Miller", role: "Member", email: "jordan@example.com", phone: "123-456-7895" }
      ],
      competitionId: 2,
      competitionName: "Regional Math Challenge",
      location: "Boston, MA",
      registrationDate: "2025-01-20"
    },
    {
      id: 3,
      name: "History Buffs",
      school: "Central High",
      members: [
        { id: 7, name: "Riley Davis", role: "Captain", email: "riley@example.com", phone: "123-456-7896" },
        { id: 8, name: "Avery Garcia", role: "Member", email: "avery@example.com", phone: "123-456-7897" },
        { id: 9, name: "Quinn Martinez", role: "Member", email: "quinn@example.com", phone: "123-456-7898" }
      ],
      competitionId: 3,
      competitionName: "History Trivia Championship",
      location: "Chicago, IL",
      registrationDate: "2025-03-05"
    },
    {
      id: 4,
      name: "Science Stars",
      school: "Northside Prep",
      members: [
        { id: 10, name: "Reese Thompson", role: "Captain", email: "reese@example.com", phone: "123-456-7899" },
        { id: 11, name: "Parker Wright", role: "Member", email: "parker@example.com", phone: "123-456-7900" },
        { id: 12, name: "Drew Anderson", role: "Member", email: "drew@example.com", phone: "123-456-7901" }
      ],
      competitionId: 1,
      competitionName: "National Science Quiz 2025",
      location: "San Francisco, CA",
      registrationDate: "2025-02-28"
    }
  ])
  
  // Handler functions for team management
  const handleAddTeam = (newTeam) => {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1
    setTeams([...teams, { 
      id: newId, 
      ...newTeam
    }])
  }

  const handleUpdateTeam = (id, updatedData) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, ...updatedData } : team
    ))
  }

  const handleDeleteTeam = (id) => {
    setTeams(teams.filter(team => team.id !== id))
  }
  
  const openUpdateModal = (team) => {
    setSelectedTeam(team)
    setIsUpdateModalOpen(true)
  }

  // Filter teams based on search term and competition filter
  const filteredTeams = teams
    .filter(team => {
      // Filter by competition
      if (filterCompetition !== "all" && team.competitionId !== parseInt(filterCompetition)) {
        return false
      }
      
      // Filter by search term
      const searchLower = searchTerm.toLowerCase()
      return team.name.toLowerCase().includes(searchLower) || 
             team.school.toLowerCase().includes(searchLower) ||
             team.members.some(member => member.name.toLowerCase().includes(searchLower)) ||
             team.competitionName.toLowerCase().includes(searchLower)
    })
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))

  return (
    <AdminLayout>
      <Head title="Teams" />
      
      {/* Custom Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Webkit browsers (Chrome, Safari) */
        ::-webkit-scrollbar {
          width: 10px;
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
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.5v35L30 60 0 42.5v-35L30 0zm0 5.764L5.764 20v30l24.236 14.236L54.236 50V20L30 5.764z' fill='%230a1f44' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>
      
      <div className="relative z-10">
        {/* Header with enhanced styling */}
        <div className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-[#0a1f44]/95 shadow-lg" : "bg-[#0a1f44]"} text-white mb-6 py-6 rounded-2xl`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <div className="relative mr-3">
                    <Hexagon className="h-8 w-8 text-yellow-400" fill="#0a1f44" />
                    <Users className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  Teams
                </h1>
                <p className="text-white/80 mt-1">View and manage teams participating in competitions</p>
              </div>
              <div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1f44] font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center hover:shadow-lg hover:shadow-yellow-500/20 hover:from-yellow-300 hover:to-yellow-400"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Team
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="container mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50/80 transition-all duration-200 hover:bg-white"
                  placeholder="Search teams, members, schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              <div className="w-full md:w-64">
                <select
                  value={filterCompetition}
                  onChange={(e) => setFilterCompetition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50/80 transition-all duration-200 hover:bg-white"
                >
                  {competitions.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(searchTerm || filterCompetition !== "all") && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtered results: </span>
                {searchTerm && <span className="ml-1 bg-[#0a1f44]/10 text-[#0a1f44] px-2 py-0.5 rounded-md mr-2">Search: "{searchTerm}"</span>}
                {filterCompetition !== "all" && (
                  <span className="ml-1 bg-[#0a1f44]/10 text-[#0a1f44] px-2 py-0.5 rounded-md mr-2">
                    Competition: {competitions.find(c => c.id.toString() === filterCompetition.toString())?.name}
                  </span>
                )}
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setFilterCompetition('all')
                  }}
                  className="ml-auto text-[#0a1f44] hover:text-[#152a4e] flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Teams Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <div key={team.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl group hover:translate-y-[-5px]">
                {/* Card Header */}
                <div className="p-4 bg-[#0a1f44] text-white h-16 flex items-center">
                  <h2 className="text-lg font-bold line-clamp-1 flex items-center w-full">
                    <Users className="h-5 w-5 mr-2 text-yellow-400" />
                    {team.name}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="font-medium">{team.competitionName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span>{team.school}</span>
                  </div>
                  
                  <div className="mb-5">
                    <div className="text-xs font-medium text-[#0a1f44] mb-2">Team Members</div>
                    <div className="space-y-3">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-start">
                          <div className="bg-[#0a1f44]/5 rounded-full p-2 mr-3">
                            <User className="h-4 w-4 text-[#0a1f44]" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700">{member.name}</span>
                              {member.role === "Captain" && (
                                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                                  <Medal className="h-3 w-3 inline mr-1" />
                                  Captain
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 mt-1">
                              <div className="flex items-center mr-3">
                                <Mail className="h-3 w-3 mr-1" />
                                <span>{member.email}</span>
                              </div>
                              <div className="flex items-center mt-1 sm:mt-0">
                                <Phone className="h-3 w-3 mr-1" />
                                <span>{member.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Registered: {new Date(team.registrationDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openUpdateModal(team)}
                        className="text-[#0a1f44] hover:text-white p-2 rounded-lg hover:bg-[#0a1f44] transition-all duration-200 border border-[#0a1f44]/20 hover:border-[#0a1f44]"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-600 hover:text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200 border border-red-200 hover:border-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Empty State with improved styling */}
        {filteredTeams.length === 0 && (
          <div className="container mx-auto px-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f44]/20 to-[#152a4e]/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center border-2 border-dashed border-[#0a1f44]/30">
                  <Users className="h-10 w-10 text-[#0a1f44]/60" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1f44] mb-3">No teams found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">There are no teams matching your search criteria. Try adjusting your search filters or check back later.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterCompetition('all')
                  }}
                  className="text-[#0a1f44] hover:text-white border-2 border-[#0a1f44] hover:bg-[#0a1f44] font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <AddTeamModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSave={handleAddTeam}
      />
      
      <UpdateTeamModal
        isOpen={isUpdateModalOpen}
        closeModal={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdateTeam}
        team={selectedTeam}
      />
    </AdminLayout>
  )
}