import React, { useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Target, Star, Plus, RefreshCw } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { useIntern } from '../context/InternContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { 
    profile, 
    loading, 
    error, 
    overallProgress, 
    skillsCount, 
    averageRating,
    recalculateDashboardStats,
    progress,
    portfolio,
    skills,
    dailyTasks,
    loadDailyTasks
  } = useIntern();

  // Load daily tasks when component mounts
  useEffect(() => {
    if (profile) {
      loadDailyTasks();
      recalculateDashboardStats();
    }
  }, [profile]); // Only depend on profile, not functions

  const handleRefresh = useCallback(() => {
    recalculateDashboardStats();
    loadDailyTasks();
  }, [recalculateDashboardStats, loadDailyTasks]);

  // Memoize chart data to prevent unnecessary recalculations
  const dailyTasksData = useMemo(() => {
    if (!dailyTasks || dailyTasks.length === 0) {
      return {
        labels: ['No Tasks'],
        datasets: [{
          data: [1],
          backgroundColor: ['#f3f4f6'],
          borderColor: ['#d1d5db'],
          borderWidth: 1,
        }]
      };
    }

    const statusCounts = dailyTasks.reduce((acc, task) => {
      const status = task.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const colors = ['#ef4444', '#f97316', '#22c55e', '#3b82f6']; // Red, Orange, Green, Blue

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color + '80'),
        borderWidth: 2,
      }]
    };
  }, [dailyTasks]);

  const projectsData = useMemo(() => {
    if (!portfolio || portfolio.length === 0) {
      return {
        labels: ['No Projects'],
        datasets: [{
          label: 'Projects',
          data: [0],
          backgroundColor: '#fbbf24',
          borderColor: '#f59e0b',
          borderWidth: 1,
        }]
      };
    }

    // Group projects by category/type
    const projectCategories = portfolio.reduce((acc, project) => {
      const category = project.category || project.type || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(projectCategories);
    const data = Object.values(projectCategories);

    return {
      labels,
      datasets: [{
        label: 'Projects',
        data,
        backgroundColor: '#fbbf24',
        borderColor: '#f59e0b',
        borderWidth: 2,
      }]
    };
  }, [portfolio]);

  const skillsData = useMemo(() => {
    if (!skills || skills.length === 0) {
      return {
        labels: ['No Skills'],
        datasets: [{
          label: 'Skills',
          data: [0],
          backgroundColor: '#22c55e',
          borderColor: '#16a34a',
          borderWidth: 1,
        }]
      };
    }

    // Group skills by level
    const skillLevels = skills.reduce((acc, skill) => {
      const level = skill.level || 'Beginner';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(skillLevels);
    const data = Object.values(skillLevels);

    return {
      labels,
      datasets: [{
        label: 'Skills',
        data,
        backgroundColor: '#22c55e',
        borderColor: '#16a34a',
        borderWidth: 2,
      }]
    };
  }, [skills]);

  // Memoize chart options to prevent recreation
  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Daily Tasks Status',
        color: '#ef4444',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  }), []);

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Projects by Category',
        color: '#f59e0b',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }), []);

  const skillsBarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Skills by Level',
        color: '#16a34a',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }), []);

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
            <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 mb-6 lg:mb-8 xl:mb-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-10">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 xl:gap-10">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name || 'User'} 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, {profile?.name || 'Intern'}
                </h1>
                <p className="text-gray-600 text-lg xl:text-xl">{profile?.role || 'Intern'}</p>
              </div>
            </div>
           
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 mb-6 lg:mb-8 xl:mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <Target className="text-primary" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl">Overall Progress</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2">{overallProgress || 0}%</div>
            <ProgressBar value={overallProgress || 0} label="Completion" />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <User className="text-primary" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl">Skills Acquired</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2">{skillsCount || 0}</div>
            <p className="text-gray-600 text-lg">Technical & Soft Skills</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <Star className="text-primary" size={28} />
              <h3 className="font-semibold text-gray-800 text-lg xl:text-xl ">Feedback Rating</h3>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2 ">{(averageRating || 0).toFixed(1)}</div>
            <p className="text-gray-600 text-lg">Average Mentor Score</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mb-6 lg:mb-8 xl:mb-10">
          {/* Daily Tasks Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="h-80">
              <Pie data={dailyTasksData} options={pieOptions} />
            </div>
          </div>

          {/* Projects Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="h-80">
              <Bar data={projectsData} options={barOptions} />
            </div>
          </div>

          {/* Skills Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 xl:p-10">
            <div className="h-80">
              <Bar data={skillsData} options={skillsBarOptions} />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
          <Link
            to="/skills"
            className="bg-primary text-white rounded-2xl p-6 lg:p-8 xl:p-10 shadow-md hover:scale-105 transition flex items-center gap-4 lg:gap-6 xl:gap-8 group"
          >
            <div className="p-3 lg:p-4 xl:p-5 bg-white/20 rounded-xl group-hover:bg-white/30 transition">
              <Plus size={28} />
            </div>
            <div>
              <h3 className="font-semibold text-xl lg:text-2xl xl:text-3xl mb-2">Update Skills</h3>
              <p className="text-primary-100 text-sm lg:text-base xl:text-lg">Add new skills or update proficiency levels</p>
            </div>
          </Link>

          <Link
            to="/portfolio"
            className="bg-white text-gray-800 rounded-2xl p-6 lg:p-8 xl:p-10 shadow-md hover:scale-105 transition flex items-center gap-4 lg:gap-6 xl:gap-8 group"
          >
            <div className="p-3 lg:p-4 xl:p-5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition">
              <Plus size={28} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-xl lg:text-2xl xl:text-3xl mb-2">Upload Project</h3>
              <p className="text-gray-600 text-sm lg:text-base xl:text-lg">Showcase your latest work and achievements</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 