import React from 'react';
import { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from './auth';
import { useGoogleCalendar, GoogleCalendarEvent } from './calendar';

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  accessToken: string | null;
  events: GoogleCalendarEvent[];
  eventsLoading: boolean;
  eventsError: string | null;
  signInWithGoogle: () => Promise<any>;
  logOut: () => Promise<any>;
  fetchCalendarEvents: (startDate?: Date, endDate?: Date) => Promise<void>;
  convertToAppEvents: () => any[];
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading, error, token, signInWithGoogle: firebaseSignIn, logOut } = useAuth();
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const { events, loading: eventsLoading, error: eventsError, fetchCalendarEvents, convertToAppEvents } = useGoogleCalendar(accessToken);

  // Enhanced sign in function to store access token
  const signInWithGoogle = async () => {
    const result = await firebaseSignIn();
    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }
    return result;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    token,
    accessToken,
    events,
    eventsLoading,
    eventsError,
    signInWithGoogle,
    logOut,
    fetchCalendarEvents,
    convertToAppEvents
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
