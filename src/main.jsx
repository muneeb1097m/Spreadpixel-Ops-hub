import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffaf5', padding: 24, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ maxWidth: 460, width: '100%', background: '#ffffff', borderRadius: 20, padding: 32, boxShadow: '0 20px 40px -10px rgba(15,23,42,0.1)', border: '1px solid #fed7aa', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fee2e2', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Something went wrong</h2>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: '0 0 24px' }}>
              {this.state.error?.message || "An unexpected error occurred while rendering the dashboard."}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                style={{ padding: '10px 20px', borderRadius: 10, background: '#ea580c', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
              >
                Reload Dashboard
              </button>
              <button 
                onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
                style={{ padding: '10px 20px', borderRadius: 10, background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
              >
                Sign In Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
