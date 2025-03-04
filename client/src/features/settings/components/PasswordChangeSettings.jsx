import { useNavigate } from 'react-router-dom';

export function PasswordChangeSettings() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
      
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          To change your password, you'll be redirected to our secure password reset flow.
        </p>
        
        <button
          onClick={() => navigate('/forgot-password')}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Change Password
        </button>
      </div>
    </div>
  );
} 