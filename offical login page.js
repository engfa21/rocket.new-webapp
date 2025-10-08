import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Firebase configuration (same as in firebaseauth.js)
const firebaseConfig = {
    apiKey: "AIzaSyDo5lD0xAmuJLBig9V9DGc0CXxPBoL6ch8",
    authDomain: "login-form-143c1.firebaseapp.com",
    projectId: "login-form-143c1",
    storageBucket: "login-form-143c1.firebasestorage.app",
    messagingSenderId: "536491347816",
    appId: "1:536491347816:web:20d2f0878b51ea65f890dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
        console.log('User logged in:', firstName, user.email);

        // Store user data in localStorage
        const userData = {
            firstName: firstName,
            email: user.email,
            uid: user.uid
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Redirect to index.html after successful login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        currentUser = null;
        localStorage.removeItem('currentUser');
        console.log('User not logged in');
    }
});

// Make functions available globally for the existing script
window.testLogin = function() {
    // This is handled by the existing login buttons
};

window.testLogout = async function() {
    try {
        await signOut(auth);
        console.log('Logged out successfully');
        localStorage.removeItem('currentUser');
    } catch (error) {
        console.error('Logout failed:', error.message);
    }
};

window.checkAuthState = function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('LocalStorage user:', userData.firstName, userData.email);
    } else {
        console.log('No user data in localStorage');
    }
};
