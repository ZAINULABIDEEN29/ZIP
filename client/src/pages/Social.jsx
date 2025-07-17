import React, { useState, useEffect } from 'react';
import { Plus, Users, MessageCircle, Heart, Share2, Calendar, MapPin, Award, Target, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import AchievementBadge from '../components/AchievementBadge';
import { useIntern } from '../context/InternContext';
import toast from 'react-hot-toast';

const Social = () => {
  const { achievements, teamProjects, loading, error, addAchievement, addTeamProject } = useIntern();
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    badge: 'Milestone'
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    role: '',
    technologies: '',
    teamMembers: '',
    status: 'active'
  });
  const [addingAchievement, setAddingAchievement] = useState(false);
  const [addingProject, setAddingProject] = useState(false);

  const badgeOptions = ['Course Completion', 'Milestone', 'Excellence', 'Leadership', 'Innovation'];
  const statusOptions = ['active', 'completed', 'on-hold'];

  const handleAddAchievement = async () => {
    if (!newAchievement.title.trim() || !newAchievement.description.trim()) return;
    setAddingAchievement(true);
    try {
      await addAchievement(newAchievement);
      setNewAchievement({
        title: '',
        description: '',
        badge: 'Milestone'
      });
      setShowAddAchievementModal(false);
    } catch (error) {
      toast.error('Error adding achievement:', error);
    } finally {
      setAddingAchievement(false);
    }
  };

  const handleAddTeamProject = async () => {
    if (!newProject.name.trim() || !newProject.description.trim()) return;
    setAddingProject(true);
    try {
      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        teamMembers: newProject.teamMembers.split(',').map(member => member.trim()).filter(member => member),
        startDate: new Date().toISOString().split('T')[0]
      };
      await addTeamProject(projectData);
      setNewProject({
        name: '',
        description: '',
        role: '',
        technologies: '',
        teamMembers: '',
        status: 'active'
      });
      setShowAddProjectModal(false);
    } catch (error) {
      toast.error('Error adding team project:', error);
    } finally {
      setAddingProject(false);
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
            <h2 className="text-red-800 text-lg sm:text-xl font-semibold mb-2">Error Loading Social Data</h2>
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Social & Achievements</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowAddAchievementModal(true)}
                className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium"
              >
                <Award size={20} className="sm:w-6 sm:h-6" /> 
                <span className="hidden sm:inline">Add Achievement</span>
                <span className="sm:hidden">Achievement</span>
              </button>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium"
              >
                <Target size={20} className="sm:w-6 sm:h-6" /> 
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <Award className="text-primary w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg xl:text-xl">Achievements</h3>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary mb-1 sm:mb-2">{achievements?.length || 0}</div>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Total earned</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <Target className="text-green-600 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg xl:text-xl">Team Projects</h3>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-green-600 mb-1 sm:mb-2">{teamProjects?.length || 0}</div>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Collaborated</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <Users className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg xl:text-xl">Active Projects</h3>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-blue-600 mb-1 sm:mb-2">
              {teamProjects?.filter(p => p.status === 'active').length || 0}
            </div>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Currently working</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <Heart className="text-red-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg xl:text-xl">Completed</h3>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-red-500 mb-1 sm:mb-2">
              {teamProjects?.filter(p => p.status === 'completed').length || 0}
            </div>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Successfully finished</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          {/* Achievements Section */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6 lg:mb-8">Recent Achievements</h2>
              {achievements && achievements.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement._id} className="border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg xl:text-xl mb-1 sm:mb-2 truncate">{achievement.title}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 line-clamp-2">{achievement.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm text-gray-500">
                              {new Date(achievement.date).toLocaleDateString()}
                            </span>
                            <AchievementBadge label={achievement.badge} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Award className="mx-auto text-gray-300 mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-500 mb-4 text-sm sm:text-base">Start earning achievements by completing milestones!</p>
                  <button
                    onClick={() => setShowAddAchievementModal(true)}
                    className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium mx-auto"
                  >
                    <Award size={20} className="sm:w-6 sm:h-6" /> Add Your First Achievement
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Team Projects Section */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6 lg:mb-8">Team Projects</h2>
              {teamProjects && teamProjects.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {teamProjects.slice(0, 5).map((project) => (
                    <div key={project._id} className="border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg xl:text-xl flex-1 min-w-0 truncate">{project.name}</h3>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                          project.status === 'active' ? 'bg-green-100 text-green-700' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                        {project.technologies?.map((tech, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        <span className="font-medium">Role:</span> {project.role || 'Team Member'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Target className="mx-auto text-gray-300 mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Team Projects Yet</h3>
                  <p className="text-gray-500 mb-4 text-sm sm:text-base">Start collaborating on team projects!</p>
                  <button
                    onClick={() => setShowAddProjectModal(true)}
                    className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium mx-auto"
                  >
                    <Target size={20} className="sm:w-6 sm:h-6" /> Add Your First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Achievement Modal */}
        <Modal
          open={showAddAchievementModal}
          onClose={() => setShowAddAchievementModal(false)}
          title="Add New Achievement"
        >
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title</label>
              <input
                type="text"
                value={newAchievement.title}
                onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="e.g., React Mastery Certificate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="Describe your achievement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Type</label>
              <select
                value={newAchievement.badge}
                onChange={(e) => setNewAchievement({...newAchievement, badge: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
              >
                {badgeOptions.map(badge => (
                  <option key={badge} value={badge}>{badge}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleAddAchievement}
                disabled={!newAchievement.title.trim() || !newAchievement.description.trim() || addingAchievement}
                className="flex-1 bg-primary text-white py-2 sm:py-3 rounded-xl font-medium hover:scale-105 transition text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {addingAchievement ? <Loader2 className="animate-spin" size={18} /> : null}
                {addingAchievement ? 'Adding...' : 'Add Achievement'}
              </button>
              <button
                onClick={() => setShowAddAchievementModal(false)}
                disabled={addingAchievement}
                className="flex-1 bg-gray-200 text-gray-800 py-2 sm:py-3 rounded-xl font-medium hover:scale-105 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* Add Team Project Modal */}
        <Modal
          open={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          title="Add New Team Project"
        >
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="Describe the project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
              <input
                type="text"
                value={newProject.role}
                onChange={(e) => setNewProject({...newProject, role: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="e.g., Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={newProject.technologies}
                onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members (comma-separated)</label>
              <input
                type="text"
                value={newProject.teamMembers}
                onChange={(e) => setNewProject({...newProject, teamMembers: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-lg"
                placeholder="e.g., John, Sarah, Mike"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleAddTeamProject}
                disabled={!newProject.name.trim() || !newProject.description.trim() || addingProject}
                className="flex-1 bg-green-600 text-white py-2 sm:py-3 rounded-xl font-medium hover:scale-105 transition text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {addingProject ? <Loader2 className="animate-spin" size={18} /> : null}
                {addingProject ? 'Adding...' : 'Add Project'}
              </button>
              <button
                onClick={() => setShowAddProjectModal(false)}
                disabled={addingProject}
                className="flex-1 bg-gray-200 text-gray-800 py-2 sm:py-3 rounded-xl font-medium hover:scale-105 transition text-sm sm:text-base"
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

export default Social; 