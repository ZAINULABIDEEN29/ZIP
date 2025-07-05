import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import SkillLevelTag from '../components/SkillLevelTag';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import { useIntern } from '../context/InternContext';
import toast from 'react-hot-toast';
import axios from 'axios'

const BACKEND_URL= import.meta.env.VITE_API_URL;

const Skills = () => {
  const { skills, loading, error, addSkill, updateSkill, deleteSkill } = useIntern();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingSkills, setDeletingSkills] = useState(new Set());
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Technical',
    level: 'Beginner'
  });

  const categories = ['Technical', 'Soft Skills', 'Tools'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    // Show loading toast
    const loadingToast = toast.loading('Submitting skill for approval...');
    
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.post(`${BACKEND_URL}/api/skills/request-approval`,newSkill,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Skill submitted for admin approval");
      
      setNewSkill({name:'',category:'Technical',level:'Beginner'});
      setShowAddModal(false);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || 'Failed to submit skill for approval');
 
    }
  };

  const handleUpdateSkillLevel = async (skillId, level) => {
    try {
      await updateSkill(skillId, { level });
    } catch (error) {
      toast.error('Error updating skill:', error);
    }
  };

  const handleToggleCompletion = async (skillId, currentCompleted) => {
    try {
      await updateSkill(skillId, { completed: !currentCompleted });
    } catch (error) {
      toast.error('Error updating skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      setDeletingSkills(prev => new Set(prev).add(skillId));
      await deleteSkill(skillId);
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setDeletingSkills(prev => {
        const newSet = new Set(prev);
        newSet.delete(skillId);
        return newSet;
      });
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
            <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Skills</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 mb-6 lg:mb-8 xl:mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Skills Tracker</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium"
            >
              <Plus size={24} /> Add Skill
            </button>
          </div>
        </div>

        {skills && skills.length > 0 ? (
          Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 mb-6 lg:mb-8 xl:mb-10">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-6 lg:mb-8">Category: {category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
                {categorySkills.map((skill) => (
                  <div key={skill._id} className="border border-gray-200 rounded-xl p-6 lg:p-8 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-800 text-lg lg:text-xl xl:text-2xl">{skill.name}</h3>
                      <div className="flex items-center gap-2">
                        {skill.mentorValidated && (
                          <CheckCircle className="text-green-500" size={20} title="Mentor Validated" />
                        )}
                        <button
                          onClick={() => handleToggleCompletion(skill._id, skill.completed)}
                          className={`w-5 h-5 rounded-full border-2 ${
                            skill.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}
                          title={skill.completed ? 'Completed' : 'Mark as completed'}
                        />
                        <button
                          onClick={() => handleDeleteSkill(skill._id)}
                          disabled={deletingSkills.has(skill._id)}
                          className={`transition ${
                            deletingSkills.has(skill._id)
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-500 hover:text-red-700'
                          }`}
                          title={deletingSkills.has(skill._id) ? 'Deleting...' : 'Delete skill'}
                        >
                          {deletingSkills.has(skill._id) ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 mb-4">
                      <SkillLevelTag level={skill.level} />
                      <Dropdown
                        options={levels.map(level => ({ label: level, value: level }))}
                        value={skill.level}
                        onChange={(level) => handleUpdateSkillLevel(skill._id, level)}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      Started: {new Date(skill.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 text-center">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4">No Skills Added Yet</h2>
            <p className="text-gray-600 text-lg mb-6">Start building your skills portfolio by adding your first skill!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium mx-auto"
            >
              <Plus size={24} /> Add Your First Skill
            </button>
          </div>
        )}

        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Skill"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                placeholder="e.g., React.js"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Dropdown
                options={categories.map(cat => ({ label: cat, value: cat }))}
                value={newSkill.category}
                onChange={(category) => setNewSkill({...newSkill, category})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <Dropdown
                options={levels.map(level => ({ label: level, value: level }))}
                value={newSkill.level}
                onChange={(level) => setNewSkill({...newSkill, level})}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddSkill}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:scale-105 transition"
                disabled={!newSkill.name.trim()}
              >
                Add Skill
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

export default Skills; 