import React, { useState } from 'react';
import { Plus, Star, MessageSquare, Calendar, User, Trash2 } from 'lucide-react';
import MentorFeedbackCard from '../components/MentorFeedbackCard';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { useIntern } from '../context/InternContext';

const Feedback = () => {
  const { feedback, loading, error, addFeedback, deleteFeedback } = useIntern();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    mentor: '',
    role: '',
    rating: 5,
    comment: '',
    category: 'Technical Skills'
  });

  const categories = ['Technical Skills', 'Design Skills', 'Soft Skills', 'Communication', 'Leadership'];

  const handleAddFeedback = async () => {
    if (!newFeedback.mentor.trim() || !newFeedback.comment.trim()) return;
    
    try {
      await addFeedback('mentor', newFeedback);
      setNewFeedback({
        mentor: '',
        role: '',
        rating: 5,
        comment: '',
        category: 'Technical Skills'
      });
      setShowAddModal(false);
    } catch (error) {
      throw error
      console.error('Error adding feedback:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
      try {
        await deleteFeedback(feedbackId);
      } catch (error) {
        throw error
        console.error('Error deleting feedback:', error);
      }
   
  };

  // Convert feedback object to array for easier handling
  const feedbackArray = feedback ? Object.values(feedback).flat() : [];
  const averageRating = feedbackArray.length > 0 
    ? feedbackArray.reduce((acc, item) => acc + item.rating, 0) / feedbackArray.length 
    : 0;

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
            <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Feedback</h2>
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
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Mentorship Feedback</h1>
           {newFeedback.role === "mentor" ?  <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium"
            >
              <Plus size={24} /> Add Feedback
            </button> : ""}
          </div>
        </div>

        {/* Overall Rating */}
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 mb-6 lg:mb-8 xl:mb-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 xl:gap-10">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2">Overall Rating</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                <div className="flex items-center gap-1">
                  <StarRating value={averageRating} size={32} />
                </div>
              </div>
              <p className="text-gray-600 text-lg xl:text-xl">Based on {feedbackArray.length} mentor reviews</p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {categories.map(category => {
                  const categoryFeedback = feedbackArray.filter(f => f.category === category);
                  const avgRating = categoryFeedback.length > 0 
                    ? categoryFeedback.reduce((acc, f) => acc + f.rating, 0) / categoryFeedback.length 
                    : 0;
                  return (
                    <div key={category} className="bg-gray-50 rounded-xl p-4 lg:p-6">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">{category}</h3>
                      <div className="flex items-center gap-2">
                        <StarRating value={avgRating} size={20} />
                        <span className="text-sm text-gray-600">{avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {feedbackArray.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
            {feedbackArray.map((item) => (
              <MentorFeedbackCard 
                key={item._id} 
                feedback={item}
                onDelete={() => handleDeleteFeedback(item._id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 text-center">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-4">No Feedback Received Yet</h2>
            <p className="text-gray-600 text-lg mb-6">Start collecting feedback from your mentors to track your progress!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium mx-auto"
            >
              <Plus size={24} /> Add Your First Feedback
            </button>
          </div>
        )}

        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Feedback"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mentor Name</label>
                <input
                  type="text"
                  value={newFeedback.mentor}
                  onChange={(e) => setNewFeedback({...newFeedback, mentor: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mentor Role</label>
                <input
                  type="text"
                  value={newFeedback.role}
                  onChange={(e) => setNewFeedback({...newFeedback, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                  placeholder="e.g., Senior Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newFeedback.category}
                onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                <StarRating 
                  value={newFeedback.rating} 
                  onChange={(rating) => setNewFeedback({...newFeedback, rating})}
                  size={32}
                />
                <span className="text-lg font-medium text-gray-700">{newFeedback.rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                placeholder="Enter mentor feedback..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddFeedback}
                disabled={!newFeedback.mentor.trim() || !newFeedback.comment.trim()}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:scale-105 transition"
              >
                Add Feedback
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

export default Feedback; 