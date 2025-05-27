import { useState, Fragment, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { 
  Save, 
  X,
  Calendar,
  MapPin,
  Users,
  LayoutGrid,
  Info,
  AlertCircle,
  RefreshCw,
  Copy
} from "lucide-react"

export default function AddCompetitionModal({ isOpen, closeModal, onSave, form }) {
  // Use the form passed from the parent component
  const { data, setData, errors, processing } = form
  
  // Generate a code when the component mounts
  useEffect(() => {
    if (!data.code) {
      setData('code', generateCompetitionCode());
    }
  }, [isOpen])

  const generateCompetitionCode = () => {
    // Generate a random alphanumeric code (10 characters)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const regenerateCode = () => {
    setData('code', generateCompetitionCode());
  }

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(data.code);
    // You could add a toast notification here if you have a toast system
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (data.title.trim() === "") return;
    
    // Call the onSave function which will handle the Inertia.js form submission
    onSave();
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
                      Add New Competition
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
                    Fill in the details to create a new quiz competition
                  </p>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Competition Title</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={`w-full px-4 py-3 pl-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter competition title"
                      />
                      {data.title.trim() === "" && (
                        <div className="absolute right-3 top-3 text-amber-500">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                      )}
                      {errors.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <input
                        type="date"
                        value={data.date}
                        onChange={(e) => setData('date', e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        placeholder="Enter competition location"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Teams</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <input
                        type="number"
                        value={data.teams}
                        onChange={(e) => setData('teams', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rounds</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <LayoutGrid className="h-5 w-5" />
                      </div>
                      <input
                        type="number"
                        value={data.rounds}
                        onChange={(e) => setData('rounds', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        min="0"
                      />                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="relative">
                      <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                        placeholder="Enter competition description"
                      />
                      <div className="absolute right-3 bottom-3 text-gray-400 text-xs">
                        {data.description.length} characters
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Competition Code</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={data.code}
                          onChange={(e) => setData('code', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
                          placeholder="Competition code"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={regenerateCode}
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:ring-offset-2"
                        title="Generate new code"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={copyCodeToClipboard}
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:ring-offset-2"
                        title="Copy code to clipboard"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This code can be used by participants to join the competition</p>
                  </div>
                
                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
                  <button
                    type="submit"
                    disabled={processing || data.title.trim() === ""}
                    className={`bg-[#0a1f44] text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center
                      ${(processing || data.title.trim() === "") ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#152a4e] hover:shadow-md'}`}
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Competition
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a1f44]"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Cancel
                  </button>
                </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

