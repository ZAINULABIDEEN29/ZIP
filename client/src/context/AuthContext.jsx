import React, { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from '../components/Toast';

const BACKEND_URL= import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Start with true to show loading
  const [isValidating, setIsValidating] = useState(false);

  // Development mode: completely skip token validation
  // const DEV_MODE = false; // Set to false in production

  // Check if user is authenticated - more robust check
  const isAuthenticated = !!(token && (user || localStorage.getItem('userData')));

  // Backup localStorage data to sessionStorage
  const backupAuthData = () => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (authToken && authToken !== 'null' && authToken !== 'undefined') {
      sessionStorage.setItem('backup_authToken', authToken);
    }
    if (userData && userData !== 'null' && userData !== 'undefined' && userData !== '""') {
      sessionStorage.setItem('backup_userData', userData);
    }
  };

  // Restore from backup if localStorage is empty
  const restoreFromBackup = () => {
    const backupToken = sessionStorage.getItem('backup_authToken');
    const backupUser = sessionStorage.getItem('backup_userData');
    
    if (backupToken && !localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', backupToken);
    }
    
    if (backupUser && !localStorage.getItem('userData')) {
      localStorage.setItem('userData', backupUser);
    }
  };

  // Clean up null values from localStorage
  const cleanupLocalStorage = () => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken === 'null' || authToken === 'undefined' || authToken === '""') {
      localStorage.removeItem('authToken');
    }
    
    if (userData === 'null' || userData === 'undefined' || userData === '""') {
      localStorage.removeItem('userData');
    }
  };

  // Validate token on app load (only once)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, clean up any null values
        cleanupLocalStorage();
        
        // Then, try to restore from backup if localStorage is empty
        restoreFromBackup();
        
    // Restore from localStorage immediately
    const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('userData');
        
        
        // Add a safeguard - if we had data before but it's gone now, log it
        const previousToken = sessionStorage.getItem('previousToken');
        const previousUser = sessionStorage.getItem('previousUser');
        
        if (previousToken && !storedToken) {
          console.error(' WARNING: Token was cleared from localStorage! Previous token existed.');
        }
        if (previousUser && !storedUser) {
          console.error(' WARNING: User data was cleared from localStorage! Previous user existed.');
        }
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          
          // Safe JSON parsing with error handling
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && typeof parsedUser === 'object') {
              setUser(parsedUser);
            } else {
              console.error(' Invalid user data in localStorage:', storedUser);
              // Try to restore from backup
              restoreFromBackup();
              const backupUser = sessionStorage.getItem('backup_userData');
              if (backupUser) {
                try {
                  const parsedBackupUser = JSON.parse(backupUser);
                  if (parsedBackupUser && typeof parsedBackupUser === 'object') {
                    setUser(parsedBackupUser);
                    localStorage.setItem('userData', backupUser);
                  }
                } catch (backupError) {
                  console.error(' Failed to parse backup user data:', backupError);
                }
              }
            }
          } catch (parseError) {
            console.error(' Failed to parse user data from localStorage:', parseError);
            // Try to restore from backup
            restoreFromBackup();
            const backupUser = sessionStorage.getItem('backup_userData');
            if (backupUser) {
              try {
                const parsedBackupUser = JSON.parse(backupUser);
                if (parsedBackupUser && typeof parsedBackupUser === 'object') {
                  setUser(parsedBackupUser);
                  localStorage.setItem('userData', backupUser);
                }
              } catch (backupError) {
                console.error('Failed to parse backup user data:', backupError);
              }
            }
          }
          
        setLoading(false);

          // Store current data in sessionStorage for comparison and backup
          sessionStorage.setItem('previousToken', storedToken);
          sessionStorage.setItem('previousUser', storedUser);
          backupAuthData(); // Create backup
          
          // Validate token in background (don't block UI)
          try {
            const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: {
          'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
            });
            
            if (response.ok) {
              const data = await response.json();
              
              // Only update user data if we actually received valid user data
              if (data.user && typeof data.user === 'object') {
            setUser(data.user);
            localStorage.setItem('userData', JSON.stringify(data.user));
                backupAuthData(); // Update backup with new data
              } else {
                console.warn('⚠️ Backend returned invalid user data, keeping existing data');
                // Keep the existing user data, don't overwrite with null
              }
            } else {
              console.warn(' Token validation failed, but keeping user logged in with stored data');
              // Keep the original stored user data - don't overwrite it
            }
          } catch (error) {
            console.warn(' Backend validation failed, but keeping user logged in with stored data:', error.message);
            // Keep the original stored user data - don't overwrite it
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error(' Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Add storage event listener to detect localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        
        // If auth data was removed, log it
        if (e.key === 'authToken' && e.oldValue && !e.newValue) {
          console.error(' WARNING: authToken was removed from localStorage!');
        }
        if (e.key === 'userData' && e.oldValue && !e.newValue) {
          console.error(' WARNING: userData was removed from localStorage!');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up periodic backup every 30 seconds
    const backupInterval = setInterval(() => {
      if (localStorage.getItem('authToken') || localStorage.getItem('userData')) {
        backupAuthData();
      }
    }, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(backupInterval);
    };
  }, []); // Only run on mount

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Validate data before storing
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server - missing token or user data');
      }
      
      // Store token and user immediately
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      
      // Create backup
      backupAuthData();
      
      
      showToast('Login successful!');
      return data;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      showToast(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      showToast('Registration successful! Please login with your credentials.');
      return data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Clear sessionStorage backups
    sessionStorage.removeItem('backup_authToken');
    sessionStorage.removeItem('backup_userData');
    sessionStorage.removeItem('previousToken');
    sessionStorage.removeItem('previousUser');
    
    // Clear state
    setToken(null);
    setUser(null);
    
  };

  // Update user data (for profile updates)
  const updateUser = (updatedUserData) => {
    
    // Validate input data
    if (!updatedUserData || typeof updatedUserData !== 'object') {
      console.error(' Invalid user data provided for update:', updatedUserData);
      return;
    }
    
    const newUserData = { ...user, ...updatedUserData };
    
    // Validate the merged data
    if (!newUserData || typeof newUserData !== 'object') {
      console.error(' Invalid merged user data:', newUserData);
      return;
    }
    
    setUser(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData));
    backupAuthData(); // Create backup after update
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 