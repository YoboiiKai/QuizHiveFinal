import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"
import AdminLayout from "../../Layouts/AdminLayout"
import AddQuestionModal from "../../Components/Admin/AddQuestionModal"
import UpdateQuestionModal from "../../Components/Admin/UpdateQuestionModal"
import { Head, router, useForm } from "@inertiajs/react"
import axios from "axios"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText,
  HelpCircle,
  BookOpen,
  X,
  Hexagon,
  Filter,
  ListChecks,
  Clock,
  Tag,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react"

export default function QuestionBank({ questionBanks: initialQuestionBanks = [], categories: initialCategories = [], competitions = [], flash }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedQuestionBank, setSelectedQuestionBank] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [showFlash, setShowFlash] = useState(!!flash?.message)
  const [isLoading, setIsLoading] = useState(false)
  
  // State for questions
  const [questions, setQuestions] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [selectedCompetitionFilter, setSelectedCompetitionFilter] = useState("")
  
  // Grouped questions by competition
  const [groupedQuestions, setGroupedQuestions] = useState({})
  
  // Use data from props - initialize once and don't update in useEffect
  const [questionBanks, setQuestionBanks] = useState(initialQuestionBanks || [])
  const [categories, setCategories] = useState(initialCategories || [])
  
  // Fetch questions from API
  const fetchQuestions = async (page = 1, competitionId = selectedCompetitionFilter) => {
    setQuestionsLoading(true)
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page)
      if (competitionId) params.append('competition_id', competitionId)
      
      const response = await axios.get(`/admin/api/questions?${params.toString()}`)
      setQuestions(response.data.questions)
      setPagination(response.data.pagination)
      
      // Group questions by competition
      const grouped = {}
      response.data.questions.forEach(question => {
        const competitionId = question.competitionId
        const competitionName = question.competitionName
        
        if (!grouped[competitionId]) {
          grouped[competitionId] = {
            id: competitionId,
            name: competitionName,
            questions: []
          }
        }
        
        grouped[competitionId].questions.push(question)
      })
      
      setGroupedQuestions(grouped)
      
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast.error("Failed to load questions")
    } finally {
      setQuestionsLoading(false)
    }
  }
  
  // Initial fetch of questions
  useEffect(() => {
    fetchQuestions()
  }, [])
  
  // Re-fetch questions when competition filter changes
  useEffect(() => {
    fetchQuestions(1, selectedCompetitionFilter)
  }, [selectedCompetitionFilter])
  
  // Handle flash messages with toast notifications
  useEffect(() => {
    // Show success messages
    if (flash?.success) {
      toast.success(flash.success);
    }
    
    // Show error messages
    if (flash?.error) {
      toast.error(flash.error);
    }
    
    // Legacy flash message handling
    if (flash?.message) {
      setShowFlash(true)
      toast.success(flash.message);
      const timer = setTimeout(() => setShowFlash(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [flash])
  // Forms for CRUD operations
  const addForm = useForm({
    competition_name: '',
    description: '',
    categories: [],
    difficulty: 'medium'
  })
  
  const updateForm = useForm({
    id: '',
    competition_name: '',
    description: '',
    categories: [],
    difficulty: 'medium'
  })
  
  const deleteForm = useForm()
  const deleteQuestionForm = useForm() // Separate form for question deletion
  
  // Function to open and close the add question modal
  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => setIsAddModalOpen(false)
  
  // Function to open and close the update question modal
  const closeUpdateModal = () => setIsUpdateModalOpen(false)
  
  // Function to handle adding a new question bank
  const handleAddQuestionBank = () => {
    // Use Inertia.js to send a POST request to the server
    addForm.post('/admin/question-banks', {
      onSuccess: () => {
        setIsAddModalOpen(false);
        addForm.reset();
        // Refresh the question banks data
        router.reload({ only: ['questionBanks'] });
      }
    });
  }    // Function to handle adding a new question
  const handleAddQuestion = (questionData, bankId) => {
    setIsLoading(true);
    
    // Validate required fields
    const errors = {};
    if (!bankId) errors.bankId = 'Please select a competition first';
    if (!questionData.questionText) errors.questionText = 'Question text is required';
    if (!questionData.category) errors.category = 'Category is required';
    if (!questionData.correctAnswer) errors.correctAnswer = 'Please select a correct answer';
    
    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors).join('\n'));
      setIsLoading(false);
      return;
    }
    
    // Format the data to match the server expectations
    const formattedData = {
      competition_id: bankId,
      question_text: questionData.questionText,
      question_type: questionData.questionType,
      category: questionData.category,
      difficulty: questionData.difficulty,
      time_limit: parseInt(questionData.timeLimit) || 30,
      points: parseInt(questionData.points) || 10,
      options: questionData.options,
      explanation: questionData.explanation || '',
      tags: questionData.tags || [],
      correct_answer: questionData.correctAnswer || '',
    };
    
    console.log('Formatted data being sent to server:', formattedData);
    
    // Post to the questions endpoint with preserveScroll to maintain the current page position
    router.post('/admin/questions', formattedData, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setIsLoading(false);
        toast.success('Question added successfully');
        // Refresh questions data
        fetchQuestions();
      },
      onError: (errors) => {
        setIsLoading(false);
        
        console.error('Error response:', errors);
        
        if (errors.errors) {
          // Handle Laravel validation errors
          const errorMessages = Object.values(errors.errors).flat().join('\n');
          toast.error(errorMessages);
        } else if (errors.error) {
          // Handle general error message
          toast.error(errors.error);
        } else {
          // Handle unexpected errors
          toast.error('An unexpected error occurred while adding the question');
        }
      },
      preserveScroll: true
    });
  }  // Function to handle deleting a question
  const handleDeleteQuestion = (questionId) => {
    // Add more robust logging to debug click events
    console.log('handleDeleteQuestion called with ID:', questionId);
    
    if (!questionId) {
      console.error('No question ID provided for deletion');
      toast.error("Unable to delete: Invalid question");
      return;
    }
    
    // Log the current questions state to see if the question exists
    console.log('Current questions:', questions.map(q => q.id));
    
    // Check if a delete operation is already in progress
    if (isLoading) {
      console.warn('Delete operation already in progress, ignoring request');
      toast.error("A delete operation is already in progress");
      return;
    }
    
    // Replace standard confirm with a simple modal dialog
    toast.custom(
      (t) => {
        const handleCancelClick = (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent event bubbling
          toast.dismiss(t.id);
          console.log('Delete canceled for question ID:', questionId);
        };
        
        const handleConfirmClick = (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent event bubbling
          console.log('Confirm delete clicked for question ID:', questionId);
          toast.dismiss(t.id);
          
          try {
            performDelete(questionId);
          } catch (err) {
            console.error('Error in performDelete:', err);
            toast.error(`Error executing delete: ${err.message}`);
            setIsLoading(false);
          }
        };
        
        return (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col p-4`}>
            <div className="flex flex-col gap-3">
              <div className="font-medium text-lg text-red-600">Delete Question</div>
              <div className="font-medium">Are you sure you want to delete this question?</div>
              <div className="text-gray-600 text-sm">This action cannot be undone.</div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClick}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      },
      {
        duration: Infinity,
        position: "top-center"
      }
    );
  };  // Separate function to perform the actual deletion
  const performDelete = (questionId) => {
    console.log('Performing delete for question ID:', questionId);
    if (!questionId) {
      console.error('Cannot delete - missing question ID');
      toast.error('Error: Missing question ID');
      return;
    }
    
    setIsLoading(true);
    
    // Get the CSRF token from the meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    console.log('CSRF Token:', token ? 'Found' : 'Not Found');
    
    try {
      // Create a form for direct submission of DELETE request
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `/admin/questions/${questionId}`;
      form.style.display = 'none';
      
      // Add method and token inputs
      const methodInput = document.createElement('input');
      methodInput.type = 'hidden';
      methodInput.name = '_method';
      methodInput.value = 'DELETE';
      form.appendChild(methodInput);
      
      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = '_token';
      tokenInput.value = token;
      form.appendChild(tokenInput);
      
      // Add form to body, submit, and remove
      document.body.appendChild(form);
      
      console.log('Submitting delete form for question ID:', questionId);
      
      // Use a Promise to handle form submission
      new Promise((resolve) => {
        form.addEventListener('submit', () => {
          console.log('Form submitted');
        });
        
        form.submit();
        
        // We need to reload after form submission
        setTimeout(() => {
          resolve();
        }, 500);
      }).then(() => {
        // Clean up form
        document.body.removeChild(form);
        
        // Check if question still exists
        axios.get(`/admin/api/questions?page=${pagination.current_page}`)
          .then(response => {
            const questions = response.data.questions;
            const exists = questions.some(q => q.id === questionId);
            
            if (!exists) {
              console.log('Question was successfully deleted');
              fetchQuestions(pagination.current_page);
              toast.success('Question deleted successfully');
            } else {
              console.error('Question still exists after delete attempt');
              fallbackDelete(questionId, token);
            }
            
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error checking deletion:', error);
            fallbackDelete(questionId, token);
          });
      });
    } catch (error) {
      console.error('Error in delete process:', error);
      fallbackDelete(questionId, token);
    }
  };
  
  // Fallback delete method using Axios directly
  const fallbackDelete = (questionId, token) => {
    console.log('Using fallback delete method for question ID:', questionId);
    
    // Make direct axios request with comprehensive error handling
    axios.delete(`/admin/questions/${questionId}`, {
      headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => {
      console.log('Axios delete successful:', response);
      fetchQuestions(pagination.current_page);
      setIsLoading(false);
      toast.success('Question deleted successfully');
    })
    .catch(error => {
      console.error('Axios delete error:', error);
      // Try one more approach - Inertia
      tryInertiaDelete(questionId);
    });
  };
  
  // Final attempt using Inertia directly
  const tryInertiaDelete = (questionId) => {
    console.log('Trying Inertia delete for question ID:', questionId);
    
    router.delete(`/admin/questions/${questionId}`, {}, {
      preserveState: false,
      onSuccess: () => {
        console.log('Inertia delete successful');
        fetchQuestions(pagination.current_page);
        setIsLoading(false);
        toast.success('Question deleted successfully');
      },
      onError: (errors) => {
        console.error('Inertia delete error:', errors);
        setIsLoading(false);
        toast.error('Failed to delete question after multiple attempts. Please refresh the page and try again.');
      }
    });
  };
  
  // Function to handle updating question bank
  const handleUpdateQuestionBank = () => {
    // The form data is already set in the component via the useEffect
    
    // Use Inertia.js to send a PUT request to the server
    updateForm.put(`/admin/question-banks/${updateForm.data.id}`, {
      onSuccess: () => {
        setIsUpdateModalOpen(false);
        setSelectedQuestionBank(null);
        // Refresh the question banks data
        router.reload({ only: ['questionBanks'] });
      }
    });
  }
  
  // Function to handle updating questions
  const handleUpdateQuestion = (updatedQuestions) => {
    setIsLoading(true);
    
    // Format the questions data to match the server expectations
    const formattedQuestions = updatedQuestions.map(q => ({
      question_text: q.questionText,
      question_type: q.questionType,
      category: q.category,
      difficulty: q.difficulty,
      time_limit: q.timeLimit,
      points: q.points,
      options: q.options,
      explanation: q.explanation || '',
      tags: q.tags || []
    }));
    
    // Put to the questions endpoint
    router.put(`/admin/questions/${selectedQuestionBank.id}`, { questions: formattedQuestions }, {
      onSuccess: () => {
        setIsUpdateModalOpen(false);
        setSelectedQuestionBank(null);
        // Refresh questions data
        fetchQuestions(pagination.current_page);
        setIsLoading(false);
      },
      onError: (errors) => {
        console.error('Error updating questions:', errors);
        setIsLoading(false);
      }
    });
  }

  const handleDeleteQuestionBank = (id) => {
    // Show toastify confirmation dialog before deleting
    toast((t) => (
      <div className="flex flex-col gap-4">
        <div className="font-medium">Are you sure you want to delete this question bank?</div>
        <div className="text-gray-600 text-sm">All associated questions will be lost. This action cannot be undone.</div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              // Use Inertia.js to send a DELETE request to the server
              deleteForm.delete(`/admin/question-banks/${id}`, {
                onSuccess: () => {
                  // Refresh the question banks data
                  router.reload({ only: ['questionBanks'] });
                  toast.success('Question bank deleted successfully');
                }
              });
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 10000,  // 10 seconds
      style: {
        padding: '16px',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #f1f1f1'
      }
    });
  };
  
  const openUpdateModal = (questionBank) => {
    setSelectedQuestionBank(questionBank)
    // Set the form data for updating
    updateForm.setData({
      id: questionBank.id,
      competition_name: questionBank.competition_name,
      description: questionBank.description,
      categories: questionBank.categories,
      difficulty: questionBank.difficulty
    })
    setIsUpdateModalOpen(true)
  }

  // Filter question banks based on search term
  const filteredQuestionBanks = questionBanks
    .filter(bank => {
      return bank.competition_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             bank.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (Array.isArray(bank.categories) && bank.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())));
    })
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AdminLayout>
      <Head title="Question Banks & Questions" />
      
      {/* Toast Provider is already included in the app */}
      
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
                    <HelpCircle className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  Questions Manager
                </h1>
                <p className="text-white/80 mt-1">Manage and organize your quiz questions</p>
              </div>
              <div>
                <button
                  onClick={openAddModal}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1f44] font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center hover:shadow-lg hover:shadow-yellow-500/20 hover:from-yellow-300 hover:to-yellow-400"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="container mx-auto px-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50/80 transition-all duration-200 hover:bg-white"
                  placeholder="Search questions..."
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
                  value={selectedCompetitionFilter}
                  onChange={(e) => setSelectedCompetitionFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50/80 transition-all duration-200 hover:bg-white"
                >
                  <option value="">All Competitions</option>
                  {competitions.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.title || comp.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {(searchTerm || selectedCompetitionFilter) && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtered results: </span>
                {searchTerm && <span className="ml-1 bg-[#0a1f44]/10 text-[#0a1f44] px-2 py-0.5 rounded-md mr-2">Search: "{searchTerm}"</span>}
                {selectedCompetitionFilter && <span className="ml-1 bg-[#0a1f44]/10 text-[#0a1f44] px-2 py-0.5 rounded-md">Competition: {competitions.find(c => c.id == selectedCompetitionFilter)?.title}</span>}
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCompetitionFilter('');
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

        {/* Questions Cards By Competition */}
        <div className="container mx-auto px-4 mb-6">
          {questionsLoading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-12 flex justify-center items-center">
              <Loader className="h-8 w-8 text-[#0a1f44] animate-spin" />
              <span className="ml-3 text-gray-600">Loading questions...</span>
            </div>
          ) : Object.keys(groupedQuestions).length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {Object.values(groupedQuestions)
                .filter(group => {
                  // Filter groups based on search term
                  if (!searchTerm) return true;
                  return group.questions.some(q => 
                    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.category.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                })
                .map(group => (
                  <div key={group.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 mb-0">
                    {/* Competition Header */}
                    <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-[#0a1f44] to-[#152a4e] text-white rounded-t-xl flex justify-between items-center">
                      <h2 className="text-base font-bold flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-yellow-400" />
                        {group.name}
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-normal">
                          {group.questions.length} questions
                        </span>
                      </h2>
                      <button
                        onClick={() => {
                          openAddModal();
                          // Pre-select this competition in the modal if needed
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white text-xs py-1 px-2 rounded flex items-center transition-colors"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </button>
                    </div>
                    
                    {/* Questions List */}
                    <div className="p-2 max-h-[480px] overflow-y-auto">
                      <div className="divide-y divide-gray-100">
                        {group.questions
                          .filter(question => question.questionText.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(question => (
                            <div key={question.id} className="py-2 first:pt-1 last:pb-1 hover:bg-gray-50/50 transition-colors rounded-lg px-2">
                              <div className="flex justify-between items-start gap-2">
                                {/* Question Info */}
                                <div className="flex-grow">
                                  <div className="flex flex-wrap gap-1 mb-1 items-center">
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium
                                      ${question.questionType === 'multiple-choice' ? 'bg-blue-50 text-blue-700' : 
                                        question.questionType === 'true-false' ? 'bg-purple-50 text-purple-700' :
                                        'bg-amber-50 text-amber-700'}`}>
                                      {question.questionType === 'multiple-choice' ? 'Multiple' : 
                                       question.questionType === 'true-false' ? 'T/F' : 
                                       question.questionType === 'open-ended' ? 'Open' : 
                                       question.questionType}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium
                                      ${question.difficulty === 'easy' ? 'bg-green-50 text-green-700' : 
                                        question.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                        'bg-red-50 text-red-700'}`}>
                                      {question.difficulty.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                                      {question.category}
                                    </span>
                                    <span className="bg-gray-100 text-gray-600 text-[10px] px-1 py-0.5 rounded flex items-center">
                                      {question.points}p
                                    </span>
                                    <span className="bg-gray-100 text-gray-600 text-[10px] px-1 py-0.5 rounded flex items-center">
                                      {question.timeLimit || 30}s
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs text-[#0a1f44] font-medium mb-1 line-clamp-2">
                                    {question.questionText}
                                  </p>
                                  
                                  {/* Answer Display - simplified for card layout */}
                                  <div className="text-[10px] text-gray-600 flex flex-wrap gap-1">
                                    {question.questionType === 'multiple-choice' && Array.isArray(question.options) && (
                                      <>
                                        <span className="text-green-600 font-medium">Answer: </span>
                                        <span className="bg-green-50 text-green-700 border border-green-200 px-1 py-0.5 rounded">
                                          {typeof question.correctAnswer === 'object' ? 
                                            question.correctAnswer?.text : question.correctAnswer}
                                        </span>
                                      </>
                                    )}
                                    
                                    {question.questionType === 'true-false' && (
                                      <>
                                        <span className="text-green-600 font-medium">Answer: </span>
                                        <span className="bg-green-50 text-green-700 border border-green-200 px-1 py-0.5 rounded">
                                          {question.correctAnswer}
                                        </span>
                                      </>
                                    )}
                                    
                                    {question.questionType === 'open-ended' && (
                                      <>
                                        <span className="text-blue-600 font-medium">Answer: </span>
                                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1 py-0.5 rounded max-w-[120px] truncate">
                                          {question.correctAnswer}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                  {/* Actions */}
                                <div className="flex space-x-1 shrink-0 mt-1">
                                  <button 
                                    onClick={() => {
                                      setSelectedQuestionBank({
                                        id: question.id,
                                        questions: [question]
                                      });
                                      setIsUpdateModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50"
                                    aria-label="Edit question"
                                    title="Edit question"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      try {
                                        console.log('Delete button clicked for question:', question.id);
                                        // Add this data-* attribute for debugging
                                        e.currentTarget.setAttribute('data-deleting', 'true');
                                        e.currentTarget.classList.add('opacity-50');
                                        handleDeleteQuestion(question.id);
                                      } catch (err) {
                                        console.error('Error in delete click handler:', err);
                                        toast.error(`Error initiating delete: ${err.message}`);
                                      }
                                    }}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 p-2 rounded cursor-pointer relative z-20"
                                    style={{ minWidth: '32px', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    aria-label="Delete question"
                                    title="Delete question"
                                    data-question-id={question.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      {group.questions.length === 0 && (
                        <div className="py-6 text-center text-gray-500 text-xs">
                          No questions match your search criteria.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f44]/20 to-[#152a4e]/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center border-2 border-dashed border-[#0a1f44]/30">
                  <HelpCircle className="h-8 w-8 text-[#0a1f44]/60" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0a1f44] mb-2">No questions found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {selectedCompetitionFilter
                  ? "No questions found for the selected competition."
                  : "There are no questions available. Add your first question to get started."}
              </p>
              <button
                onClick={openAddModal}
                className="bg-[#0a1f44] text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center mx-auto hover:bg-[#152a4e]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add First Question
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.last_page > 1 && !questionsLoading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> questions
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => fetchQuestions(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white mr-3
                    ${pagination.current_page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => fetchQuestions(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white
                    ${pagination.current_page === pagination.last_page ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Question Banks Section - REMOVED */}
      </div>
      
      {/* Add loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1f44]"></div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        closeModal={closeAddModal}
        onSave={handleAddQuestion}
        categories={categories}
        isLoading={isLoading}
        questionBanks={competitions}
      />
      <UpdateQuestionModal
        isOpen={isUpdateModalOpen}
        closeModal={closeUpdateModal}
        onUpdate={handleUpdateQuestion}
        categories={categories}
        questions={selectedQuestionBank?.questions || []}
        isLoading={isLoading}
      />
    </AdminLayout>
  )
}