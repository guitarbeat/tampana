// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Tempana Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxrNUzyKD0gUivCzhq0IHWGFSv0xGpelA",
  authDomain: "tempana-9644a.firebaseapp.com",
  projectId: "tempana-9644a",
  storageBucket: "tempana-9644a.firebasestorage.app",
  messagingSenderId: "428639359548",
  appId: "1:428639359548:web:74db18a404dfed144ee939",
  measurementId: "G-ZGKGY2BD01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add scopes for Google Calendar API
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');

// Set custom parameters for Google Auth
googleProvider.setCustomParameters({
  client_id: "333143884910-cia7fvnjb1elnm3u3u73mp9eo339273s.apps.googleusercontent.com"
});

export { auth, googleProvider };
