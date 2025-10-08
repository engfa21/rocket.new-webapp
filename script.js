if (typeof currentUser === 'undefined') {
    var currentUser = null; // Declare currentUser variable if not already declared
}

document.addEventListener('DOMContentLoaded', function() {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }

    // Set up login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const buttonText = loginBtn.textContent.trim().toLowerCase();
            if (buttonText === 'login') {
                // User is not logged in, redirect to login page
                window.location.href = 'offical login page.html';
            } else if (buttonText.startsWith('hi,')) {
                // User is logged in, could show user menu or do nothing
                // For now, do nothing - could expand to show user dropdown
                console.log('User is logged in:', currentUser);
            }
        });
    }

    // Set up subscription buttons
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    subscribeButtons.forEach(btn => {
        btn.addEventListener('click', handleSubscription);
    });

    // Set up subscription modal close button
    const subscriptionModalClose = document.querySelector('#subscriptionModal .close');
    if (subscriptionModalClose) {
        subscriptionModalClose.addEventListener('click', () => {
            const subscriptionModal = document.getElementById('subscriptionModal');
            if (subscriptionModal) {
                subscriptionModal.style.display = 'none';
            }
        });
    }

    // Hamburger menu functionality
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

        // Handle menu item clicks
        const menuItems = document.querySelectorAll('.dropdown-content a');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();

                if (this.classList.contains('logout')) {
                    // Logout action
                    logout();
                    // Close dropdown after logout
                    dropdownContent.classList.remove('show');
                    return;
                } else if (this.textContent.includes('Manage Subscriptions')) {
                    // Manage subscriptions action
                    manageSubscription();
                } else if (this.textContent.includes('Profile')) {
                    // Profile action
                    showProfile();
                } else if (this.textContent.includes('Settings')) {
                    // Settings action
                    showSettings();
                } else if (this.textContent.includes('Billing')) {
                    // Billing action
                    showBilling();
                } else if (this.textContent.includes('Usage')) {
                    // Usage action
                    showUsage();
                }

                // Close dropdown after selection
                dropdownContent.classList.remove('show');
            });
        });
    }
});

// Show login modal - redirect to login page since modal was removed
function showLoginModal() {
    window.location.href = 'offical login page.html';
}

// Close modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Update user interface based on login status
function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    if (currentUser) {
        // User is logged in
        loginBtn.textContent = `Hi, ${currentUser.firstName}`;
    } else {
        // User is not logged in
        loginBtn.textContent = 'Login';
    }

    // Always show the hamburger menu
    if (hamburgerMenu) {
        hamburgerMenu.style.display = 'inline-block';
    }
}

// Handle subscription
function handleSubscription(event) {
    if (!currentUser) {
        alert('Please login first to subscribe to a plan.');
        showLoginModal();
        return;
    }

    // Extract plan from button text
    const buttonText = event.target.textContent.toLowerCase();
    let plan = 'starter'; // default

    if (buttonText.includes('professional')) {
        plan = 'professional';
    } else if (buttonText.includes('enterprise')) {
        plan = 'enterprise';
    }

    subscribe(plan);
}

// Subscribe to a plan
function subscribe(plan) {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    // Update user plan
    currentUser.plan = plan;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Show subscription modal
    const modal = document.getElementById('subscriptionModal');
    if (modal) {
        modal.style.display = 'flex';
        updateSelectedPlan(plan);
    }
}

// Update selected plan display
function updateSelectedPlan(plan) {
    const selectedPlanDiv = document.getElementById('selectedPlan');
    if (selectedPlanDiv) {
        selectedPlanDiv.innerHTML = `
            <h3>KG9 Video ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</h3>
            <p>Monthly subscription</p>
        `;
    }
}

// Manage subscription
function manageSubscription() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    updateUserInterface();
    alert('You have been logged out.');
    // Close dropdown menu only, do not show login modal
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.classList.remove('show');
    }
    // Optionally, redirect to homepage or refresh page to reflect logged out state
    // window.location.href = '/'; // Uncomment if redirect is desired
}

// Handle contact form
function handleContact(event) {
    event.preventDefault();
    alert('Thank you for your message. We will get back to you soon!');
    event.target.reset();
}

// Toggle FAQ
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');

    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        toggle.style.transform = 'rotate(0deg)';
        element.parentElement.classList.remove('active');
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        toggle.style.transform = 'rotate(45deg)';
        element.parentElement.classList.add('active');
    }
}

// Select style (placeholder)
function selectStyle(style) {
    alert(`Selected style: ${style}`);
}

// Update dashboard
function updateUserDashboard() {
    if (!currentUser) return;

    const userName = document.getElementById('userName');
    const currentPlan = document.getElementById('currentPlan');
    const statusBadge = document.getElementById('statusBadge');

    if (userName) userName.textContent = `Welcome back, ${currentUser.firstName}!`;
    if (currentPlan) currentPlan.textContent = currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1);
    if (statusBadge) statusBadge.textContent = 'Active';
}

// Show dashboard
function showDashboard() {
    const dashboard = document.getElementById('dashboard');
    const hero = document.getElementById('home');

    if (dashboard && hero) {
        dashboard.style.display = 'block';
        hero.style.display = 'none';
    }
}

// Show home
function showHome() {
    const dashboard = document.getElementById('dashboard');
    const hero = document.getElementById('home');

    if (dashboard && hero) {
        dashboard.style.display = 'none';
        hero.style.display = 'block';
    }
}

// Show profile
function showProfile() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    alert(`Profile: ${currentUser.firstName} - Email: ${currentUser.email}`);
}

// Show settings
function showSettings() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    alert('Settings page coming soon!');
}

// Show billing
function showBilling() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    alert('Billing information coming soon!');
}

// Show usage
function showUsage() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    alert('Usage statistics coming soon!');
}
