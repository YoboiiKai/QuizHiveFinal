import { useState, useEffect } from "react"
import AdminLayout from "../../Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { 
  Volume2, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  HelpCircle,
  Trophy,
  Flag
} from "lucide-react"

export default function Display() {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionTimer, setQuestionTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState(null)
  const [currentRound, setCurrentRound] = useState(1)
  
  const [teams, setTeams] = useState([])
  const [showScoreboard, setShowScoreboard] = useState(false)
  
  const [competitions, setCompetitions] = useState([
    { 
      id: 1, 
      name: "National Science Quiz 2025",
      rounds: 3,
      questions: [
        {
          id: 1,
          question_text: "What is the chemical symbol for gold?",
          options: ["Au", "Ag", "Fe", "Cu"],
          correct_answer: "Au",
          difficulty: "easy",
          time_limit: 30,
          points: 10,
          category: "Chemistry",
          round: 1
        },
        {
          id: 2,
          question_text: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct_answer: "Mars",
          difficulty: "easy",
          time_limit: 30,
          points: 10,
          category: "Astronomy",
          round: 1
        },
        {
          id: 3,
          question_text: "What is the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
          correct_answer: "Mitochondria",
          difficulty: "medium",
          time_limit: 45,
          points: 20,
          category: "Biology",
          round: 2
        }
      ]
    },
    { 
      id: 2, 
      name: "Regional Math Challenge",
      rounds: 2,
      questions: [
        {
          id: 1,
          question_text: "What is the value of π (pi) to two decimal places?",
          options: ["3.14", "3.16", "3.12", "3.18"],
          correct_answer: "3.14",
          difficulty: "easy",
          time_limit: 30,
          points: 10,
          category: "Mathematics",
          round: 1
        }
      ]
    }
  ])
  
  // Sample team data
  useEffect(() => {
    // In a real application, this would be fetched from an API
    if (selectedCompetition) {
      setTeams([
        {
          id: 1,
          name: "Quantum Minds",
          school: "Westfield High School",
          score: 45,
          competitionId: selectedCompetition.id,
          members: [
            { id: 1, name: "Alex Johnson", role: "Captain" },
            { id: 2, name: "Jamie Smith", role: "Member" },
            { id: 3, name: "Taylor Brown", role: "Member" }
          ]
        },
        {
          id: 2,
          name: "Math Wizards",
          school: "Eastside Academy",
          score: 60,
          competitionId: selectedCompetition.id,
          members: [
            { id: 4, name: "Morgan Lee", role: "Captain" },
            { id: 5, name: "Casey Wilson", role: "Member" },
            { id: 6, name: "Jordan Miller", role: "Member" }
          ]
        },
        {
          id: 3,
          name: "Science Stars",
          school: "Northside Prep",
          score: 50,
          competitionId: selectedCompetition.id,
          members: [
            { id: 7, name: "Riley Davis", role: "Captain" },
            { id: 8, name: "Avery Garcia", role: "Member" },
            { id: 9, name: "Quinn Martinez", role: "Member" }
          ]
        },
        {
          id: 4,
          name: "History Buffs",
          school: "Central High",
          score: 35,
          competitionId: selectedCompetition.id,
          members: [
            { id: 10, name: "Reese Thompson", role: "Captain" },
            { id: 11, name: "Parker Wright", role: "Member" },
            { id: 12, name: "Drew Anderson", role: "Member" }
          ]
        }
      ])
    }
  }, [selectedCompetition])

  // Timer functionality
  useEffect(() => {
    let interval = null
    
    if (isTimerRunning && questionTimer > 0) {
      interval = setInterval(() => {
        setQuestionTimer(prevTimer => prevTimer - 1)
      }, 1000)
    } else if (questionTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      // Auto-reveal answer when time is up
      setIsAnswerRevealed(true)
    }
    
    return () => clearInterval(interval)
  }, [isTimerRunning, questionTimer])

  // Function to select a competition
  const handleSelectCompetition = (competition) => {
    setSelectedCompetition(competition)
    setCurrentRound(1)
    setCurrentQuestion(null)
    setIsAnswerRevealed(false)
    setShowScoreboard(false)
  }

  // Function to display the next question
  const handleNextQuestion = () => {
    if (!selectedCompetition) return
    
    const roundQuestions = selectedCompetition.questions.filter(q => q.round === currentRound)
    
    if (currentQuestion) {
      const currentIndex = roundQuestions.findIndex(q => q.id === currentQuestion.id)
      
      if (currentIndex < roundQuestions.length - 1) {
        const nextQuestion = roundQuestions[currentIndex + 1]
        setCurrentQuestion(nextQuestion)
        setQuestionTimer(nextQuestion.time_limit)
        setIsAnswerRevealed(false)
        setIsTimerRunning(false)
      } else if (currentRound < selectedCompetition.rounds) {
        // Move to next round
        setCurrentRound(prevRound => prevRound + 1)
        setCurrentQuestion(null)
        setIsAnswerRevealed(false)
      } else {
        // End of competition
        setShowScoreboard(true)
        setCurrentQuestion(null)
      }
    } else {
      // Start with the first question of the current round
      if (roundQuestions.length > 0) {
        setCurrentQuestion(roundQuestions[0])
        setQuestionTimer(roundQuestions[0].time_limit)
        setIsAnswerRevealed(false)
        setIsTimerRunning(false)
      }
    }
  }

  // Function to display the previous question
  const handlePreviousQuestion = () => {
    if (!selectedCompetition || !currentQuestion) return
    
    const roundQuestions = selectedCompetition.questions.filter(q => q.round === currentRound)
    const currentIndex = roundQuestions.findIndex(q => q.id === currentQuestion.id)
    
    if (currentIndex > 0) {
      const prevQuestion = roundQuestions[currentIndex - 1]
      setCurrentQuestion(prevQuestion)
      setQuestionTimer(prevQuestion.time_limit)
      setIsAnswerRevealed(false)
      setIsTimerRunning(false)
    } else if (currentRound > 1) {
      // Move to previous round
      const newRound = currentRound - 1
      setCurrentRound(newRound)
      
      const prevRoundQuestions = selectedCompetition.questions.filter(q => q.round === newRound)
      if (prevRoundQuestions.length > 0) {
        const lastQuestion = prevRoundQuestions[prevRoundQuestions.length - 1]
        setCurrentQuestion(lastQuestion)
        setQuestionTimer(lastQuestion.time_limit)
        setIsAnswerRevealed(false)
        setIsTimerRunning(false)
      }
    }
  }

  // Function to toggle the timer
  const toggleTimer = () => {
    setIsTimerRunning(prevState => !prevState)
  }

  // Function to reveal the answer
  const revealAnswer = () => {
    setIsAnswerRevealed(true)
    setIsTimerRunning(false)
  }

  // Function to award points to a team
  const awardPoints = (teamId, points) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, score: team.score + points } 
          : team
      )
    )
  }

  // Function to deduct points from a team
  const deductPoints = (teamId, points) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, score: Math.max(0, team.score - points) } 
          : team
      )
    )
  }

  return (
    <AdminLayout>
      <Head title="Display - QuizHive" />
      
      <div className="min-h-screen">
        {/* Competition Selection */}
        {!selectedCompetition && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-2xl font-bold text-[#0a1f44] mb-6">Select Competition</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map(competition => (
                  <div 
                    key={competition.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleSelectCompetition(competition)}
                  >
                    <h3 className="text-xl font-semibold text-[#0a1f44] mb-2">{competition.name}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      <span>{competition.questions.length} Questions</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Flag className="h-4 w-4 mr-2" />
                      <span>{competition.rounds} Rounds</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Competition Display */}
        {selectedCompetition && (
          <div className="container mx-auto px-4 py-6">
            {/* Header with competition info and controls */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0a1f44]">{selectedCompetition.name}</h2>
                  <div className="flex items-center mt-2">
                    <Flag className="h-4 w-4 mr-2 text-[#0a1f44]/70" />
                    <span className="text-[#0a1f44]/70 font-medium">Round {currentRound} of {selectedCompetition.rounds}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => setShowScoreboard(!showScoreboard)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                      showScoreboard 
                        ? 'bg-[#0a1f44] text-white border-[#0a1f44]' 
                        : 'bg-white text-[#0a1f44] border-[#0a1f44]/20 hover:border-[#0a1f44] hover:bg-[#0a1f44]/5'
                    }`}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {showScoreboard ? 'Hide Scoreboard' : 'Show Scoreboard'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedCompetition(null)
                      setCurrentQuestion(null)
                      setShowScoreboard(false)
                    }}
                    className="flex items-center px-4 py-2 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all duration-200"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Exit Competition
                  </button>
                </div>
              </div>
            </div>
            
            {/* Scoreboard */}
            {showScoreboard && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#0a1f44]">
                    <Trophy className="h-5 w-5 inline-block mr-2 text-yellow-500" />
                    Scoreboard
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teams.sort((a, b) => b.score - a.score).map((team, index) => (
                    <div 
                      key={team.id}
                      className={`bg-white rounded-xl shadow-md border p-6 ${
                        index === 0 ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-[#0a1f44]">{team.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{team.school}</p>
                        </div>
                        {index === 0 && (
                          <div className="bg-yellow-400 text-[#0a1f44] p-1 rounded-full">
                            <Trophy className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <div className="text-3xl font-bold text-[#0a1f44]">{team.score}</div>
                        <div className="text-xs text-gray-500 uppercase mt-1">Points</div>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => deductPoints(team.id, 5)}
                          className="flex-1 mr-2 py-2 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all duration-200"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => awardPoints(team.id, 5)}
                          className="flex-1 py-2 rounded-lg bg-white text-green-600 border border-green-200 hover:bg-green-50 transition-all duration-200"
                        >
                          +5
                        </button>
                      </div>
                      
                      <div className="mt-2 flex justify-between">
                        <button
                          onClick={() => deductPoints(team.id, 10)}
                          className="flex-1 mr-2 py-2 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all duration-200"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => awardPoints(team.id, 10)}
                          className="flex-1 py-2 rounded-lg bg-white text-green-600 border border-green-200 hover:bg-green-50 transition-all duration-200"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Question Display */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
              {currentQuestion ? (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center">
                        <span className="bg-[#0a1f44]/10 text-[#0a1f44] text-sm font-medium px-3 py-1 rounded-lg mr-3">
                          {currentQuestion.category}
                        </span>
                        <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                          currentQuestion.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-800' 
                            : currentQuestion.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0a1f44] mt-3">
                        Question {currentQuestion.id}
                      </h3>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      <div className={`flex items-center px-4 py-2 rounded-lg mr-3 ${
                        questionTimer <= 10 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-[#0a1f44]/10 text-[#0a1f44]'
                      }`}>
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-mono font-medium">{questionTimer}s</span>
                      </div>
                      
                      <div className="flex items-center bg-[#0a1f44]/10 text-[#0a1f44] px-4 py-2 rounded-lg">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{currentQuestion.points} pts</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="text-lg md:text-xl text-[#0a1f44] font-medium mb-6">
                      {currentQuestion.question_text}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border ${
                            isAnswerRevealed && option === currentQuestion.correct_answer
                              ? 'bg-green-50 border-green-300'
                              : 'bg-white border-gray-200 hover:border-[#0a1f44]/30'
                          } transition-all duration-200`}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-[#0a1f44]/10 flex items-center justify-center text-[#0a1f44] font-medium mr-3">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-[#0a1f44]">{option}</span>
                            {isAnswerRevealed && option === currentQuestion.correct_answer && (
                              <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between border-t border-gray-200 pt-6">
                    <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
                      <button
                        onClick={handlePreviousQuestion}
                        className="flex items-center px-4 py-2 rounded-lg bg-white text-[#0a1f44] border border-[#0a1f44]/20 hover:border-[#0a1f44] hover:bg-[#0a1f44]/5 transition-all duration-200"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </button>
                      
                      <button
                        onClick={toggleTimer}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                          isTimerRunning 
                            ? 'bg-yellow-500 text-white border-yellow-500' 
                            : 'bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50'
                        }`}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Timer
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Timer
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={revealAnswer}
                        disabled={isAnswerRevealed}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                          isAnswerRevealed 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reveal Answer
                      </button>
                    </div>
                    
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center px-4 py-2 rounded-lg bg-[#0a1f44] text-white border border-[#0a1f44] hover:bg-[#0a1f44]/90 transition-all duration-200"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-[#0a1f44]/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-10 w-10 text-[#0a1f44]/60" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1f44] mb-2">No Question Selected</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {selectedCompetition.questions.filter(q => q.round === currentRound).length > 0 
                      ? "Click the button below to start displaying questions for this round." 
                      : "There are no questions available for this round."}
                  </p>
                  {selectedCompetition.questions.filter(q => q.round === currentRound).length > 0 && (
                    <button
                      onClick={handleNextQuestion}
                      className="inline-flex items-center px-6 py-3 rounded-lg bg-[#0a1f44] text-white border border-[#0a1f44] hover:bg-[#0a1f44]/90 transition-all duration-200"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Questions
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Team Quick View (always visible when in competition) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teams.sort((a, b) => b.score - a.score).map((team, index) => (
                <div 
                  key={team.id}
                  className={`bg-white rounded-xl shadow-md border p-4 ${
                    index === 0 ? 'border-yellow-400' : 'border-gray-200/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#0a1f44] truncate">{team.name}</h4>
                    <div className="bg-[#0a1f44]/10 text-[#0a1f44] font-bold px-2 py-1 rounded">
                      {team.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}