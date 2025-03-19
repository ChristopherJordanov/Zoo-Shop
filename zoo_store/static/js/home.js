document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.querySelector('.navbar');
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutPage = document.getElementById('checkoutPage');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
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
            loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}`;
            
            // Enable add to cart buttons
            addToCartButtons.forEach(button => {
                button.classList.remove('disabled');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            });
        } else {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Sign In / Register';
            
            // Disable add to cart buttons
            addToCartButtons.forEach(button => {
                button.classList.add('disabled');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Sign in to Add to Cart';
            });
        }
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Reveal elements on scroll
        revealElements();
    });
    
    // Reveal elements on scroll
    function revealElements() {
        const elements = document.querySelectorAll('.slide-up');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial reveal check
    revealElements();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Login Modal Functionality
    if (loginBtn && loginModal && closeLoginModal) {
        loginBtn.addEventListener('click', () => {
            if (isLoggedIn) {
                // If logged in, go to checkout page
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                document.querySelectorAll('section').forEach(section => {
                    section.style.display = 'none';
                });
                checkoutPage.style.display = 'block';
                updateCheckoutSummary();
            } else {
                // If not logged in, show login modal
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        closeLoginModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Login Tabs
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            loginTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            loginForms.forEach(form => form.classList.remove('active'));
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
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showToast('Please fill in all fields');
                return;
            }
            
            // For demo purposes, we'll just simulate a successful login
            currentUser = { name: 'Demo User', email: email };
            isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
            showToast('Login successful! Welcome back.');
            
            updateUIForLoggedInUser();
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
            
            // For demo purposes, we'll just simulate a successful registration
            currentUser = { name: name, email: email };
            isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
            showToast('Registration successful! Welcome to PurrfectPets.');
            
            updateUIForLoggedInUser();
        });
    }
    
    // Cart Modal Functionality
    if (cartIcon && cartModal && closeCart) {
        cartIcon.addEventListener('click', () => {
            updateCartDisplay();
            cartModal.classList.add('active');
        });
        
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!isLoggedIn) {
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                return;
            }
            
            const product = button.getAttribute('data-product');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.product === product);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ product, price, image, quantity: 1 });
            }
            
            updateCartCount();
            
            // Button animation
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            button.style.backgroundColor = 'var(--primary-dark)';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
            
            showToast(`${product} added to your cart!`);
        });
    });
    
    // Update cart count
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.product}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.product}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                cart[index].quantity += 1;
                updateCartDisplay();
                updateCartCount();
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCartDisplay();
                updateCartCount();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartDisplay();
                updateCartCount();
            });
        });
    }
    
    // Update checkout summary
    function updateCheckoutSummary() {
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p>Your cart is empty</p>';
            checkoutTotal.textContent = '$0.00';
            return;
        }
        
        let checkoutHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            checkoutHTML += `
                <div class="summary-item">
                    <span>${item.product} x ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
        
        checkoutItems.innerHTML = checkoutHTML;
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty');
                return;
            }
            
            cartModal.classList.remove('active');
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'none';
            });
            checkoutPage.style.display = 'block';
            updateCheckoutSummary();
        });
    }
    
    // Place order functionality
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            // Simulate order placement
            showToast('Order placed successfully! Thank you for shopping with us.');
            cart = [];
            updateCartCount();
            
            // Redirect back to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    // Show toast notification
    function showToast(message) {
        // Create toast if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = 'white';
            toast.style.color = 'var(--text-color)';
            toast.style.padding = '15px 25px';
            toast.style.borderRadius = 'var(--border-radius-sm)';
            toast.style.boxShadow = 'var(--shadow-md)';
            toast.style.zIndex = '1000';
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            toast.style.transition = 'all 0.3s ease';
            toast.style.borderLeft = '4px solid var(--primary-color)';
            document.body.appendChild(toast);
        }
        
        // Update toast content and show
        toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--primary-color); margin-right: 10px;"></i> ${message}`;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 3000);
    }
    
    // Button functionality
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            document.getElementById('products').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                showToast(`Thank you for subscribing with ${email}!`);
                emailInput.value = '';
            }
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // If we're in checkout page, go back to main page first
            if (checkoutPage.style.display === 'block') {
                checkoutPage.style.display = 'none';
                document.querySelectorAll('section').forEach(section => {
                    if (section.id !== 'checkoutPage') {
                        section.style.display = 'block';
                    }
                });
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth < 992) {
                    navLinks.style.display = 'none';
                }
                
                // Close cart modal if open
                cartModal.classList.remove('active');
            }
        });
    });
    
    // Initialize
    checkLoginStatus();
});

document.addEventListener("DOMContentLoaded", function () {
    let isAuthenticated = document.body.dataset.authenticated === "true";

    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        if (isAuthenticated) {
            button.classList.remove("disabled");
            button.textContent = "Add to Cart"; // Променя текста обратно
        }

        button.addEventListener("click", function () {
            if (!isAuthenticated) {
                showLoginModal();
                return;
            }

            let productId = this.dataset.productId;
            fetch("/add_to_cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: "product_id=" + productId
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showLoginModal();
                } else {
                    alert("Item added to cart!");
                }
            });
        });
    });

    function showLoginModal() {
        let loginModal = document.getElementById("loginModal");
        loginModal.style.display = "block";
    }

    document.getElementById("closeLoginModal").addEventListener("click", function () {
        document.getElementById("loginModal").style.display = "none";
    });
});

    // Close the modal when the close button is clicked
    const closeModalBtn = document.getElementById("closeLoginModal");
    closeModalBtn.addEventListener("click", function () {
        const loginModal = document.getElementById("loginModal");
        loginModal.style.display = "none";
    });

    // Function to get the CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


