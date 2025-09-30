import React, { ComponentType, ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { AppError } from '../types/errors';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: any) => void;
  componentName?: string;
}

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: any) => void;
  componentName?: string;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const WithErrorBoundaryComponent = (props: P) => {
    return (
      <ErrorBoundary
        fallback={options.fallback}
        onError={options.onError}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
  fallback,
  onError
}) => {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;