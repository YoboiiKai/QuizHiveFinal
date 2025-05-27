import { useState, useEffect } from "react"
import AdminLayout from "../../Layouts/AdminLayout"
import { Head, useForm, router } from "@inertiajs/react"
import AddCompetitionModal from "@/Components/Admin/AddCompetetionModal"
import UpdateCompetitionModal from "@/Components/Admin/UpdateCompetition"
import toast, { Toaster } from "react-hot-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar, 
  Users, 
  Trophy, 
  MapPin,
  X,
  ChevronDown,
  Hexagon,
  Filter,
  ArrowUpDown,
  Award,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export default function AddCompetetion({ competitions: initialCompetitions = [], flash }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCompetition')
       const parsed = saved ? JSON.parse(saved) : null
      // If we have saved competition data, initialize the modal
      if (parsed) {
        setTimeout(() => {
          setIsUpdateModalOpen(true)
          updateForm.setData({
            id: parsed.id,
            title: parsed.title,
            description: parsed.description,
            date: parsed.date,
            location: parsed.location,
            teams: parsed.teams,
            rounds: parsed.rounds,
            code: parsed.code
          })
        }, 0)
      }
      return parsed
    }
    return null
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [showFlash, setShowFlash] = useState(false) // We're using toast notifications instead
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Show toast notification on initial load if there's a flash message
  useEffect(() => {
    if (flash?.message) {
      if (flash.type === 'success') {
        toast.success(flash.message, {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
            border: '1px solid #10B981',
            padding: '16px',
          },
        });
      } else if (flash.type === 'error') {
        toast.error(flash.message, {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
            border: '1px solid #EF4444',
            padding: '16px',
          },
        });
      }
    }
  }, [flash])
  
  const [competitions, setCompetitions] = useState(initialCompetitions || [])
  
  // Validate selected competition exists in current list
  useEffect(() => {
    if (selectedCompetition && !competitions.find(c => c.id === selectedCompetition.id)) {
      setSelectedCompetition(null)
      localStorage.removeItem('selectedCompetition')
    }
  }, [competitions])

  // This useEffect will run whenever initialCompetitions or page props change
  useEffect(() => {
    if (JSON.stringify(competitions) !== JSON.stringify(initialCompetitions)) {
      setCompetitions(initialCompetitions || []);
    }
    
    // Check if we have a saved competition in localStorage
    const savedComp = localStorage.getItem('selectedCompetition');
    if (savedComp && !selectedCompetition) {
      const parsed = JSON.parse(savedComp);
      // Fetch the fresh data for this competition from the server
      router.get(`/admin/competitions/${parsed.id}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          const freshData = page.props.competition;
          if (freshData) {
            setSelectedCompetition(freshData);
            setIsUpdateModalOpen(true);
            updateForm.setData({
              id: freshData.id,
              title: freshData.title,
              description: freshData.description,
              date: freshData.date,
              location: freshData.location,
              teams: freshData.teams,
              rounds: freshData.rounds,
              code: freshData.code
            });
          } else {
            // Competition no longer exists
            localStorage.removeItem('selectedCompetition');
          }
        },
        onError: () => {
          // Handle error by removing stale data
          localStorage.removeItem('selectedCompetition');
        }
      });
    }
  }, [initialCompetitions]);
  
  // Get access to the Inertia page object to detect data from redirect flashes
  const page = router.page;
  
  // Handle new competition from server
  useEffect(() => {
    const newCompetition = page?.props?.newCompetition;
    if (newCompetition) {
      console.log('New competition received from server:', newCompetition);
      setCompetitions(prevCompetitions => {
        // Check if this competition is already in the array (by id or temp id)
        const exists = prevCompetitions.some(comp => comp.id === newCompetition.id);
        if (!exists) {
          return [newCompetition, ...prevCompetitions];
        }
        return prevCompetitions;
      });
    }
  }, [page?.props?.newCompetition]);
  
  // Handle updated competition from server
  useEffect(() => {
    const updatedCompetition = page?.props?.updatedCompetition;
    if (updatedCompetition) {
      console.log('Updated competition received from server:', updatedCompetition);
      setCompetitions(prevCompetitions => 
        prevCompetitions.map(comp => 
          comp.id === updatedCompetition.id ? updatedCompetition : comp
        )
      );
    }
  }, [page?.props?.updatedCompetition]);
  
  // Handle deleted competition from server
  useEffect(() => {
    const deletedId = page?.props?.deletedCompetitionId;
    if (deletedId) {
      console.log('Deleted competition ID received from server:', deletedId);
      setCompetitions(prevCompetitions => 
        prevCompetitions.filter(comp => comp.id !== deletedId)
      );
    }
  }, [page?.props?.deletedCompetitionId])
  
  const filterAndSortCompetitions = async () => {
    try {
      // Use the API endpoint to get competitions
      const response = await router.get('/api/competitions', {}, {
        preserveState: true,
        preserveScroll: true
      });
      
      let filtered = competitions;
      
      // Apply client-side filtering if search term exists
      if (searchTerm) {
        filtered = competitions.filter(comp => {
          if (!comp) return false;
          
          const title = (comp.title || '').toLowerCase();
          const description = (comp.description || '').toLowerCase();
          const location = (comp.location || '').toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          return title.includes(searchLower) || 
                 description.includes(searchLower) || 
                 location.includes(searchLower);
        });
      }
      
      // Sort by creation date
      return filtered.sort((a, b) => {
        if (!a || !b) return 0;
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error loading competitions:', error);
      toast.error('Failed to load competitions');
      return competitions;
    }
  };

  // Call filterAndSortCompetitions and update state
  const filteredCompetitions = competitions
    .filter(comp => {
      if (!searchTerm || !comp) return true;
      
      const title = (comp.title || '').toLowerCase();
      const description = (comp.description || '').toLowerCase();
      const location = (comp.location || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return title.includes(searchLower) || 
             description.includes(searchLower) || 
             location.includes(searchLower);
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB - dateA;
    });

  // Form for adding a new competition
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: "",
    date: "",
    location: "",
    teams: 0,
    rounds: 0,
    code: ""
  });

  // Form for updating a competition
  const updateForm = useForm({
    id: "",
    title: "",
    description: "",
    date: "",
    location: "",
    teams: 0,
    rounds: 0,
    code: ""
  });

  // Form for deleting a competition
  const deleteForm = useForm();

  // Modal close handlers with proper state cleanup
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    reset();
  }

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCompetition(null); // This will trigger localStorage cleanup via useEffect
    updateForm.reset();
  }

  const handleAddCompetition = () => {
    // Create a temporary competition object from the form data
    const tempCompetition = {
      id: `temp-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      teams: data.teams,
      rounds: data.rounds,
      code: data.code,
      user_id: initialCompetitions[0]?.user_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Show loading toast
    const loadingToast = toast.loading('Adding competition...');
    
    // Update the UI immediately for better UX
    setCompetitions(prevCompetitions => [tempCompetition, ...prevCompetitions]);
    
    // Close the modal right away
    setIsAddModalOpen(false);
    
    // Send the request to the server using Inertia
    post('/admin/competitions', {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Competition added successfully');
        reset();
        
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success('Competition added successfully', {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
          },
        });
        
        // The new competition will be handled by the useEffect watching for newCompetition in page props
      },
      onError: (errors) => {
        console.error('Error adding competition:', errors);
        
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error('Failed to add competition', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
          },
        });
        
        // Remove the temporary competition if there was an error
        setCompetitions(prevCompetitions => 
          prevCompetitions.filter(comp => comp.id !== tempCompetition.id)
        );
        
        // Reopen the modal so the user can fix the errors
        setIsAddModalOpen(true);
      }
    });
  }

  const handleUpdateCompetition = () => {
    // Store current competition data to revert if needed
    const originalCompetition = competitions.find(comp => comp.id === updateForm.data.id);
    
    // Show loading toast
    const loadingToast = toast.loading('Updating competition...');
    
    // Update the local state immediately for a responsive UI
    setCompetitions(prevCompetitions => 
      prevCompetitions.map(comp => 
        comp.id === updateForm.data.id ? { 
          ...comp, 
          ...updateForm.data,
          updated_at: new Date().toISOString() 
        } : comp
      )
    );
    
    // Close the modal immediately for better UX
    setIsUpdateModalOpen(false);
    setSelectedCompetition(null);
    
    // Send the request to the server using Inertia
    updateForm.put(`/admin/competitions/${updateForm.data.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Competition update request sent successfully');
        
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success('Competition updated successfully', {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
          },
        });
        
        // The updated competition will be handled by the useEffect watching for updatedCompetition in page props
      },
      onError: (errors) => {
        console.error('Error updating competition:', errors);
        
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error('Failed to update competition', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
          },
        });
        
        // Revert to the original competition data
        if (originalCompetition) {
          setCompetitions(prevCompetitions => 
            prevCompetitions.map(comp => 
              comp.id === updateForm.data.id ? originalCompetition : comp
            )
          );
        }
        
        // Reopen the modal so the user can fix the errors
        setSelectedCompetition(updateForm.data);
        setIsUpdateModalOpen(true);
      }
    });
  }

  const handleDeleteCompetition = (id) => {
    // Find the competition to delete
    const competitionToDelete = competitions.find(comp => comp.id === id);
    
    if (!competitionToDelete) return;
    
    // Create a custom modal dialog instead of using toast
    // First, create a container for the modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center';
    modalContainer.style.animation = 'fadeIn 0.2s ease-out';
    
    // Create keyframes for animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden';
    modalContent.style.animation = 'slideIn 0.3s ease-out';
    
    // Create the modal HTML structure
    modalContent.innerHTML = `
      <div class="p-6 text-center">
        <div class="flex flex-col items-center justify-center space-y-3 mb-4">
          <div class="p-3 bg-red-100 rounded-full inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-red-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Delete Competition</h3>
        </div>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <span class="font-medium">"${competitionToDelete.title}"</span>?<br>
          This action cannot be undone.
        </p>
        <div class="flex justify-center space-x-3">
          <button id="cancelDelete" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button id="confirmDelete" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </div>
    `;
    
    // Append the modal to the container and the container to the body
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle the cancel button click
    const cancelButton = modalContent.querySelector('#cancelDelete');
    cancelButton.addEventListener('click', () => {
      // Restore body scrolling
      document.body.style.overflow = '';
      // Remove the modal and style
      modalContainer.remove();
      style.remove();
    });
    
    // Handle the confirm button click
    const confirmButton = modalContent.querySelector('#confirmDelete');
    confirmButton.addEventListener('click', () => {
      // Restore body scrolling
      document.body.style.overflow = '';
      // Remove the modal and style
      modalContainer.remove();
      style.remove();
      // Call the delete function
      confirmDeleteCompetition(id, competitionToDelete);
    });
    
    // Close the modal when clicking outside of it
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        // Restore body scrolling
        document.body.style.overflow = '';
        // Remove the modal and style
        modalContainer.remove();
        style.remove();
      }
    });
  }
  
  // Function to confirm and process the deletion
  const confirmDeleteCompetition = (id, competitionToDelete) => {
    // Show loading toast
    const loadingToast = toast.loading('Deleting competition...');
    
    // Remove from UI immediately for better user experience
    setCompetitions(prevCompetitions => 
      prevCompetitions.filter(comp => comp.id !== id)
    );
    
    // Send the delete request to the server using Inertia
    deleteForm.delete(`/admin/competitions/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Competition delete request sent successfully');
        
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success('Competition deleted successfully', {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
          },
        });
        
        // The deleted competition will be handled by the useEffect watching for deletedCompetitionId in page props
      },
      onError: (errors) => {
        console.error('Error deleting competition:', errors);
        
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error('Failed to delete competition', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
          },
        });
        
        // If there was an error, restore the deleted competition
        if (competitionToDelete) {
          setCompetitions(prevCompetitions => [...prevCompetitions, competitionToDelete]);
        } else {
          // If we can't restore it, reload the page
          router.reload();
        }
      }
    });
  }
  
  const openUpdateModal = (competition) => {
    setSelectedCompetition(competition)
    setIsUpdateModalOpen(true)
  }

  // Sync selectedCompetition with localStorage
  useEffect(() => {
    const savedComp = localStorage.getItem('selectedCompetition');
    const savedCompString = savedComp ? JSON.stringify(JSON.parse(savedComp)) : null;
    const selectedCompString = selectedCompetition ? JSON.stringify(selectedCompetition) : null;
    
    if (savedCompString !== selectedCompString) {
      if (selectedCompetition) {
        localStorage.setItem('selectedCompetition', JSON.stringify(selectedCompetition));
      } else {
        localStorage.removeItem('selectedCompetition');
      }
    }
  }, [selectedCompetition])

  return (
    <AdminLayout>
      <Head title="Competitions" />
      
      {/* Toaster component to render toast notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              border: '1px solid #10B981',
              padding: '16px',
            },
          },
          error: {
            duration: 4000,
            style: {
              border: '1px solid #EF4444',
              padding: '16px',
            },
          },
        }}
      />
      
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
        <div className={`sticky top-0 z-30 transition-all duration-300  ${scrolled ? "bg-[#0a1f44]/95 shadow-lg" : "bg-gradient-to-r from-[#0a1f44] to-[#152a4e]"} text-white mb-6 py-6 px-6 rounded-2xl`}>
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <div className="relative mr-3">
                    <Hexagon className="h-8 w-8 text-yellow-400" fill="#0a1f44" />
                    <Trophy className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  Competitions
                </h1>
                <p className="text-white/80 mt-1">Manage and organize your quiz competitions</p>
              </div>
              <div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1f44] font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center hover:shadow-lg hover:shadow-yellow-500/20 hover:from-yellow-300 hover:to-yellow-400"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Competition
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
                  placeholder="Search competitions..."
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
            </div>
            {searchTerm && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtered results: </span>
                <span className="ml-1 bg-[#0a1f44]/10 text-[#0a1f44] px-2 py-0.5 rounded-md mr-2">Search: "{searchTerm}"</span>
                <button 
                  onClick={() => {
                    setSearchTerm('')
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

        {/* Competitions Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map(competition => (
              <div key={competition.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl group hover:translate-y-[-5px]">
                {/* Card Header */}
                <div className="p-4 bg-[#0a1f44] text-white h-16 flex items-center">
                  <h2 className="text-lg font-bold line-clamp-1 flex items-center w-full">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                    {competition.title}
                  </h2>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-5 line-clamp-2">{competition.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{competition.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      <span className="truncate">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      <span>{competition.teams} Teams</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                      <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{competition.rounds} Rounds</span>
                    </div>
                  </div>
                  
                  {competition.code && (
                    <div className="mb-5 p-3 bg-[#0a1f44]/5 rounded-lg border border-[#0a1f44]/10">
                      <div className="text-xs font-medium text-[#0a1f44] mb-1">Competition Code</div>
                      <div className="font-mono text-sm bg-white p-2 rounded border border-gray-200 text-center">
                        {competition.code}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-400 flex items-center">
                      <Hexagon className="h-3 w-3 mr-1 text-[#0a1f44]/40" />
                      ID: #{competition.id}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openUpdateModal(competition)}
                        className="text-[#0a1f44] hover:text-white p-2 rounded-lg hover:bg-[#0a1f44] transition-all duration-200 border border-[#0a1f44]/20 hover:border-[#0a1f44]"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCompetition(competition.id)}
                        className="text-red-600 hover:text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200 border border-red-200 hover:border-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Empty State with improved styling */}
        {filteredCompetitions.length === 0 && (
          <div className="container mx-auto px-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f44]/20 to-[#152a4e]/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center border-2 border-dashed border-[#0a1f44]/30">
                  <Trophy className="h-10 w-10 text-[#0a1f44]/60" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1f44] mb-3">No competitions found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">There are no competitions matching your current search criteria. Try adjusting your filters or create a new competition.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('')
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
      
      {/* Using React Hot Toast instead of flash messages */}
      
      {/* Modals */}
      <AddCompetitionModal
        isOpen={isAddModalOpen}
        closeModal={handleCloseAddModal}
        onSave={handleAddCompetition}
        form={{
          data,
          setData,
          errors,
          processing
        }}
      />
      
      <UpdateCompetitionModal
        isOpen={isUpdateModalOpen}
        closeModal={handleCloseUpdateModal}
        onUpdate={handleUpdateCompetition}
        competition={selectedCompetition}
        form={updateForm}
      />
    </AdminLayout>
  )
}
