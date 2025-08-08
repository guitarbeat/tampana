import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: unknown;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          padding: 24
        }}>
          <h2 style={{ marginBottom: 12 }}>Something went wrong.</h2>
          <div style={{ opacity: 0.8, marginBottom: 16, fontSize: 14 }}>
            {process.env.NODE_ENV !== 'production' && String(this.state.error)}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={this.handleRetry} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Try again</button>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#4ECDC4' }}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
