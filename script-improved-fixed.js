import { auth, signOut, onAuthStateChange } from './firebaseauth.js';

// Global variables
let currentUser = null;



// Firebase auth state change handler
function handleAuthStateChange(user) {
    if (user) {
        // User is signed in
        const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
        currentUser = {
            firstName: firstName,
            email: user.email,
            uid: user.uid
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        // User is signed out
        currentUser = null;
        localStorage.removeItem('currentUser');
    }
    // Update UI immediately
    updateUserInterface();
}

// Update user interface based on authentication state
function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutLink = document.querySelector('.logout');

    if (!loginBtn) return;

    if (currentUser) {
        // User is logged in - show "Hi, firstname"
        loginBtn.textContent = `Hi, ${currentUser.firstName}`;
        loginBtn.style.color = '#28a745'; // Green color for logged in state

        // Show logout link in hamburger menu
        if (logoutLink) {
            logoutLink.style.display = 'flex';
        }
    } else {
        // User is not logged in - show "Login"
        loginBtn.textContent = 'Login';
        loginBtn.style.color = ''; // Reset color

        // Hide logout link in hamburger menu
        if (logoutLink) {
            logoutLink.style.display = 'none';
        }
    }
}

// Handle login button click
function handleLoginClick(event) {
    event.preventDefault();
    const loginBtn = document.getElementById('loginBtn');

    if (!loginBtn) return;

    const buttonText = loginBtn.textContent.trim().toLowerCase();

    if (buttonText === 'login') {
        // User is not logged in - redirect to login page
        window.location.href = 'offical login page.html';
    } else if (buttonText.startsWith('hi,')) {
        // User is logged in - could show user menu or do nothing
        console.log('User is already logged in');
    }
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    console.log('Logout button clicked');

    // Close the dropdown menu
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.classList.remove('show');
    }

    // Sign out from Firebase using modular auth instance
    signOut(auth).then(() => {
        console.log('User signed out successfully');
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserInterface();
        alert('You have been successfully logged out!');
    }).catch((error) => {
        console.error('Error signing out:', error);
        alert('Error logging out. Please try again.');
    });
}



// Function to open the subscription modal
function handleSubscription(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const selectedPlan = button.closest('.pricing-card').querySelector('.plan-name').textContent.trim();

    // Show modal
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'flex';
    }

    // Update selected plan display in modal
    const selectedPlanDiv = document.getElementById('selectedPlan');
    if (selectedPlanDiv) {
        selectedPlanDiv.textContent = `Selected Plan: ${selectedPlan}`;
    }
}

// Function to close the subscription modal
function closeModal() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load user from localStorage on page load
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('currentUser');
        }
    }

    // Set up login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLoginClick);
    }

    // Set up logout link
    const logoutLink = document.querySelector('.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
        console.log('Logout event listener attached');
    }

    // Update UI initially
    updateUserInterface();

    // Set up hamburger menu functionality
    const menuBtn = document.querySelector('.menu-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (menuBtn && dropdownContent) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.hamburger-menu')) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // Check for URL parameters (e.g., after redirect from login)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('Login successful - UI should update automatically');
    }

    // Set up Firebase auth state listener
    onAuthStateChange(handleAuthStateChange);
});

// FAQ toggle functionality
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');

    if (isActive) {
        // Close the FAQ
        faqItem.classList.remove('active');
        faqAnswer.style.maxHeight = '0';
    } else {
        // Open the FAQ
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
    }
}

// Handle contact form submission
function handleContact(event) {
    event.preventDefault();
    alert('Thank you for your message. We will get back to you soon!');
    event.target.reset();
}

// Select style functionality
function selectStyle(style) {
    alert(`Selected style: ${style}`);
}

// Make functions globally available for Firebase auth state changes, FAQ, and other UI interactions
window.handleSubscription = handleSubscription;
window.closeModal = closeModal;
window.handleAuthStateChange = handleAuthStateChange;
window.updateUserInterface = updateUserInterface;
window.toggleFAQ = toggleFAQ;
window.handleContact = handleContact;
window.selectStyle = selectStyle;
