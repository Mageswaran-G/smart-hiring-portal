import { Component } from 'react';

// ErrorBoundary — catches JavaScript errors in child components
// Without this: any crash = blank white screen
// With this: crash = clean error message shown to user
// Must be a class component — React does not support error boundaries in function components

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called when a child component throws an error
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after an error is caught — good place for logging
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">

            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>

            <h2 className="font-sora font-bold text-gray-900 text-xl mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              An unexpected error occurred. Please refresh the page or contact support if the problem continues.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold cursor-pointer border-none hover:bg-gray-800 transition">
              Refresh Page
            </button>

            {/* Show error details in development only */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer">Error details</summary>
                <pre className="text-xs text-red-500 mt-2 bg-red-50 p-3 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;