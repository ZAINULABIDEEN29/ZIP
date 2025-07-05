import React, { useState } from 'react';
import { Target, Calendar, CheckCircle, Clock, TrendingUp, Plus, Trash2 } from 'lucide-react';
import TimelineCard from '../components/TimelineCard';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { useIntern } from '../context/InternContext';

const Progress = () => {
  const { progress, loading, error, addMilestone, updateMilestone, deleteMilestone } = useIntern();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    category: 'Technical',
    status: 'upcoming',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['all', 'technical', 'project', 'soft skills', 'presentation'];
  const statusOptions = ['upcoming', 'in-progress', 'completed'];

  const stats = {
    totalMilestones: progress?.length || 0,
    completed: progress?.filter(m => m.status === 'completed').length || 0,
    inProgress: progress?.filter(m => m.status === 'in-progress').length || 0,
    upcoming: progress?.filter(m => m.status === 'upcoming').length || 0,
    overallProgress: progress?.length > 0 
      ? Math.round((progress.filter(m => m.status === 'completed').length / progress.length) * 100)
      : 0
  };

  const filteredMilestones = activeFilter === 'all' 
    ? progress 
    : progress?.filter(m => m.category.toLowerCase() === activeFilter.toLowerCase()) || [];

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.description.trim()) return;
    
    try {
      await addMilestone(newMilestone);
      setNewMilestone({
        title: '',
        description: '',
        category: 'Technical',
        status: 'upcoming',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleUpdateMilestone = async (milestoneId, updates) => {
    try {
      // Automatically set progress based on status if not provided
      if (updates.status && !updates.progress) {
        switch (updates.status) {
          case 'completed':
            updates.progress = 100;
            break;
          case 'in-progress':
            updates.progress = 50; // Default to 50% for in-progress
            break;
          case 'upcoming':
            updates.progress = 0;
            break;
        }
      }
      
      await updateMilestone(milestoneId, updates);
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
      try {
        await deleteMilestone(milestoneId);
      } catch (error) {
        console.error('Error deleting milestone:', error);
      }
 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 lg:p-8 xl:p-10">
            <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Progress</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 mb-6 lg:mb-8 xl:mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Progress Timeline</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-primary" size={24} />
                <span className="text-lg xl:text-xl font-medium text-gray-600">
                  {stats.overallProgress}% Complete
                </span>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium"
              >
                <Plus size={24} /> Add Milestone
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-6 lg:mb-8 xl:mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <Target className="text-primary" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl">Total Milestones</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2">{stats.totalMilestones}</div>
            <p className="text-gray-600 text-lg">Tracked</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <CheckCircle className="text-green-500" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl">Completed</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-green-500 mb-2">{stats.completed}</div>
            <p className="text-gray-600 text-lg">Achieved</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <Clock className="text-blue-500" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl">In Progress</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-500 mb-2">{stats.inProgress}</div>
            <p className="text-gray-600 text-lg">Active</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <Calendar className="text-orange-500" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl">Upcoming</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-orange-500 mb-2">{stats.upcoming}</div>
            <p className="text-gray-600 text-lg">Planned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {/* Timeline */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8 xl:space-y-10">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4 lg:mb-6">Milestones</h2>
              <div className="flex flex-wrap gap-3 lg:gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition ${
                      activeFilter === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Cards */}
            {progress && progress.length > 0 ? (
              <div className="space-y-6 lg:space-y-8 xl:space-y-10">
                {filteredMilestones.map((milestone) => (
                  <TimelineCard 
                    key={milestone._id} 
                    milestone={milestone}
                    onUpdate={(updates) => handleUpdateMilestone(milestone._id, updates)}
                    onDelete={() => handleDeleteMilestone(milestone._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 text-center">
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4">No Milestones Added Yet</h2>
                <p className="text-gray-600 text-lg mb-6">Start tracking your progress by adding your first milestone!</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium mx-auto"
                >
                  <Plus size={24} /> Add Your First Milestone
                </button>
              </div>
            )}
          </div>

          {/* Goals Sidebar */}
          <div className="space-y-6 lg:space-y-8 xl:space-y-10">
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-4 lg:mb-6">Progress Overview</h3>
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm lg:text-base">Overall Progress</span>
                    <span className="font-semibold text-gray-800 text-sm lg:text-base">{stats.overallProgress}%</span>
                  </div>
                  <ProgressBar value={stats.overallProgress} />
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 text-lg mb-3">Quick Actions</h4>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:scale-105 transition"
                  >
                    Add New Milestone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Milestone"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Title</label>
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                placeholder="e.g., Complete React Course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                placeholder="Describe your milestone..."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newMilestone.category}
                  onChange={(e) => setNewMilestone({...newMilestone, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                >
                  <option value="Technical">Technical</option>
                  <option value="Project">Project</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Presentation">Presentation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newMilestone.status}
                  onChange={(e) => setNewMilestone({...newMilestone, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
              <input
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddMilestone}
                disabled={!newMilestone.title.trim() || !newMilestone.description.trim()}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:scale-105 transition"
              >
                Add Milestone
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:scale-105 transition"
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

export default Progress; 