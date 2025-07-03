import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: '#d32f2f', padding: '2rem', textAlign: 'center' }}>
        <h2>Something went wrong.</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#d32f2f' }}>{this.state.error && this.state.error.toString()}</pre>
      </div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 