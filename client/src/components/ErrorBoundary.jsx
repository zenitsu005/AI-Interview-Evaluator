import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-6 select-none text-left">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed">
              The application encountered a temporary error. You can safely return to the home screen.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left mb-6 text-xs text-slate-700 font-mono overflow-x-auto">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="py-3 px-8 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
