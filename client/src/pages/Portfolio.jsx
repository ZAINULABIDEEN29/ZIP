import React, { useState } from 'react';
import { Plus, ExternalLink, Github, Calendar, Tag, Building, User, RefreshCw } from 'lucide-react';
import PortfolioItemCard from '../components/PortfolioItemCard';
import Modal from '../components/Modal';
import { useIntern } from '../context/InternContext';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const { portfolio, loading, error, addProject, deleteProject, profile, refreshPortfolio } = useIntern();
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectType, setProjectType] = useState('user'); // 'user' or 'zimlitech'
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    category: 'Frontend',
    completedDate: '',
    image: null,
    type: 'user'
  });

  const categories = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Other'];

  // Separate projects by type and approval status
  // Handle projects without type field (legacy projects) - treat them as user projects
  const zimlitechProjects = portfolio?.filter(project => 
    project.type === 'zimlitech' && project.approvalStatus === 'approved'
  ) || [];
  const pendingZimlitechProjects = portfolio?.filter(project => 
    project.type === 'zimlitech' && project.approvalStatus === 'pending'
  ) || [];
  const userProjects = portfolio?.filter(project => 
    !project.type || project.type === 'user' || 
    (project.type === 'zimlitech' && project.approvalStatus === 'rejected')
  ) || [];

 
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Convert image to base64 with compression
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 800px width/height)
          let { width, height } = img;
          const maxDimension = 800;
          
          if (width > height) {
            if (width > maxDimension) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          
          setNewProject({...newProject, image: compressedImage});
          toast.success('Image uploaded successfully!');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // Show loading state
      const loadingToast = toast.loading('Adding project...');
      
      // Create project data without the type field from newProject
      const { type: _, approvalStatus: _ignore, ...projectWithoutTypeAndApproval } = newProject;
      
      const projectData = {
        ...projectWithoutTypeAndApproval,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        completedDate: newProject.completedDate || new Date().toISOString().split('T')[0],
        image: newProject.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
        type: projectType  // Use the selected project type
      };
      
      await addProject(projectData);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Project added successfully!');
      
      // Clear form
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        category: 'Frontend',
        completedDate: '',
        image: null,
        type: 'user'
      });
      setProjectType('user');
      setShowAddModal(false);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss();
      toast.error(`Failed to add project: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }

  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded mb-3 sm:mb-4"></div>
              <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-10">
            <h2 className="text-red-800 text-lg sm:text-xl font-semibold mb-2">Error Loading Portfolio</h2>
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10 mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Work Portfolio</h1>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              {/* <button
                onClick={async () => {
                
                  await refreshPortfolio();
                  toast.success('Portfolio refreshed!');
                }}
                className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium justify-center"
              >
                <RefreshCw size={20} className="sm:w-6 sm:h-6" /> Refresh
              </button> */}
              <button
                onClick={() => {
                  setShowAddModal(true);
                }}
                className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium justify-center"
              >
                <Plus size={20} className="sm:w-6 sm:h-6" /> Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Approved Zimlitech Projects Section */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10 mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
            <Building className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">Zimlitech Projects</h2>
          </div>
          
          {zimlitechProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
              {zimlitechProjects.map((project) => (
                <PortfolioItemCard 
                  key={project._id} 
                  project={project} 
                  onDelete={() => handleDeleteProject(project._id)}
                  // githubProfileUrl={profile?.githubUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">No approved Zimlitech projects yet.</p>
            </div>
          )}
        </div>

        {/* Pending Zimlitech Projects Section */}
        {pendingZimlitechProjects.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10 mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
              <Building className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-yellow-800">Pending Zimlitech Projects</h2>
            </div>
            
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm sm:text-base">
                <strong>Note:</strong> These projects are waiting for admin approval. They will appear in the "Zimlitech Projects" section once approved.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
              {pendingZimlitechProjects.map((project) => (
                <div key={project._id} className="relative">
                  <PortfolioItemCard 
                    project={project} 
                    onDelete={() => handleDeleteProject(project._id)}
                    // githubProfileUrl={profile?.githubUrl}
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Pending
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Projects Section */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10 mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
            <User className="w-6 h-6 text-green-600" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">My Projects</h2>
          </div>
          
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
              {userProjects.map((project) => (
              <PortfolioItemCard 
                key={project._id} 
                project={project} 
                onDelete={() => handleDeleteProject(project._id)}
                // githubProfileUrl={profile?.githubUrl}
              />
            ))}
          </div>
        ) : (
            <div className="text-center py-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">No Projects Added Yet</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4">Start building your portfolio by adding your first project!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium mx-auto"
            >
              <Plus size={20} className="sm:w-6 sm:h-6" /> Add Your First Project
            </button>
          </div>
        )}
        </div>

        {/* Add Project Modal */}
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Project"
        >
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            {/* Project Type Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    
                    setProjectType('user');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                    projectType === 'user'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  My Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                   
                    setProjectType('zimlitech');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                    projectType === 'zimlitech'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Building className="w-4 h-4 inline mr-2" />
                  Zimlitech Project
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows={2}
                className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                placeholder="Describe your project..."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Technologies (comma-separated)</label>
              <input
                type="text"
                value={newProject.technologies}
                onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Completion Date</label>
              <input
                type="date"
                value={newProject.completedDate}
                onChange={(e) => setNewProject({...newProject, completedDate: e.target.value})}
                className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Project Image</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {newProject.image && (
                  <div className="relative">
                    <img 
                      src={newProject.image} 
                      alt="Project preview" 
                      className="w-full h-24 sm:h-32  object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setNewProject({...newProject, image: null})}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid-cols-6 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {/* <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                  placeholder="https://github.com/..."
                />
              </div> */}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Live URL</label>
                <input
                  type="url"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4">
              <button
                onClick={handleAddProject}
                disabled={!newProject.title.trim() || !newProject.description.trim()}
                className="flex-1 bg-primary text-white py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-medium hover:scale-105 transition text-sm sm:text-base"
              >
                Add Project
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl font-medium hover:scale-105 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Portfolio; 