export function VerifyEmailDisplay({ status, onBackToLogin }) {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Verifying your email...
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Email verified successfully!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Redirecting you to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Verification failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={onBackToLogin}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
} 