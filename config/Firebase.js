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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export { app };
export default app;