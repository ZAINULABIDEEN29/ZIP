import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL= import.meta.env.VITE_API_URL;
export default function ApproveProject() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Approving project...');
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    async function approve() {
      // Prevent multiple API calls
      if (hasProcessed) {
        return;
      }
      setHasProcessed(true);

      try {
        // Adjust the base URL if needed
        // const baseURL = process.env.NODE_ENV === 'production'
        //   ? 'https://your-backend-domain.com/api/interns'
        //   : 'http://localhost:5000/api/interns';
        
        
        const response = await axios.get(`${BACKEND_URL}/api/interns/approve-project?token=${token}`);

        
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message || 'Project approved successfully! The intern can now see this project in their Zimlitech projects section.');
        } else {
          setStatus('error');
          setMessage(response.data.error || 'Approval failed');
        }
        
        // Don't redirect immediately, let user see the success message
        setTimeout(() => navigate('/'), 5000);
      } catch (err) {
        
        // Check if it's a 404 (token already used/invalid) or other error
        if (err.response?.status === 404) {
          setStatus('error');
          setMessage('This approval link has already been used or is invalid.');
        } else if (err.response?.status === 400) {
          setStatus('error');
          setMessage('Invalid approval link format.');
        } else {
          setStatus('error');
          setMessage(`Approval failed: ${err.response?.data?.error || err.message || 'Unknown error'}`);
        }
        
        setTimeout(() => navigate('/'), 5000);
      }
    }
    
    if (token && !hasProcessed) {
      approve();
    } else if (!token) {
      setStatus('error');
      setMessage('No approval token provided.');
      setTimeout(() => navigate('/'), 5000);
    }
  }, [token, navigate, hasProcessed]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className={`p-8 rounded-lg shadow-lg max-w-md w-full mx-4 ${
        status === 'success' ? 'bg-green-50 border border-green-200' : 
        status === 'error' ? 'bg-red-50 border border-red-200' : 
        'bg-white border border-gray-200'
      }`}>
        <div className="text-center">
          {status === 'success' && (
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {status === 'pending' && (
            <div className="text-blue-600 mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
          
          <h2 className={`text-xl font-semibold mb-4 ${
            status === 'success' ? 'text-green-800' : 
            status === 'error' ? 'text-red-800' : 
            'text-gray-800'
          }`}>
            {status === 'success' ? 'Project Approved!' : 
             status === 'error' ? 'Approval Failed' : 
             'Processing Approval...'}
          </h2>
          
          <p className={`text-sm ${
            status === 'success' ? 'text-green-700' : 
            status === 'error' ? 'text-red-700' : 
            'text-gray-600'
          }`}>
            {message}
          </p>
          
          {status !== 'pending' && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-3">
                Redirecting in a few seconds...
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Go to Home Page Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 