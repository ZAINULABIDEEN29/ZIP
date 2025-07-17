import React, { useState } from 'react';
import { Edit, Save, X, Mail, Phone, MapPin, Calendar, Briefcase, Award, Target } from 'lucide-react';
import AvatarUploader from '../components/AvatarUploader';
import AchievementBadge from '../components/AchievementBadge';
import { useIntern } from '../context/InternContext';

const Profile = () => {
  const { profile, skills, achievements, loading, error, updateProfile } = useIntern();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    role: '',
    category: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    education: ''
  });
  const [saving, setSaving] = useState(false);

  // Role options
  const roleOptions = [
    'Intern',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'AI/ML Engineer',
    'SQA Engineer',
    'DevOps Engineer',
    'UI/UX Designer',
    'Data Scientist',
    // Only new roles, no 'Intern' in the name
    'Video Editor',
    'Marketing'
  ];

  // Category options (matching the backend enum)
  const categoryOptions = [
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'fullstack', label: 'Full Stack Development' },
    { value: 'aiml', label: 'AI/ML Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'sqa', label: 'SQA Testing' },
    // Only new categories, no 'Intern' in the name
    { value: 'videoeditor', label: 'Video Editor' },
    { value: 'marketing', label: 'Marketing' }
  ];

  // Initialize edit data when profile loads
  React.useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || '',
        role: profile.role || 'Intern',
        category: profile.category || 'fullstack',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        education: profile.education || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: profile?.name || '',
      role: profile?.role || 'Intern',
      category: profile?.category || 'fullstack',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      education: profile?.education || ''
    });
    setIsEditing(false);
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
            <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Profile</h2>
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
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Profile</h1>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save size={20} /> Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium"
                    disabled={saving}
                  >
                    <X size={20} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition text-lg font-medium"
                >
                  <Edit size={20} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {/* Main Profile Info */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8 xl:space-y-10">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 xl:gap-10 mb-6 lg:mb-8">
                <AvatarUploader 
                  value={isEditing ? editData.avatar : profile?.avatar}
                  onChange={img => isEditing && setEditData({...editData, avatar: img})}
                  disabled={!isEditing}
                />
                <div className="text-center lg:text-left flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2 bg-transparent border-b-2 border-primary focus:outline-none text-center lg:text-left"
                    />
                  ) : (
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2">{profile?.name || 'Your Name'}</h2>
                  )}
                  {isEditing ? (
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({...editData, role: e.target.value})}
                      className="text-gray-600 text-lg xl:text-xl bg-transparent border-b-2 border-primary focus:outline-none text-center lg:text-left"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-600 text-lg xl:text-xl">{profile?.role || 'Your Role'}</p>
                  )}
                  
                  {/* Category Selection */}
                  {isEditing && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                      >
                        {categoryOptions.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Display current category when not editing */}
                  {!isEditing && profile?.category && (
                    <p className="text-gray-500 text-sm mt-2">
                      Category: {categoryOptions.find(cat => cat.value === profile.category)?.label || profile.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="text-primary flex-shrink-0" size={20} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="flex-1 bg-transparent border-b-2 border-primary focus:outline-none text-sm lg:text-base min-w-0"
                    />
                  ) : (
                    <span className="text-gray-700 text-sm lg:text-base truncate">{profile?.email || 'your.email@example.com'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <Phone className="text-primary flex-shrink-0" size={20} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="flex-1 bg-transparent border-b-2 border-primary focus:outline-none text-sm lg:text-base min-w-0"
                    />
                  ) : (
                    <span className="text-gray-700 text-sm lg:text-base truncate">{profile?.phone || 'Add your phone'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <MapPin className="text-primary flex-shrink-0" size={20} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="flex-1 bg-transparent border-b-2 border-primary focus:outline-none text-sm lg:text-base min-w-0"
                    />
                  ) : (
                    <span className="text-gray-700 text-sm lg:text-base truncate">{profile?.location || 'Add your location'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <span className="text-gray-700 text-sm lg:text-base truncate">
                    Started: {profile?.startDate ? new Date(profile.startDate).toLocaleDateString() : 'Add start date'}
                  </span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <Briefcase className="text-primary flex-shrink-0" size={20} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.education}
                      onChange={(e) => setEditData({...editData, education: e.target.value})}
                      className="flex-1 bg-transparent border-b-2 border-primary focus:outline-none text-sm lg:text-base min-w-0"
                      placeholder="e.g. BSc Computer Science, MIT"
                    />
                  ) : (
                    <span className="text-gray-700 text-sm lg:text-base truncate">{profile?.education !== undefined ? (profile.education || 'Add your education') : 'Add your education'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-4 lg:mb-6">About Me</h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                />
              ) : (
                <p className="text-gray-700 text-lg xl:text-xl leading-relaxed">
                  {profile?.bio || 'Tell us about yourself...'}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-4 lg:mb-6">Skills</h3>
              {skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-3 lg:gap-4">
                  {skills.map((skill, index) => (
                    <span key={skill._id || index} className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm lg:text-base font-medium">
                      {skill.name} - {skill.level}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No skills added yet. Add your skills in the Skills section!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-8 xl:space-y-10">
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Award className="text-primary" size={24} />
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800">Achievements</h3>
              </div>
              {achievements && achievements.length > 0 ? (
                <div className="space-y-4 lg:space-y-6">
                  {achievements.map((achievement) => (
                    <div key={achievement._id} className="border border-gray-200 rounded-xl p-4 lg:p-6">
                      <h4 className="font-semibold text-gray-800 text-sm lg:text-base mb-2">{achievement.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                        <AchievementBadge label={achievement.badge} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-lg">No achievements yet. Keep working hard!</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Target className="text-primary" size={24} />
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800">Quick Stats</h3>
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm lg:text-base">Skills</span>
                  <span className="font-semibold text-gray-800 text-sm lg:text-base">{skills?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm lg:text-base">Achievements</span>
                  <span className="font-semibold text-gray-800 text-sm lg:text-base">{achievements?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 