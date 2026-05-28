import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('AI Widget Error:', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {this.props.title || 'AI Feature Unavailable'}
              </p>
              <p className="text-xs text-gray-500">
                {this.props.description || 'This feature encountered an error'}
              </p>
            </div>
          </div>
          <button
            onClick={() => this.handleReset()}
            className="flex items-center gap-2 text-xs text-red-600 font-semibold hover:text-red-800"
          >
            <RefreshCw size={12} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;