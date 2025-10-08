// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlIJCmbj-UDsso2ghAGog_MSX08Hw-2Ew",
  authDomain: "my-website-471517.firebaseapp.com",
  projectId: "my-website-471517",
  storageBucket: "my-website-471517.firebasestorage.app",
  messagingSenderId: "568236687889",
  appId: "1:568236687889:web:7ac9e77c8625873495e7b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export the app for use in other modules
export default app;
