import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth, googleProvider } from './config';

// Custom hook for Firebase authentication
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Get the token if user is logged in
      if (currentUser) {
        currentUser.getIdToken().then(idToken => {
          setToken(idToken);
        });
      } else {
        setToken(null);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get access token for API calls
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      
      // Check if this is a new user
      const details = getAdditionalUserInfo(result);
      const isNewUser = details?.isNewUser;
      
      return { user: result.user, accessToken, isNewUser };
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      return { error: err.message };
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      return { error: err.message };
    }
  };

  return {
    user,
    loading,
    error,
    token,
    signInWithGoogle,
    logOut
  };
};
