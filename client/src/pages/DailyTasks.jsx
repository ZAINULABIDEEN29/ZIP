import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Tag, CheckCircle, AlertCircle, PlayCircle, XCircle, Filter, BarChart3, FileText, Upload, RefreshCw } from 'lucide-react';
import Modal from '../components/Modal';
import { useIntern } from '../context/InternContext';

const DailyTasks = () => {
  const { dailyTasks, dailyTaskStats, loading, error, loadDailyTasks, addDailyTask, updateDailyTask, deleteDailyTask, loadDailyTaskStats } = useIntern();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    date: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Development',
    priority: 'Medium',
    status: 'pending',
    outcomes: [],
    timeSpent: { hours: 0, minutes: 0 },
    challenges: [],
    learnings: [],
    tags: [],
    notes: ''
  });

  const categories = ['Development', 'Learning', 'Meeting', 'Planning', 'Research', 'Testing', 'Documentation', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['pending', 'in-progress', 'completed', 'blocked'];

  useEffect(() => {
    loadDailyTasks(filters);
    loadDailyTaskStats();
  }, [filters]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const taskData = {
        ...newTask,
        outcomes: newTask.outcomes.filter(outcome => outcome.trim()),
        challenges: newTask.challenges.filter(challenge => challenge.trim()),
        learnings: newTask.learnings.filter(learning => learning.trim()),
        tags: newTask.tags.filter(tag => tag.trim()),
        date: new Date().toISOString()
      };
      
      await addDailyTask(taskData);
      await loadDailyTaskStats();
      setNewTask({
        title: '',
        description: '',
        category: 'Development',
        priority: 'Medium',
        status: 'pending',
        outcomes: [],
        timeSpent: { hours: 0, minutes: 0 },
        challenges: [],
        learnings: [],
        tags: [],
        notes: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      await updateDailyTask(taskId, updateData);
      await loadDailyTaskStats();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDailyTask(taskId);
      await loadDailyTaskStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Development': 'bg-blue-100 text-blue-800',
      'Learning': 'bg-purple-100 text-purple-800',
      'Meeting': 'bg-indigo-100 text-indigo-800',
      'Planning': 'bg-pink-100 text-pink-800',
      'Research': 'bg-teal-100 text-teal-800',
      'Testing': 'bg-cyan-100 text-cyan-800',
      'Documentation': 'bg-gray-100 text-gray-800',
      'Other': 'bg-slate-100 text-slate-800'
    };
    return colors[category] || colors['Other'];
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
            <h2 className="text-red-800 text-lg sm:text-xl font-semibold mb-2">Error Loading Daily Tasks</h2>
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
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Daily Tasks</h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-2">Track your daily accomplishments and progress</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-yellow-200 text-yellow-800 px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium"
              >
                🔄 Reset Auth
              </button> */}
              <button
                onClick={() => setShowStatsModal(true)}
                className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium"
              >
                <BarChart3 size={20} className="sm:w-6 sm:h-6" /> Statistics
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium"
              >
                <Plus size={20} className="sm:w-6 sm:h-6" /> Add Task
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({status: '', category: '', date: ''})}
                className="w-full bg-gray-100 text-gray-700 px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {dailyTasks && dailyTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
            {dailyTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 overflow-hidden">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2">{task.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3">{task.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {task.timeSpent && (task.timeSpent.hours > 0 || task.timeSpent.minutes > 0) && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <Clock size={14} />
                    <span>{task.timeSpent.hours}h {task.timeSpent.minutes}m</span>
                  </div>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        +{task.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(task.date).toLocaleDateString()}</span>
                  <span className="capitalize">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 xl:p-10 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-3 sm:mb-4">No Tasks Added Yet</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">Start tracking your daily accomplishments by adding your first task!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 hover:scale-105 transition text-sm sm:text-lg font-medium mx-auto"
            >
              <Plus size={20} className="sm:w-6 sm:h-6" /> Add Your First Task
            </button>
          </div>
        )}

        {/* Add Task Modal */}
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Daily Task"
        >
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Task Title *</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="What did you work on today?"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows={3}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="Describe what you accomplished..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  value={newTask.timeSpent.hours}
                  onChange={(e) => setNewTask({
                    ...newTask, 
                    timeSpent: {...newTask.timeSpent, hours: parseInt(e.target.value) || 0}
                  })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={newTask.timeSpent.minutes}
                  onChange={(e) => setNewTask({
                    ...newTask, 
                    timeSpent: {...newTask.timeSpent, minutes: parseInt(e.target.value) || 0}
                  })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={newTask.tags.join(', ')}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="react, frontend, bug-fix"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Outcomes (comma-separated)</label>
              <input
                type="text"
                value={newTask.outcomes.join(', ')}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  outcomes: e.target.value.split(',').map(outcome => outcome.trim()).filter(outcome => outcome)
                })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="Fixed login bug, improved performance"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Challenges (comma-separated)</label>
              <input
                type="text"
                value={newTask.challenges.join(', ')}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  challenges: e.target.value.split(',').map(challenge => challenge.trim()).filter(challenge => challenge)
                })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="API integration issues, time constraints"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Learnings (comma-separated)</label>
              <input
                type="text"
                value={newTask.learnings.join(', ')}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  learnings: e.target.value.split(',').map(learning => learning.trim()).filter(learning => learning)
                })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="New React hooks, debugging techniques"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newTask.notes}
                onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                rows={2}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="Additional notes or observations..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3">
              <button
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
                className="flex-1 bg-primary text-white py-1.5 sm:py-2 rounded-lg font-medium hover:scale-105 transition text-sm disabled:opacity-50"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-1.5 sm:py-2 rounded-lg font-medium hover:scale-105 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* Task Detail Modal */}
        <Modal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={selectedTask ? `Task: ${selectedTask.title}` : ''}
        >
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedTask.category}
                    onChange={(e) => setSelectedTask({...selectedTask, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={selectedTask.timeSpent?.hours || 0}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask, 
                      timeSpent: {...selectedTask.timeSpent, hours: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={selectedTask.timeSpent?.minutes || 0}
                    onChange={(e) => setSelectedTask({
                      ...selectedTask, 
                      timeSpent: {...selectedTask.timeSpent, minutes: parseInt(e.target.value) || 0}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={selectedTask.tags?.join(', ') || ''}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes (comma-separated)</label>
                <input
                  type="text"
                  value={selectedTask.outcomes?.join(', ') || ''}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask, 
                    outcomes: e.target.value.split(',').map(outcome => outcome.trim()).filter(outcome => outcome)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenges (comma-separated)</label>
                <input
                  type="text"
                  value={selectedTask.challenges?.join(', ') || ''}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask, 
                    challenges: e.target.value.split(',').map(challenge => challenge.trim()).filter(challenge => challenge)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learnings (comma-separated)</label>
                <input
                  type="text"
                  value={selectedTask.learnings?.join(', ') || ''}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask, 
                    learnings: e.target.value.split(',').map(learning => learning.trim()).filter(learning => learning)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectedTask.notes || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={async () => {
                    try {
                      await handleUpdateTask(selectedTask._id, selectedTask);
                    } catch (error) {
                      console.error('Error updating task:', error);
                    }
                  }}
                  className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  Update Task
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Statistics Modal */}
        <Modal
          open={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          title="Daily Tasks Statistics"
        >
          <div className="space-y-4">
            {/* Refresh Button */}
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  try {
                    await loadDailyTaskStats();
                  } catch (error) {
                    console.error('Error refreshing stats:', error);
                  }
                }}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition flex items-center gap-2"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading statistics...</p>
              </div>
            ) : dailyTaskStats ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800">{dailyTaskStats.totalTasks || 0}</h3>
                    <p className="text-sm text-blue-600">Total Tasks</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800">{dailyTaskStats.completedTasks || 0}</h3>
                    <p className="text-sm text-green-600">Completed</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800">{dailyTaskStats.inProgressTasks || 0}</h3>
                    <p className="text-sm text-yellow-600">In Progress</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800">{dailyTaskStats.blockedTasks || 0}</h3>
                    <p className="text-sm text-red-600">Blocked</p>
                  </div>
                </div>

                {dailyTaskStats.categoryBreakdown && Object.keys(dailyTaskStats.categoryBreakdown).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Category Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(dailyTaskStats.categoryBreakdown).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category}</span>
                          <span className="text-sm font-medium text-gray-800">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dailyTaskStats.priorityBreakdown && Object.keys(dailyTaskStats.priorityBreakdown).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Priority Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(dailyTaskStats.priorityBreakdown).map(([priority, count]) => (
                        <div key={priority} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{priority}</span>
                          <span className="text-sm font-medium text-gray-800">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">Total Time Spent</h4>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.floor(dailyTaskStats.totalTimeSpent || 0)}h {Math.round(((dailyTaskStats.totalTimeSpent || 0) % 1) * 60)}m
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No statistics available</p>
                <p className="text-sm text-gray-500 mt-1">Add some tasks to see statistics</p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DailyTasks; 