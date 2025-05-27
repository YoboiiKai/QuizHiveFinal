import { useState, Fragment, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { 
  Save, 
  X,
  School,
  MapPin,
  Users,
  User,
  Mail,
  Phone,
  Info,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  KeyRound,
  UserCircle
} from "lucide-react"

export default function AddTeamModal({ isOpen, closeModal, onSave }) {
  const [newTeam, setNewTeam] = useState({
    name: "",
    school: "",
    competitionId: "",
    competitionName: "",
    location: "",
    members: [
      { id: 1, name: "", role: "Captain", email: "", phone: "" }
    ],
    account: {
      username: "",
      password: "",
      confirmPassword: ""
    },
    registrationDate: new Date().toISOString().split('T')[0]
  })
  
  // Sample competitions data for dropdown
  const competitions = [
    { id: 1, name: "National Science Quiz 2025" },
    { id: 2, name: "Regional Math Challenge" },
    { id: 3, name: "History Trivia Championship" }
  ]

  const addTeamMember = () => {
    const newId = newTeam.members.length > 0 
      ? Math.max(...newTeam.members.map(m => m.id)) + 1 
      : 1
    
    setNewTeam({
      ...newTeam,
      members: [
        ...newTeam.members,
        { id: newId, name: "", role: "Member", email: "", phone: "" }
      ]
    })
  }

  const removeTeamMember = (id) => {
    // Don't allow removing the last member
    if (newTeam.members.length <= 1) return
    
    setNewTeam({
      ...newTeam,
      members: newTeam.members.filter(member => member.id !== id)
    })
  }

  const updateMemberField = (id, field, value) => {
    setNewTeam({
      ...newTeam,
      members: newTeam.members.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    })
  }

  const handleCompetitionChange = (e) => {
    const compId = parseInt(e.target.value)
    const competition = competitions.find(c => c.id === compId)
    
    setNewTeam({
      ...newTeam,
      competitionId: compId,
      competitionName: competition ? competition.name : ""
    })
  }

  const handleSave = () => {
    if (newTeam.name.trim() === "" || newTeam.school.trim() === "" || !newTeam.competitionId) return
    
    // Validate that all members have at least a name and email
    const validMembers = newTeam.members.every(member => 
      member.name.trim() !== "" && member.email.trim() !== ""
    )
    
    if (!validMembers) return
    
    // Validate account credentials
    if (newTeam.account.username.trim() === "" || 
        newTeam.account.password.trim() === "" || 
        newTeam.account.password !== newTeam.account.confirmPassword) {
      return
    }
    
    onSave(newTeam)
    
    // Reset form
    setNewTeam({
      name: "",
      school: "",
      competitionId: "",
      competitionName: "",
      location: "",
      members: [
        { id: 1, name: "", role: "Captain", email: "", phone: "" }
      ],
      account: {
        username: "",
        password: "",
        confirmPassword: ""
      },
      registrationDate: new Date().toISOString().split('T')[0]
    })
    
    closeModal()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-auto max-h-[90vh] rounded-xl bg-white p-0 text-left align-middle shadow-xl transition-all border border-gray-200">
                {/* Modal Header with gradient background */}
                <div className="bg-gradient-to-r from-[#0a1f44] to-[#152a4e] text-white p-6">
                  <div className="flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-xl font-bold">
                      Add New Team
                    </Dialog.Title>
                    <button 
                      onClick={closeModal}
                      className="text-white/80 hover:text-white focus:outline-none transition-colors duration-200 hover:bg-white/10 rounded-full p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-white/80 mt-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Fill in the details to register a new team for a competition
                  </p>
                </div>

                {/* Modal Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  {/* School/Institution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School/Institution <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={newTeam.school}
                        onChange={(e) => setNewTeam({...newTeam, school: e.target.value})}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        placeholder="Enter school or institution name"
                      />
                    </div>
                  </div>
                  
                  {/* Competition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Competition <span className="text-red-500">*</span></label>
                    <select
                      value={newTeam.competitionId}
                      onChange={handleCompetitionChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                    >
                      <option value="">Select a competition</option>
                      {competitions.map((comp) => (
                        <option key={comp.id} value={comp.id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={newTeam.location}
                        onChange={(e) => setNewTeam({...newTeam, location: e.target.value})}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  
                  {/* Account Creation Section */}
                  <div className="md:col-span-2 mt-2">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-5">
                      <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                        <UserCircle className="h-5 w-5 mr-2" />
                        Participant Account
                      </h4>
                      <p className="text-xs text-blue-600 mb-4">
                        Create login credentials for this team. They will use these credentials to access the participant portal.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Username */}
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <UserCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={newTeam.account.username}
                              onChange={(e) => setNewTeam({
                                ...newTeam, 
                                account: {
                                  ...newTeam.account,
                                  username: e.target.value
                                }
                              })}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                              placeholder="Enter username"
                            />
                          </div>
                        </div>
                        
                        {/* Password */}
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              value={newTeam.account.password}
                              onChange={(e) => setNewTeam({
                                ...newTeam, 
                                account: {
                                  ...newTeam.account,
                                  password: e.target.value
                                }
                              })}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                        
                        {/* Confirm Password */}
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <KeyRound className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              value={newTeam.account.confirmPassword}
                              onChange={(e) => setNewTeam({
                                ...newTeam, 
                                account: {
                                  ...newTeam.account,
                                  confirmPassword: e.target.value
                                }
                              })}
                              className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all duration-200 ${
                                newTeam.account.password && newTeam.account.confirmPassword && 
                                newTeam.account.password !== newTeam.account.confirmPassword 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                              placeholder="Confirm password"
                            />
                          </div>
                          {newTeam.account.password && newTeam.account.confirmPassword && 
                           newTeam.account.password !== newTeam.account.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Members Section */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Team Members <span className="text-red-500">*</span></label>
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="text-[#0a1f44] hover:bg-[#0a1f44]/10 p-1.5 rounded-lg transition-colors duration-200 flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Member
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {newTeam.members.map((member, index) => (
                        <div key={member.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-medium text-[#0a1f44]">
                              {member.role === "Captain" ? "Team Captain" : `Team Member ${index}`}
                            </h4>
                            {newTeam.members.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(member.id)}
                                className="text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Member Name */}
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateMemberField(member.id, "name", e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-white transition-all duration-200"
                                placeholder="Full Name"
                              />
                            </div>
                            
                            {/* Member Role */}
                            <div>
                              <select
                                value={member.role}
                                onChange={(e) => updateMemberField(member.id, "role", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-white transition-all duration-200"
                                disabled={index === 0} // First member must be captain
                              >
                                <option value="Captain">Captain</option>
                                <option value="Member">Member</option>
                              </select>
                            </div>
                            
                            {/* Member Email */}
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                value={member.email}
                                onChange={(e) => updateMemberField(member.id, "email", e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-white transition-all duration-200"
                                placeholder="Email Address"
                              />
                            </div>
                            
                            {/* Member Phone */}
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                value={member.phone}
                                onChange={(e) => updateMemberField(member.id, "phone", e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-white transition-all duration-200"
                                placeholder="Phone Number"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {newTeam.members.length < 6 && (
                      <p className="text-xs text-gray-500 mt-2">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        You can add up to 6 members per team
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={newTeam.name.trim() === "" || newTeam.school.trim() === "" || !newTeam.competitionId}
                    className={`bg-[#0a1f44] text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center
                      ${(newTeam.name.trim() === "" || newTeam.school.trim() === "" || !newTeam.competitionId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#152a4e] hover:shadow-md'}`}
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Team
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a1f44]"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}