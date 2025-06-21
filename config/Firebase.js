// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3E6_TCNgAQ3BAuF8bMwWMJBfzk-k8l0I",
  authDomain: "martyrs-efe83.firebaseapp.com",
  projectId: "martyrs-efe83",
  storageBucket: "martyrs-efe83.firebasestorage.app",
  messagingSenderId: "1049618037982",
  appId: "1:1049618037982:web:c894b33a2ccbf0c71a964f",
  measurementId: "G-SL5V44HJZ4"
};

// Validate Firebase config
const validateFirebaseConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing Firebase config fields:', missingFields);
    return false;
  }
  
  return true;
};

// Initialize Firebase with error handling
let app;
try {
  if (!validateFirebaseConfig(firebaseConfig)) {
    throw new Error('Invalid Firebase configuration');
  }
  
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  // Only initialize analytics in browser environment
  if (typeof window !== 'undefined') {
    try {
      const analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } catch (analyticsError) {
      console.warn('Firebase Analytics initialization failed:', analyticsError.message);
    }
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw error;
}

export { app };
export default app;