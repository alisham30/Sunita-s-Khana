// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8e8T8beECb343XN7GpgzmkgiCzfLsam4",
  authDomain: "sunitas-s-khana.firebaseapp.com",
  projectId: "sunitas-s-khana",
  storageBucket: "sunitas-s-khana.firebasestorage.app",
  messagingSenderId: "523375484943",
  appId: "1:523375484943:web:2f7d4b3a54156de4e8837a",
  measurementId: "G-8ZYBJ9WRKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleProvider, analytics };
export default app;
