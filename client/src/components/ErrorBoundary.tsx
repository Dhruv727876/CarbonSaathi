import { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    log('CRITICAL_INTERFACE_ERROR:', error, errorInfo);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-6 bg-red-50 text-red-900 border border-red-200 rounded-lg">
          <h1 className="text-xl font-bold">Something went wrong.</h1>
          <p className="text-gray-600">The interface engine has caught an operational runtime crash.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
