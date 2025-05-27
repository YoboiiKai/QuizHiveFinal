import { useState, Fragment, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { 
  Save, 
  X,
  HelpCircle,
  Clock,
  Tag,
  BookOpen,
  BarChart,
  Info,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  Edit,
  Loader2
} from "lucide-react"

export default function UpdateQuestionModal({ isOpen, closeModal, onUpdate, categories, questions: initialQuestions = [], isLoading, questionBanks }) {
  // Initial empty question template
  const emptyQuestion = {
    questionText: "",
    questionType: "multiple-choice",
    category: "",
    difficulty: "medium",
    timeLimit: 30,
    points: 10,
    options: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
      { id: 3, text: "", isCorrect: false },
      { id: 4, text: "", isCorrect: false }
    ],
    explanation: ""
  }
  
  // Ensure initialQuestions is always a valid array
  const safeInitialQuestions = Array.isArray(initialQuestions) ? initialQuestions : [];
  
  // State for multiple questions - ensure it's always an array with at least one question
  const [questions, setQuestions] = useState(
    safeInitialQuestions.length > 0 ? 
      safeInitialQuestions.map(q => ({ ...q })) : 
      [{ ...emptyQuestion }]
  )
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [errors, setErrors] = useState({})
  const [selectedBankId, setSelectedBankId] = useState("")
  const [bankError, setBankError] = useState("")
  
  // Load questions when modal opens or initialQuestions changes
  useEffect(() => {
    // Reset state when modal opens
    if (!isOpen) {
      setQuestions([{ ...emptyQuestion }])  // Initialize with an empty question instead of empty array
      setActiveQuestionIndex(0)
      setErrors({})
      setSelectedBankId("")
      return
    }
    
    // Check if initialQuestions is an array and has at least one question
    if (Array.isArray(initialQuestions) && initialQuestions.length > 0) {
      // Deep copy each question to avoid modifying original
      setQuestions(initialQuestions.map(q => ({ ...q })))
      setActiveQuestionIndex(0)
      setErrors({})
      // Set the selected bank ID if the first question has a competition_id
      const firstQuestion = initialQuestions[0]
      if (firstQuestion?.competitionId) {
        setSelectedBankId(firstQuestion.competitionId.toString())
      } else if (firstQuestion?.competition_id) {
        setSelectedBankId(firstQuestion.competition_id.toString())
      }
    } else {
      // Set a single empty question as default
      setQuestions([{ ...emptyQuestion }])
      setActiveQuestionIndex(0)
      setErrors({})
    }
  }, [initialQuestions, isOpen])
  
  // Get the currently active question with safety checks
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const questionData = (safeQuestions[activeQuestionIndex] || emptyQuestion)
  
  // Function to update the active question
  const updateActiveQuestion = (updates) => {
    // Ensure questions is always an array
    const safeQuestions = questions || [{ ...emptyQuestion }];
    
    setQuestions(safeQuestions.map((q, index) => 
      index === activeQuestionIndex ? { ...q, ...updates } : q
    ))
    // Clear errors for the updated field
    if (errors[activeQuestionIndex]) {
      setErrors({
        ...errors,
        [activeQuestionIndex]: {
          ...errors[activeQuestionIndex],
          [Object.keys(updates)[0]]: undefined
        }
      })
    }
  }
  
  const validateQuestion = (question = {}) => {
    const newErrors = {}
    
    if (!question.questionText?.trim()) {
      newErrors.questionText = 'Question text is required'
    }
    
    if (!question.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!question.timeLimit || question.timeLimit < 5 || question.timeLimit > 300) {
      newErrors.timeLimit = 'Time limit must be between 5 and 300 seconds'
    }
    
    if (!question.points || question.points < 1 || question.points > 100) {
      newErrors.points = 'Points must be between 1 and 100'
    }

    // Ensure options array exists
    const options = question.options || [];
    
    // Validate options based on question type
    if (question.questionType === 'true-false') {
      // For true/false questions, only validate presence of correct answer
      const hasCorrectOption = options.some(option => option?.isCorrect)
      if (!hasCorrectOption) {
        newErrors.options = 'Please select either True or False as the correct answer'
      }
    } else {
      // For multiple choice questions
      const hasCorrectOption = options.some(option => option?.isCorrect)
      if (!hasCorrectOption) {
        newErrors.options = 'At least one correct answer is required'
      }
      
      const hasEmptyOptions = options.some(option => !option?.text?.trim())
      if (hasEmptyOptions) {
        newErrors.options = 'All options must have text'
      }
    }

    // Ensure correctAnswer matches the selected option
    const correctOption = options.find(option => option?.isCorrect)
    if (correctOption?.text && correctOption.text !== question.correctAnswer) {
      question.correctAnswer = correctOption.text
    }
    
    return newErrors
  }
  
  const handleOptionChange = (id, field, value) => {
    if (!questionData || !questionData.options) {
      // If questionData is undefined or has no options, create a default structure
      const defaultOptions = [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false }
      ];
      updateActiveQuestion({ 
        options: defaultOptions,
        correctAnswer: ""
      });
      return;
    }
    
    let updatedOptions;
    let correctAnswer = questionData.correctAnswer || '';

    // For multiple-choice (single answer) questions
    if (field === "isCorrect" && questionData.questionType === "multiple-choice") {
      // If deselecting the currently selected option, allow it
      if (!value) {
        updatedOptions = questionData.options.map(option => {
          if (option?.id === id) {
            return { ...option, isCorrect: false }
          }
          return option || { id: Math.random(), text: "", isCorrect: false }
        });
        correctAnswer = ''; // Clear correct answer when deselecting
      } else {
        // If selecting a new option, deselect all others
        updatedOptions = questionData.options.map(option => {
          const newIsCorrect = option?.id === id;
          return { ...option, isCorrect: newIsCorrect }
        });
        // Set correct answer to the selected option's text
        correctAnswer = updatedOptions.find(o => o?.id === id)?.text || '';
      }
    } else if (field === "text") {
      // Handle text change
      updatedOptions = questionData.options.map(option => {
        if (option?.id === id) {
          const newOption = { ...option, text: value };
          // If this is the correct option, update correctAnswer too
          if (option?.isCorrect) {
            correctAnswer = value;
          }
          return newOption;
        }
        return option || { id: Math.random(), text: "", isCorrect: false };
      });
    } else {
      // For all other cases (multiple answer questions)
      updatedOptions = questionData.options.map(option => {
        if (option?.id === id) {
          return { ...option, [field]: value }
        }
        return option || { id: Math.random(), text: "", isCorrect: false };
      });
    }
    
    updateActiveQuestion({ 
      options: updatedOptions,
      correctAnswer
    })
  }

  const addOption = () => {
    // Handle the case when questionData or options is undefined
    if (!questionData || !questionData.options) {
      const defaultOptions = [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false }
      ];
      updateActiveQuestion({ options: [...defaultOptions, { id: 3, text: "", isCorrect: false }] });
      return;
    }
    
    const newId = questionData.options.length > 0 ? 
      Math.max(...questionData.options.map((o) => o?.id || 0)) + 1 : 1
    
    const updatedOptions = [...questionData.options, { id: newId, text: "", isCorrect: false }]
    updateActiveQuestion({ options: updatedOptions })
  }

  const removeOption = (id) => {
    if (!questionData || !questionData.options) return;
    
    if (questionData.options.length > 2) {
      const updatedOptions = questionData.options.filter((option) => option?.id !== id)
      updateActiveQuestion({ options: updatedOptions })
    }
  }

  // Tags functionality removed
  
  // Add a new question to the list
  const addNewQuestion = () => {
    const currentQuestions = questions || []
    const newId = currentQuestions.length > 0 ? 
      Math.max(...currentQuestions.map((q) => q?.id || 0)) + 1 : 1
    
    setQuestions([...currentQuestions, { ...emptyQuestion, id: newId }])
    setActiveQuestionIndex(currentQuestions.length) // Set focus to the new question
  }
  
  // Remove a question from the list
  const removeQuestion = (index) => {
    // Safely check the questions array
    const safeQuestions = questions || [];
    
    if (safeQuestions.length > 1) {
      const newQuestions = safeQuestions.filter((_, i) => i !== index)
      
      // Ensure we always have at least one question
      if (newQuestions.length === 0) {
        setQuestions([{ ...emptyQuestion }]);
        setActiveQuestionIndex(0);
      } else {
        setQuestions(newQuestions);
        
        // Adjust active index if needed
        if (activeQuestionIndex >= newQuestions.length) {
          setActiveQuestionIndex(newQuestions.length - 1);
        } else if (activeQuestionIndex === index) {
          // If we're removing the active question, select the previous one
          setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
        }
      }
    }
  }

  const handleUpdate = () => {
    // Validate bank selection
    if (!selectedBankId) {
      setBankError("Please select a competition (question bank)")
      return
    }
    
    // Validate all questions
    const allErrors = {}
    let hasErrors = false
    
    // Ensure questions is an array before calling forEach
    const safeQuestions = questions || [];
    
    safeQuestions.forEach((question, index) => {
      const questionErrors = validateQuestion(question || emptyQuestion)
      if (Object.keys(questionErrors).length > 0) {
        allErrors[index] = questionErrors
        hasErrors = true
      }
    })
    
    if (hasErrors) {
      setErrors(allErrors)
      return
    }
    
    // Update all valid questions with the selected competition ID
    const updatedQuestions = safeQuestions.map(question => ({
      ...(question || emptyQuestion),
      competition_id: parseInt(selectedBankId),
      // Ensure critical properties have default values to prevent undefined errors
      questionText: question?.questionText || "",
      questionType: question?.questionType || "multiple-choice",
      category: question?.category || "",
      difficulty: question?.difficulty || "medium",
      timeLimit: question?.timeLimit || 30,
      points: question?.points || 10,
      options: question?.options || [],
      explanation: question?.explanation || "",
      correctAnswer: question?.correctAnswer || ""
    }))
    
    // Update all valid questions
    onUpdate(updatedQuestions)
  }

  // Handle True/False question type
  useEffect(() => {
    // Make sure we have valid question data and options before trying to update
    if (questionData && questionData.questionType === "true-false") {
      // Create default true/false options with existing correct selections if available
      const existingOptions = questionData.options || [];
      const updatedOptions = [
        { id: 1, text: "True", isCorrect: existingOptions.find(o => o?.id === 1)?.isCorrect || false },
        { id: 2, text: "False", isCorrect: existingOptions.find(o => o?.id === 2)?.isCorrect || false }
      ]
      updateActiveQuestion({ options: updatedOptions })
    }
  }, [questionData?.questionType])

  // If no questions are loaded, don't render the modal content
  if (!isOpen || !questions?.length) {
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Loading questions...
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
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
                    <Dialog.Title as="h3" className="text-xl font-bold flex items-center">
                      <Edit className="h-5 w-5 mr-2 text-yellow-400" />
                      Update Questions
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
                    Edit and update your quiz questions
                  </p>
                  
                  {/* Question Navigation Tabs */}
                  <div className="mt-4 flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {questions?.map((q, index) => (
                      <button
                        key={q?.id || index}
                        onClick={() => setActiveQuestionIndex(index)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap flex items-center
                          ${activeQuestionIndex === index 
                            ? 'bg-white/20 text-white' 
                            : 'bg-transparent text-white/60 hover:text-white/80 hover:bg-white/10'}`}
                      >
                        Question {index + 1}
                        {questions?.length > 1 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              removeQuestion(index)
                            }}
                            className="ml-2 text-white/60 hover:text-white focus:outline-none cursor-pointer"
                            disabled={questions.length <= 1}
                            tabIndex={0}
                            role="button"
                            aria-label="Remove question"
                          >
                            <X className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={addNewQuestion}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 text-white/80 hover:bg-white/20 hover:text-white flex items-center"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Competition (Question Bank) Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-[#0a1f44]" />
                      Competition (Question Bank)
                    </label>
                    <select
                      value={selectedBankId}
                      onChange={e => {
                        setSelectedBankId(e.target.value)
                        setBankError("")
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                    >
                      <option value="">Select Competition</option>
                      {questionBanks && questionBanks.map(bank => (
                        <option key={bank.id} value={bank.id}>{bank.competitionName || bank.title || bank.name}</option>
                      ))}
                    </select>
                    {bankError && <div className="text-red-600 text-sm mt-1">{bankError}</div>}
                  </div>

                  {/* Question Type and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-[#0a1f44]" />
                        Question Type
                      </label>
                      <select
                        value={questionData.questionType}
                        onChange={(e) => updateActiveQuestion({ questionType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      >
                        <option value="multiple-choice">Multiple Choice (Single Answer)</option>
                        <option value="multiple-answer">Multiple Choice (Multiple Answers)</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-[#0a1f44]" />
                        Difficulty
                      </label>
                      <select
                        value={questionData.difficulty}
                        onChange={(e) => updateActiveQuestion({ difficulty: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-[#0a1f44]" />
                      Question Text
                    </label>
                    <div className="relative">
                      <textarea
                        value={questionData.questionText}
                        onChange={(e) => updateActiveQuestion({ questionText: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        placeholder="Enter your question here..."
                      />
                      <div className="absolute right-3 bottom-3 text-gray-400 text-xs">
                        {questionData?.questionText ? questionData.questionText.length : 0} characters
                      </div>
                    </div>
                  </div>

                  {/* Category, Time Limit, Points */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-[#0a1f44]" />
                        Category
                      </label>
                      <select
                        value={questionData.category}
                        onChange={(e) => updateActiveQuestion({ category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      >
                        <option value="">Select Category</option>
                        <option value="Science">Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        <option value="Literature">Literature</option>
                        <option value="Arts">Arts</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                        <option value="General Knowledge">General Knowledge</option>
                        <option value="Current Events">Current Events</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[#0a1f44]" />
                        Time Limit (seconds)
                      </label>
                      <input
                        type="number"
                        value={questionData.timeLimit}
                        onChange={(e) => updateActiveQuestion({ timeLimit: parseInt(e.target.value) })}
                        min={5}
                        max={300}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-[#0a1f44]" />
                        Points
                      </label>
                      <input
                        type="number"
                        value={questionData.points}
                        onChange={(e) => updateActiveQuestion({ points: parseInt(e.target.value) })}
                        min={1}
                        max={100}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      />
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Answer Options
                    </h3>
                    
                    {questionData?.questionType === "true-false" ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="true-option"
                            name="true-false"
                            checked={questionData?.options?.[0]?.isCorrect || false}
                            onChange={() => {
                              updateActiveQuestion({
                                options: [
                                  { id: 1, text: "True", isCorrect: true },
                                  { id: 2, text: "False", isCorrect: false }
                                ]
                              })
                            }}
                            className="h-4 w-4 text-[#0a1f44] focus:ring-[#0a1f44]"
                          />
                          <label htmlFor="true-option" className="text-gray-700">True</label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="false-option"
                            name="true-false"
                            checked={questionData?.options?.[1]?.isCorrect || false}
                            onChange={() => {
                              updateActiveQuestion({
                                options: [
                                  { id: 1, text: "True", isCorrect: false },
                                  { id: 2, text: "False", isCorrect: true }
                                ]
                              })
                            }}
                            className="h-4 w-4 text-[#0a1f44] focus:ring-[#0a1f44]"
                          />
                          <label htmlFor="false-option" className="text-gray-700">False</label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questionData?.options?.map((option) => (
                          <div key={option?.id || Math.random()} className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <input
                                type={questionData?.questionType === "multiple-answer" ? "checkbox" : "radio"}
                                name="answer-option"
                                checked={option?.isCorrect || false}
                                onChange={(e) => handleOptionChange(option?.id, "isCorrect", e.target.checked)}
                                className="h-4 w-4 text-[#0a1f44] focus:ring-[#0a1f44]"
                              />
                            </div>
                            <div className="flex-grow">
                              <input
                                type="text"
                                value={option?.text || ""}
                                onChange={(e) => handleOptionChange(option?.id, "text", e.target.value)}
                                placeholder={`Option ${option?.id || ""}`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-white/90"
                              />
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => removeOption(option?.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                disabled={(questionData?.options?.length || 0) <= 2}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {questionData.questionType !== "true-false" && (
                          <button
                            type="button"
                            onClick={addOption}
                            className="mt-2 inline-flex items-center px-4 py-2 border border-[#0a1f44]/20 rounded-lg text-sm font-medium text-[#0a1f44] bg-white hover:bg-[#0a1f44]/5 transition-colors duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-[#0a1f44]" />
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={questionData.explanation}
                      onChange={(e) => updateActiveQuestion({ explanation: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      placeholder="Explain why the correct answer is correct..."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row-reverse sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      disabled={isLoading}
                      className={`bg-[#0a1f44] text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#152a4e] hover:shadow-md'}`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Update Questions
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a1f44]"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium">{questions?.length || 0}</span>
                      <span className="ml-1">question{(questions?.length || 0) !== 1 ? 's' : ''}</span>
                      <span className="mx-2">•</span>
                      <span>Question {activeQuestionIndex + 1} of {questions?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Add error messages */}
                {errors && typeof errors === 'object' && errors[activeQuestionIndex] && Object.keys(errors[activeQuestionIndex]).length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {errors[activeQuestionIndex] && typeof errors[activeQuestionIndex] === 'object' && 
                        Object.entries(errors[activeQuestionIndex]).map(([field, message]) => (
                          <li key={field}>{message}</li>
                        ))
                      }
                    </ul>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}