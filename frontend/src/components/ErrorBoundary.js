import React from 'react';

class ErrorBoundary extends React.Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 24 }}>
                    <h2>Something went wrong</h2>
                    {/*<p>{this.state.error.message}</p>*/}
                    <button onClick={() => window.location.reload()}>Reload page</button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;