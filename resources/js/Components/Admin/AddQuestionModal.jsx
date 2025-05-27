import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HelpCircle, X, Plus, Check, Trash2, AlertCircle, Save, Loader2, BookOpen, BarChart, Tag, Clock, Info } from 'lucide-react';

export default function AddQuestionModal({ isOpen, closeModal, onSave, categories, isLoading, questionBanks }) {
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [errors, setErrors] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [bankError, setBankError] = useState('');
  
  const [questionData, setQuestionData] = useState({
    questionType: 'multiple-choice',
    questionText: '',
    category: '',
    difficulty: 'medium',
    timeLimit: 30,
    points: 10,
    options: [
      { id: 1, text: '', isCorrect: false },
      { id: 2, text: '', isCorrect: false }
    ],
    explanation: '',
    correctAnswer: ''
  });

  const updateActiveQuestion = (updates) => {
    setQuestionData(prev => ({
      ...prev,
      ...updates
    }));
  };

  useEffect(() => {
    if (questionData && questionData.questionType === "true-false") {
      const updatedOptions = [...questionData.options];
      let correctAnswer = "";
      
      if (updatedOptions[0]?.isCorrect) {
        correctAnswer = "True";
      } else if (updatedOptions[1]?.isCorrect) {
        correctAnswer = "False";
      }
      
      updateActiveQuestion({ 
        options: updatedOptions,
        correctAnswer: correctAnswer
      });
    }
  }, [questionData?.questionType]);

  const handleOptionChange = (optionId, field, value) => {
    let updatedOptions;
    let correctAnswer = questionData.correctAnswer;

    // For multiple-choice (single answer) questions
    if (field === 'isCorrect' && questionData.questionType === 'multiple-choice') {
      // If deselecting the currently selected option, allow it
      if (!value) {
        updatedOptions = questionData.options.map(option => {
          if (option.id === optionId) {
            return { ...option, isCorrect: false };
          }
          return option;
        });
        correctAnswer = ''; // Clear correct answer when deselecting
      } else {
        // If selecting a new option, deselect all others
        updatedOptions = questionData.options.map(option => {
          const newIsCorrect = option.id === optionId;
          return { ...option, isCorrect: newIsCorrect };
        });
        // Set correct answer to the selected option's text
        correctAnswer = updatedOptions.find(o => o.id === optionId)?.text || '';
      }
    } else if (field === 'text') {
      // Handle text change
      updatedOptions = questionData.options.map(option => {
        if (option.id === optionId) {
          const newOption = { ...option, text: value };
          // If this is the correct option, update correctAnswer too
          if (option.isCorrect) {
            correctAnswer = value;
          }
          return newOption;
        }
        return option;
      });
    } else {
      // For all other cases (multiple answer questions)
      updatedOptions = questionData.options.map(option => {
        if (option.id === optionId) {
          const newOption = { ...option, [field]: value };
          // Update correctAnswer if this is a True/False question
          if (questionData.questionType === 'true-false' && field === 'isCorrect' && value) {
            correctAnswer = newOption.text;
          }
          return newOption;
        } else if (questionData.questionType === 'multiple-choice' && field === 'isCorrect') {
          // For multiple-choice, uncheck other options
          return { ...option, isCorrect: false };
        }
        return option;
      });
    }
    
    updateActiveQuestion({ 
      options: updatedOptions,
      correctAnswer
    });
  };

  const addOption = () => {
    const newId = Math.max(...questionData.options.map(o => o.id)) + 1;
    updateActiveQuestion({
      options: [...questionData.options, { id: newId, text: '', isCorrect: false }]
    });
  };

  const removeOption = (optionId) => {
    if (questionData.options.length <= 2) return;
    updateActiveQuestion({
      options: questionData.options.filter(o => o.id !== optionId)
    });
  };

  const addNewQuestion = () => {
    // Save the current question first
    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex] = { ...questionData };
    
    // Add a new question
    const newQuestion = {
      questionType: 'multiple-choice',
      questionText: '',
      category: '',
      difficulty: 'medium',
      timeLimit: 30,
      points: 10,
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ],
      explanation: '',
      correctAnswer: '',
      id: Date.now()
    };
    
    // Add the new question and set it as active
    newQuestions.push(newQuestion);
    setQuestions(newQuestions);
    setQuestionData(newQuestion);
    setActiveQuestionIndex(newQuestions.length - 1);
  };

  const handleSave = () => {
    if (!selectedBankId) {
      setBankError('Please select a competition');
      return;
    }

    // Save the current question to the questions array
    const newQuestions = [...questions];
    newQuestions[activeQuestionIndex] = { ...questionData };
    
    // Validate all questions
    const allErrors = [];
    let hasErrors = false;
    
    newQuestions.forEach((question, index) => {
      const questionErrors = validateQuestion(question);
      if (Object.keys(questionErrors).length > 0) {
        allErrors[index] = questionErrors;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(allErrors);
      return;
    }

    // If all valid, save all questions with the selected bank ID
    newQuestions.forEach(question => {
      onSave({ ...question, competitionId: selectedBankId }, selectedBankId);
    });
  };

  const validateQuestion = (question) => {
    const errors = {};
    if (!selectedBankId) errors.bank = 'Please select a competition';
    if (!question.questionText?.trim()) errors.questionText = 'Question text is required';
    if (!question.category) errors.category = 'Category is required';
    
    if (question.timeLimit < 5 || question.timeLimit > 300) {
      errors.timeLimit = 'Time limit must be between 5 and 300 seconds';
    }
    
    if (question.points < 1 || question.points > 100) {
      errors.points = 'Points must be between 1 and 100';
    }

    // Validate options and correct answer
    if (question.questionType === 'true-false') {
      const hasCorrectAnswer = question.options.some(o => o.isCorrect);
      if (!hasCorrectAnswer) {
        errors.options = 'Please select either True or False as the correct answer';
      }
    } else {
      const hasCorrectAnswer = question.options.some(o => o.isCorrect);
      if (!hasCorrectAnswer) {
        errors.options = 'Please select at least one correct answer';
      }
      const hasEmptyOptions = question.options.some(o => !o.text?.trim());
      if (hasEmptyOptions) {
        errors.options = 'Please fill in all options';
      }
    }

    // Ensure correctAnswer matches the selected option
    const correctOption = question.options.find(o => o.isCorrect);
    if (correctOption) {
      if (correctOption.text !== question.correctAnswer) {
        question.correctAnswer = correctOption.text;
      }
    } else if (question.correctAnswer) {
      // If there's a correctAnswer but no option is marked correct,
      // try to find and mark the matching option
      const matchingOption = question.options.find(o => o.text === question.correctAnswer);
      if (matchingOption) {
        matchingOption.isCorrect = true;
      }
    }
    
    return errors;
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    if (activeQuestionIndex >= newQuestions.length) {
      setActiveQuestionIndex(Math.max(0, newQuestions.length - 1));
    }
  };
  
  // Switch active question when index changes
  useEffect(() => {
    if (questions[activeQuestionIndex]) {
      setQuestionData(questions[activeQuestionIndex]);
    }
  }, [activeQuestionIndex]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const initialQuestion = {
        questionType: 'multiple-choice',
        questionText: '',
        category: '',
        difficulty: 'medium',
        timeLimit: 30,
        points: 10,
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false }
        ],
        explanation: '',
        correctAnswer: '',
        id: Date.now()
      };
      setQuestions([initialQuestion]);
      setQuestionData(initialQuestion);
      setActiveQuestionIndex(0);
      setErrors([]);
      setSelectedBankId('');
      setBankError('');
    }
  }, [isOpen]);

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
                      <HelpCircle className="h-5 w-5 mr-2 text-yellow-400" />
                      Add New Questions
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
                    Create multiple questions at once for your quiz
                  </p>
                  
                  {/* Question Navigation Tabs */}
                  <div className="mt-4 flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {questions.map((q, index) => (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIndex(index)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap flex items-center
                          ${activeQuestionIndex === index 
                            ? 'bg-white/20 text-white' 
                            : 'bg-transparent text-white/60 hover:text-white/80 hover:bg-white/10'}`}
                      >
                        Question {index + 1}
                        {questions.length > 1 && (
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
                        {questionData.questionText.length} characters
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
                    
                    {questionData.questionType === "true-false" ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            id="true-option"
                            name="true-false"
                            checked={questionData.options[0]?.isCorrect}
                            onChange={() => {
                              updateActiveQuestion({
                                options: [
                                  { id: 1, text: "True", isCorrect: true },
                                  { id: 2, text: "False", isCorrect: false }
                                ],
                                correctAnswer: "True"
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
                            checked={questionData.options[1]?.isCorrect}
                            onChange={() => {
                              updateActiveQuestion({
                                options: [
                                  { id: 1, text: "True", isCorrect: false },
                                  { id: 2, text: "False", isCorrect: true }
                                ],
                                correctAnswer: "False"
                              })
                            }}
                            className="h-4 w-4 text-[#0a1f44] focus:ring-[#0a1f44]"
                          />
                          <label htmlFor="false-option" className="text-gray-700">False</label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questionData.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <input
                                type={questionData.questionType === "multiple-answer" ? "checkbox" : "radio"}
                                name="answer-option"
                                checked={option.isCorrect}
                                onChange={(e) => handleOptionChange(option.id, "isCorrect", e.target.checked)}
                                className="h-4 w-4 text-[#0a1f44] focus:ring-[#0a1f44]"
                              />
                            </div>
                            <div className="flex-grow">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(option.id, "text", e.target.value)}
                                placeholder={`Option ${option.id}`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-white/90"
                              />
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => removeOption(option.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                disabled={questionData.options.length <= 2}
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
                      onClick={handleSave}
                      disabled={isLoading}
                      className={`bg-[#0a1f44] text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#152a4e] hover:shadow-md'}`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Questions
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
                      <span className="font-medium">{questions.length}</span>
                      <span className="ml-1">question{questions.length !== 1 ? 's' : ''}</span>
                      <span className="mx-2">•</span>
                      <span>Question {activeQuestionIndex + 1} of {questions.length}</span>
                    </div>
                  </div>
                </div>

                {/* Add error messages */}
                {errors[activeQuestionIndex] && Object.keys(errors[activeQuestionIndex]).length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {Object.entries(errors[activeQuestionIndex]).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
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