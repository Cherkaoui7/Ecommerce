import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import reportError from '../utils/errorReporter';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to error tracking service in production
        if (import.meta.env.MODE === 'production') {
            reportError(error, {
                source: 'error-boundary',
                componentStack: errorInfo.componentStack,
            });
        } else {
            console.error('Uncaught error:', error, errorInfo);
        }
        this.setState({
            error,
            errorInfo
        });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 min-h-screen text-red-900 font-mono">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                    <details className="whitespace-pre-wrap">
                        <summary className="font-semibold cursor-pointer mb-2">Error Details</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
