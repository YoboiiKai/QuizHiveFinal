import { useState, useRef } from "react"
import AdminLayout from "../../Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { 
  Image, 
  Upload,
  Check,
  X,
  Trash2,
  Eye,
  PaintBucket,
  Palette,
  Hexagon,
  Layers,
  Plus,
  Info,
  AlertTriangle,
  Save,
} from "lucide-react"

export default function Theme() {
  const [themes, setThemes] = useState([
    {
      id: 1,
      name: "Default Honeycomb",
      type: "pattern",
      previewUrl: "/images/themes/honeycomb-preview.jpg",
      isActive: true,
      description: "A subtle honeycomb pattern that provides a professional look without distracting participants.",
      createdAt: "2025-03-15"
    },
    {
      id: 2,
      name: "Science Lab",
      type: "image",
      previewUrl: "/images/themes/science-lab.jpg",
      isActive: false,
      description: "Laboratory equipment background perfect for science-themed competitions.",
      createdAt: "2025-04-02"
    },
    {
      id: 3,
      name: "Math Formulas",
      type: "image",
      previewUrl: "/images/themes/math-formulas.jpg",
      isActive: false,
      description: "Mathematical equations and formulas background ideal for math competitions.",
      createdAt: "2025-04-10"
    }
  ])
  
  // Logo state
  const [logos, setLogos] = useState({
    primary: {
      file: null,
      previewUrl: "/images/logos/primary-logo.png",
      name: "Primary Logo"
    },
    secondary: {
      file: null,
      previewUrl: "/images/logos/secondary-logo.png",
      name: "Secondary Logo"
    }
  })
  
  const [newTheme, setNewTheme] = useState({
    name: "",
    file: null,
    previewUrl: "",
    description: ""
  })
  
  // Logo upload error state
  const [logoError, setLogoError] = useState("")
  
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef(null)
  const primaryLogoInputRef = useRef(null)
  const secondaryLogoInputRef = useRef(null)
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload a valid image file (JPEG, PNG, or WebP)")
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB")
      return
    }
    
    setUploadError("")
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    
    setNewTheme({
      ...newTheme,
      file,
      previewUrl
    })
  }
  
  const handleNameChange = (e) => {
    setNewTheme({
      ...newTheme,
      name: e.target.value
    })
  }
  
  const handleDescriptionChange = (e) => {
    setNewTheme({
      ...newTheme,
      description: e.target.value
    })
  }
  
  const handleLogoChange = (type, e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setLogoError(`Please upload a valid image file (JPEG, PNG, SVG, or WebP) for the ${type} logo`)
      return
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError(`${type} logo size should be less than 2MB`)
      return
    }
    
    setLogoError("")
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    
    setLogos({
      ...logos,
      [type.toLowerCase()]: {
        ...logos[type.toLowerCase()],
        file,
        previewUrl
      }
    })
  }
  
  const saveLogo = (type) => {
    const logoData = logos[type.toLowerCase()]
    if (!logoData.file) {
      setLogoError(`Please select a file for the ${type} logo`)
      return
    }
    
    // In a real application, you would upload the file to the server here
    // For now, we'll just update our local state
    
    // Reset file input
    if (type.toLowerCase() === 'primary' && primaryLogoInputRef.current) {
      primaryLogoInputRef.current.value = ""
    } else if (type.toLowerCase() === 'secondary' && secondaryLogoInputRef.current) {
      secondaryLogoInputRef.current.value = ""
    }
    
    // Keep the previewUrl in the state
    setLogos({
      ...logos,
      [type.toLowerCase()]: {
        ...logos[type.toLowerCase()],
        file: null
      }
    })
    
    setLogoError("")
    alert(`${type} logo updated successfully!`)
  }
  
  const handleUpload = () => {
    if (!newTheme.file || !newTheme.name.trim()) {
      setUploadError("Please provide both a name and an image file")
      return
    }
    
    // In a real application, you would upload the file to the server here
    // For now, we'll just add it to our local state
    const newId = themes.length > 0 ? Math.max(...themes.map(t => t.id)) + 1 : 1
    
    const uploadedTheme = {
      id: newId,
      name: newTheme.name,
      type: "image",
      previewUrl: newTheme.previewUrl,
      description: newTheme.description || "No description provided.",
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setThemes([...themes, uploadedTheme])
    
    // Reset form
    setNewTheme({
      name: "",
      file: null,
      previewUrl: "",
      description: ""
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  const setActiveTheme = (id) => {
    setThemes(themes.map(theme => ({
      ...theme,
      isActive: theme.id === id
    })))
  }
  
  const deleteTheme = (id) => {
    // Don't allow deleting the active theme
    const themeToDelete = themes.find(t => t.id === id)
    if (themeToDelete.isActive) {
      alert("You cannot delete the active theme. Please set another theme as active first.")
      return
    }
    
    setThemes(themes.filter(theme => theme.id !== id))
  }
  
  const previewTheme = (previewUrl) => {
    // In a real application, you would show a modal with a preview of the theme
    window.open(previewUrl, '_blank')
  }
  
  return (
    <AdminLayout>
      <Head title="Theme Settings" />
      
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
        {/* Header */}
        <div className="bg-[#0a1f44] text-white mb-6 py-6 rounded-2xl">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <div className="relative mr-3">
                    <Hexagon className="h-8 w-8 text-yellow-400" fill="#0a1f44" />
                    <Palette className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  Theme Settings
                </h1>
                <p className="text-white/80 mt-1">Customize the background images for participant question pages</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          {/* Logo Management Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#0a1f44] mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Logo Management
            </h2>
            
            {logoError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{logoError}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Primary Logo */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-[#0a1f44] mb-3">Primary Logo</h3>
                <div className="flex items-center mb-4">
                  <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                    {logos.primary.previewUrl ? (
                      <img 
                        src={logos.primary.previewUrl} 
                        alt="Primary Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 mb-2">This logo appears prominently at the top of the participant question page.</p>
                    <div className="flex items-center">
                      <input
                        type="file"
                        ref={primaryLogoInputRef}
                        onChange={(e) => handleLogoChange('Primary', e)}
                        accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml"
                        className="hidden"
                        id="primary-logo-upload"
                      />
                      <label
                        htmlFor="primary-logo-upload"
                        className="text-sm bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center cursor-pointer mr-2"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Choose File
                      </label>
                      <button
                        onClick={() => saveLogo('Primary')}
                        disabled={!logos.primary.file}
                        className={`text-sm py-2 px-3 rounded-lg flex items-center ${logos.primary.file ? 'bg-[#0a1f44] text-white hover:bg-[#152a4e]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors duration-200`}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Recommended size: 200x80px. Max file size: 2MB. Supported formats: JPEG, PNG, SVG, WebP</p>
              </div>
              
              {/* Secondary Logo */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-[#0a1f44] mb-3">Secondary Logo</h3>
                <div className="flex items-center mb-4">
                  <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                    {logos.secondary.previewUrl ? (
                      <img 
                        src={logos.secondary.previewUrl} 
                        alt="Secondary Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 mb-2">This logo appears in the footer of the participant question page.</p>
                    <div className="flex items-center">
                      <input
                        type="file"
                        ref={secondaryLogoInputRef}
                        onChange={(e) => handleLogoChange('Secondary', e)}
                        accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml"
                        className="hidden"
                        id="secondary-logo-upload"
                      />
                      <label
                        htmlFor="secondary-logo-upload"
                        className="text-sm bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center cursor-pointer mr-2"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Choose File
                      </label>
                      <button
                        onClick={() => saveLogo('Secondary')}
                        disabled={!logos.secondary.file}
                        className={`text-sm py-2 px-3 rounded-lg flex items-center ${logos.secondary.file ? 'bg-[#0a1f44] text-white hover:bg-[#152a4e]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors duration-200`}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Recommended size: 150x60px. Max file size: 2MB. Supported formats: JPEG, PNG, SVG, WebP</p>
              </div>
            </div>
          </div>
          
          {/* Background Upload Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#0a1f44] mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload New Background
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme Name</label>
                  <input
                    type="text"
                    value={newTheme.name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50/80 transition-all duration-200 hover:bg-white"
                    placeholder="Enter a name for this theme"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTheme.description}
                    onChange={handleDescriptionChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent bg-gray-50/80 transition-all duration-200 hover:bg-white"
                    placeholder="Enter a description for this theme"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Describe how this theme will be used or what type of competitions it's best suited for.</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      className="hidden"
                      id="theme-image-upload"
                    />
                    <label
                      htmlFor="theme-image-upload"
                      className="flex items-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Image className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Choose Image</span>
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {newTheme.file ? newTheme.file.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x1080px. Max file size: 5MB. Supported formats: JPEG, PNG, WebP</p>
                  
                  {uploadError && (
                    <div className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {uploadError}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={!newTheme.file || !newTheme.name.trim()}
                  className={`bg-[#0a1f44] text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center
                    ${(!newTheme.file || !newTheme.name.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#152a4e] hover:shadow-md'}`}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Upload Background
                </button>
              </div>
              
              <div>
                {newTheme.previewUrl ? (
                  <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 h-48 flex items-center justify-center">
                    <img
                      src={newTheme.previewUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg border border-gray-200 border-dashed h-48 flex flex-col items-center justify-center text-gray-400">
                    <Image className="h-12 w-12 mb-2" />
                    <span className="text-sm">Preview will appear here</span>
                  </div>
                )}
                <p className="text-xs text-center text-gray-500 mt-2">Preview</p>
              </div>
            </div>
          </div>
          
          {/* Information Section */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">About Background Themes</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>Background themes are displayed on the participant's question page during competitions.</p>
                  <p>The active theme will be shown to all participants. You can change the active theme at any time.</p>
                  <p>For best results, use high-quality images with subtle patterns that won't distract participants from the questions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}