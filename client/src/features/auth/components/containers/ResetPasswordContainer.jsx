import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { ResetPasswordDisplay } from '../password/ResetPasswordDisplay';
import { Link } from 'react-router-dom';

export function ResetPasswordContainer() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isValidToken,
    isLoading,
    handleSubmit
  } = useResetPassword();

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link 
            to="/forgot-password"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResetPasswordDisplay
      password={password}
      onPasswordChange={setPassword}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={setConfirmPassword}
      error={error}
      onSubmit={handleSubmit}
    />
  );
} 