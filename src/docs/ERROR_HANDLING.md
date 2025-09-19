# Error Handling Documentation

This document describes the comprehensive error handling system implemented in the Tampana application.

## Overview

The error handling system provides:
- Centralized error management
- User-friendly error notifications
- Automatic retry logic
- Error logging and monitoring
- Graceful degradation
- Network error handling

## Architecture

### Core Components

1. **Error Types & Severity** (`src/types/errors.ts`)
2. **Error Handler** (`src/utils/errorHandler.ts`)
3. **Error Notifications** (`src/hooks/useErrorNotifications.ts`)
4. **Error Boundary** (`src/ErrorBoundary.tsx`)
5. **Storage Manager** (`src/utils/storage.ts`)
6. **Network Error Handler** (`src/utils/networkErrorHandler.ts`)
7. **Error Logger** (`src/utils/errorLogger.ts`)

## Error Types

### ErrorType Enum
- `NETWORK` - Network connectivity issues
- `VALIDATION` - Input validation errors
- `STORAGE` - Local storage failures
- `API` - API request/response errors
- `UNKNOWN` - Unclassified errors

### ErrorSeverity Enum
- `LOW` - Minor issues, non-blocking
- `MEDIUM` - Moderate issues, may affect functionality
- `HIGH` - Serious issues, significant impact
- `CRITICAL` - Critical issues, application may be unusable

## Usage Examples

### Basic Error Handling

```typescript
import { errorHandler, createError, ErrorType, ErrorSeverity } from './utils/errorHandler';

// Create an error
const error = createError(
  ErrorType.VALIDATION,
  'Invalid email format',
  ErrorSeverity.MEDIUM,
  {
    code: 'INVALID_EMAIL',
    details: { email: 'invalid-email' },
    context: 'UserRegistration',
    recoverable: true,
    retryable: false
  }
);

// Handle the error
errorHandler.handleError(error, {
  component: 'UserRegistration',
  action: 'validateEmail',
  userId: 'user123'
});
```

### Retry Logic

```typescript
import { withRetry } from './utils/errorHandler';

const result = await withRetry(
  () => fetch('/api/data'),
  { maxAttempts: 3, delay: 1000 },
  { component: 'DataFetcher', action: 'fetchData' }
);
```

### Error Boundary

```typescript
import { withErrorBoundary } from './utils/errorHandler';

const safeFunction = withErrorBoundary(
  () => riskyOperation(),
  'fallback value',
  { component: 'RiskyComponent', action: 'performOperation' }
);
```

### Storage Operations

```typescript
import { getStorageItem, setStorageItem } from './utils/storage';

// Safe get operation
const result = getStorageItem<UserData>('userData', {
  defaultValue: { name: '', email: '' },
  fallbackToMemory: true,
  silent: false
});

if (result.success) {
  console.log('User data:', result.data);
} else {
  console.error('Failed to load user data:', result.error);
}

// Safe set operation
const saveResult = setStorageItem('userData', userData, {
  fallbackToMemory: true,
  silent: false
});
```

### Network Requests

```typescript
import { networkGet, networkPost, isOnline } from './utils/networkErrorHandler';

// Check connectivity
if (!isOnline()) {
  console.log('User is offline');
  return;
}

// Make requests with error handling
const response = await networkGet<UserData>('/api/user', {
  timeout: 5000,
  retries: 3,
  headers: { 'Authorization': 'Bearer token' }
});

if (response.success) {
  console.log('User data:', response.data);
} else {
  console.error('Request failed:', response.error);
}
```

### Error Notifications

```typescript
import { useErrorNotifications } from './hooks/useErrorNotifications';

function MyComponent() {
  const { showError, showSuccess, showWarning } = useErrorNotifications();

  const handleAction = async () => {
    try {
      await riskyOperation();
      showSuccess('Operation completed successfully');
    } catch (error) {
      showError(error);
    }
  };

  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
}
```

## Error Boundary Component

The `ErrorBoundary` component catches JavaScript errors anywhere in the component tree and displays a fallback UI.

### Features
- Retry mechanism (up to 3 attempts)
- Detailed error information in development
- Multiple recovery options (retry, reload, reset)
- Automatic error logging

### Usage

```tsx
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.log('Error caught by boundary:', error);
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Error Logging

The error logging system automatically tracks all errors with context information.

### Features
- Automatic error logging
- Breadcrumb tracking
- Error statistics
- Export functionality
- Trend analysis

### Usage

```typescript
import { addBreadcrumb, getErrorStats, exportLogs } from './utils/errorLogger';

// Add breadcrumbs for debugging
addBreadcrumb('User clicked submit button', 'user-action');
addBreadcrumb('Form validation started', 'validation');

// Get error statistics
const stats = getErrorStats();
console.log('Total errors:', stats.totalErrors);

// Export error logs
const logsJson = exportLogs();
```

## Configuration

### Error Handler Configuration

```typescript
import { errorHandler } from './utils/errorHandler';

errorHandler.updateConfig({
  maxRetries: 5,
  retryDelay: 2000,
  showUserNotification: true,
  logToConsole: true,
  reportToService: true
});
```

### Network Handler Configuration

```typescript
import { setNetworkDefaults } from './utils/networkErrorHandler';

setNetworkDefaults({
  timeout: 15000,
  retries: 5,
  retryDelay: 2000
});
```

## Best Practices

### 1. Always Use Error Boundaries
Wrap components that might fail with error boundaries to prevent the entire app from crashing.

### 2. Provide Fallback Values
Always provide fallback values for operations that might fail.

### 3. Use Appropriate Error Severity
- Use `LOW` for minor issues that don't affect functionality
- Use `MEDIUM` for issues that affect some functionality
- Use `HIGH` for issues that significantly impact the user experience
- Use `CRITICAL` for issues that make the app unusable

### 4. Add Context Information
Always provide context when handling errors to help with debugging.

### 5. Use Retry Logic Appropriately
- Only retry operations that are idempotent
- Use exponential backoff for retries
- Set reasonable retry limits

### 6. Log Errors Appropriately
- Log errors with sufficient context
- Use breadcrumbs to track user actions
- Don't log sensitive information

### 7. Handle Network Errors Gracefully
- Check connectivity before making requests
- Provide offline functionality where possible
- Queue requests when offline

## Error Recovery Strategies

### 1. Automatic Retry
For transient errors, implement automatic retry with exponential backoff.

### 2. Fallback Data
Provide fallback data when primary data sources fail.

### 3. Graceful Degradation
Disable non-essential features when errors occur.

### 4. User Notification
Inform users about errors and provide recovery options.

### 5. Data Persistence
Save user data locally to prevent data loss during errors.

## Monitoring and Debugging

### Error Statistics
The system automatically tracks:
- Total error count
- Errors by type and severity
- Recent errors
- Error trends over time

### Error Export
Export error logs for analysis:
```typescript
const logs = exportLogs();
// Save or send logs for analysis
```

### Development Tools
In development mode, the error boundary shows detailed error information including:
- Error type and severity
- Stack trace
- Context information
- Recovery options

## Accessibility

The error handling system includes comprehensive accessibility features:

### Error Notifications
- **ARIA Roles**: Notifications use `role="alert"` and `aria-live="polite"` for screen readers
- **Focus Management**: Buttons are keyboard accessible with proper focus indicators
- **Descriptive Labels**: All interactive elements have descriptive `aria-label` attributes
- **Screen Reader Support**: Error messages are announced to screen readers

### Error Boundary
- **ARIA Live Regions**: Error boundary uses `aria-live="assertive"` for critical errors
- **Keyboard Navigation**: All recovery buttons are keyboard accessible
- **Focus Indicators**: Clear focus indicators for keyboard users
- **Semantic HTML**: Proper heading structure and semantic elements

### Best Practices
1. **Error Announcements**: Critical errors are announced immediately to screen readers
2. **Focus Management**: Focus is managed appropriately when errors occur
3. **High Contrast**: Error messages use high contrast colors for visibility
4. **Descriptive Text**: Error messages are clear and descriptive
5. **Recovery Options**: Multiple recovery options are provided with clear labels

## Testing Error Handling

### Unit Tests
Test error handling in isolation:
```typescript
import { errorHandler } from './utils/errorHandler';

test('handles validation error', () => {
  const error = createError(ErrorType.VALIDATION, 'Invalid input');
  const result = errorHandler.handleError(error);
  expect(result.type).toBe(ErrorType.VALIDATION);
});
```

### Integration Tests
Test error handling in component context:
```typescript
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

test('error boundary catches errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

### Accessibility Tests
Test accessibility features:
```typescript
import { render, screen } from '@testing-library/react';
import { useErrorNotifications } from './hooks/useErrorNotifications';

test('error notifications are accessible', () => {
  const { result } = renderHook(() => useErrorNotifications());
  
  result.current.showError({
    type: 'VALIDATION',
    severity: 'MEDIUM',
    message: 'Test error',
    timestamp: new Date().toISOString(),
    recoverable: true,
    retryable: false
  });

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByLabelText(/dismiss/i)).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Errors not being caught**: Ensure error boundaries are properly placed
2. **Storage errors**: Check if localStorage is available and has space
3. **Network errors**: Verify connectivity and API endpoints
4. **Retry loops**: Check retry configuration and error types

### Debug Mode
Enable debug mode to see detailed error information:
```typescript
// In development
process.env.NODE_ENV = 'development';
```

This will show detailed error information in the error boundary and console logs.