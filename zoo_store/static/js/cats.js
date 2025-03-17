document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const authBtn = document.getElementById('authBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authModal = document.getElementById('authModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const cartCount = document.querySelector('.cart-count');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    
    // State
    let cart = [];
    let isLoggedIn = false;
    let currentUser = null;
    
    // Check if user is logged in from localStorage
    function checkLoginStatus() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            isLoggedIn = true;
            updateUIForLoggedInUser();
        }
    }
    
    // Update UI for logged in user
    function updateUIForLoggedInUser() {
        if (isLoggedIn && currentUser) {
            authBtn.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
            
            // Enable add to cart buttons
            addToCartButtons.forEach(button => {
                button.classList.remove('disabled');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            });
        } else {
            authBtn.textContent = 'Sign In / Register';
            
            // Disable add to cart buttons
            addToCartButtons.forEach(button => {
                button.classList.add('disabled');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Sign in to Add to Cart';
            });
        }
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Auth modal
    if (authBtn && authModal && closeAuthModal) {
        authBtn.addEventListener('click', () => {
            if (isLoggedIn) {
                // Show user menu or logout option
                logout();
            } else {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Auth tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabId}Form`).classList.add('active');
        });
    });
    
    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const passwordInput = btn.parentElement.querySelector('input');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            btn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
    });
    
    // Login functionality
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showToast('Please fill in all fields');
                return;
            }
            
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login successful
                currentUser = user;
                isLoggedIn = true;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                authModal.classList.remove('active');
                document.body.style.overflow = '';
                showToast('Login successful! Welcome back.');
                
                updateUIForLoggedInUser();
            } else {
                showToast('Invalid email or password');
            }
        });
    }
    
    // Register functionality
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsChecked = document.getElementById('terms').checked;
            
            if (!name || !email || !password || !confirmPassword) {
                showToast('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match');
                return;
            }
            
            if (!termsChecked) {
                showToast('Please agree to the Terms of Service');
                return;
            }
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(u => u.email === email)) {
                showToast('Email already registered');
                return;
            }
            
            // Register new user
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login after registration
            currentUser = newUser;
            isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            authModal.classList.remove('active');
            document.body.style.overflow = '';
            showToast('Registration successful! Welcome to PurrfectPets.');
            
            updateUIForLoggedInUser();
        });
    }
    
    // Logout functionality
    function logout() {
        localStorage.removeItem('currentUser');
        isLoggedIn = false;
        currentUser = null;
        updateUIForLoggedInUser();
        showToast('You have been logged out');
    }
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!isLoggedIn) {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                return;
            }
            
            const product = button.getAttribute('data-product');
            const price = parseFloat(button.getAttribute('data-price'));
            
            cart.push({ product, price });
            updateCartCount();
            
            // Button animation
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            button.style.backgroundColor = 'var(--secondary-color)';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
            
            showToast(`${product} added to your cart!`);
        });
    });
    
    function updateCartCount() {
        cartCount.textContent = cart.length;
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            
            if (emailInput.value.trim()) {
                showToast('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add random paw prints
    function addRandomPawPrints() {
        const container = document.body;
        const pawCount = 15;
        
        for (let i = 0; i < pawCount; i++) {
            const paw = document.createElement('div');
            paw.classList.add('paw-print');
            
            // Random position
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            
            paw.style.top = `${top}%`;
            paw.style.left = `${left}%`;
            paw.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            container.appendChild(paw);
        }
    }
    
    // Initialize
    checkLoginStatus();
    addRandomPawPrints();
});