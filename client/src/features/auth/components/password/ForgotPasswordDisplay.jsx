import { Link } from 'react-router-dom';

export function ForgotPasswordDisplay({ 
  email,
  onEmailChange,
  error,
  submitted,
  onSubmit
}) {
  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Check your email</h2>
        <p className="text-gray-600 dark:text-gray-300">
          If an account exists with <span className="font-medium">{email}</span>, you will receive a password reset link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-8 space-y-6 px-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Reset Password</h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Send Reset Link
      </button>

      <div className="text-sm text-center">
        <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
          Back to login
        </Link>
      </div>
    </form>
  );
}
