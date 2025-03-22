document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.querySelector('.navbar');
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCountElement = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutPage = document.getElementById('checkoutPage');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Fix product card heights and button alignment
    function fixProductCardAlignment() {
        const productCards = document.querySelectorAll('.product-card');
        let maxInfoHeight = 0;
        let maxTitleHeight = 0;
        let maxDescHeight = 0;
        
        // First pass: find maximum heights
        productCards.forEach(card => {
            const productInfo = card.querySelector('.product-info');
            const productTitle = card.querySelector('.product-title');
            const productDesc = productTitle.nextElementSibling;
            
            maxInfoHeight = Math.max(maxInfoHeight, productInfo.offsetHeight);
            maxTitleHeight = Math.max(maxTitleHeight, productTitle.offsetHeight);
            maxDescHeight = Math.max(maxDescHeight, productDesc.offsetHeight);
        });
        
        // Second pass: apply consistent heights
        productCards.forEach(card => {
            const productInfo = card.querySelector('.product-info');
            const productTitle = card.querySelector('.product-title');
            const productDesc = productTitle.nextElementSibling;
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            
            productTitle.style.height = `${maxTitleHeight}px`;
            productDesc.style.height = `${maxDescHeight}px`;
            
            // Ensure consistent button positioning
            addToCartBtn.style.marginTop = '15px';
            addToCartBtn.style.position = 'relative';
            addToCartBtn.style.bottom = '0';
        });
    }
    
    // Call the function after a slight delay to ensure all elements are rendered
    setTimeout(fixProductCardAlignment, 100);
    
    // Also call it on window resize
    window.addEventListener('resize', fixProductCardAlignment);
    
    // State
    let cart = [];
    
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
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // Animate image to cart
            animateToCart(this, image);
            
            // Check if product is already in cart
            const existingItemIndex = cart.findIndex(item => item.product === product);
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({ product, price, image, quantity: 1 });
            }
            
            updateCartCount();
            updateCartDisplay();
            
            // Button animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            this.style.backgroundColor = 'var(--primary-dark)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Animate product to cart
    function animateToCart(button, imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.position = 'absolute';
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.borderRadius = '50%';
        img.style.zIndex = '1000';
        img.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s';
        
        const rect = button.getBoundingClientRect();
        img.style.left = `${rect.left + window.scrollX}px`;
        img.style.top = `${rect.top + window.scrollY}px`;
        document.body.appendChild(img);
        
        const cartIconRect = cartIcon.getBoundingClientRect();
        
        setTimeout(() => {
            img.style.transform = `translate(${cartIconRect.left - rect.left}px, ${cartIconRect.top - rect.top}px) scale(0.5)`;
            img.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            document.body.removeChild(img);
        }, 800);
    }
    
    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Update cart display
    function updateCartDisplay() {
        if (!cartItems) return;
        
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
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCartCount();
                updateCartDisplay();
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                updateCartCount();
                updateCartDisplay();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartCount();
                updateCartDisplay();
            });
        });
    }
    
    // Update checkout summary
    function updateCheckoutSummary() {
        if (!checkoutItems || !checkoutTotal) return;
        
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
                window.location.reload();
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
            if (targetId === '#' || !document.querySelector(targetId)) return;
    
            // If we're in checkout page, return to main page
            if (checkoutPage && checkoutPage.style.display === 'block') {
                checkoutPage.style.display = 'none';
                document.querySelectorAll('section').forEach(section => {
                    if (section.id !== 'checkoutPage') {
                        section.style.display = 'block';
                    }
                });
            }
    
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    
                // Close mobile menu if open
                if (window.innerWidth < 992 && navLinks) {
                    navLinks.style.display = 'none';
                }
    
                // Close cart modal if open
                if (cartModal) {
                    cartModal.classList.remove('active');
                }
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", function (e) {
            if (this.getAttribute("href").startsWith("#")) {
                e.preventDefault();
                const targetId = this.getAttribute("href");
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Special handling for contact-us which is inside testimonials section
                    if (targetId === "#contact-us") {
                        // First scroll to testimonials section to ensure it's visible
                        document.getElementById("testimonials").scrollIntoView({ 
                            behavior: "smooth"
                        });
                        
                        // Then scroll to the contact-us div with a slight delay to ensure proper positioning
                        setTimeout(() => {
                            targetElement.scrollIntoView({ 
                                behavior: "smooth",
                                block: "center"
                            });
                        }, 100);
                    } else {
                        // Normal scrolling for other sections
                        targetElement.scrollIntoView({ 
                            behavior: "smooth",
                            block: "start" 
                        });
                    }
                }
            }
        });
    });

    // Remove login/register elements if they still exist
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.remove();
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.remove();
    
    // Fix cart buttons if they were disabled
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.classList.remove("disabled");
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    });

    // Fix scrolling issue when cart modal is opened
    const cartModal = document.getElementById("cartModal");
    const closeCartBtn = document.getElementById("closeCart");
    const checkoutBtn = document.getElementById("checkoutBtn");
    
    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal || e.target === closeCartBtn) {
                cartModal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            cartModal.style.display = "none";
            document.getElementById("checkoutPage").style.display = "block";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

const data = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("checkoutEmail").value,
    phone_num: document.getElementById("phone").value,
    street_address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip_code: document.getElementById("zip").value,
    country_reference: document.getElementById("US").value,
    name_on_card: document.getElementById("cardName").value,
    payment_token: document.getElementById("cardNumber").value,
    expiration_date: document.getElementById("expDate").value,
    cvv: document.getElementById("cvv").value
};


// Send data to Django
fetch('/checkout/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});

function getCSRFToken() {
    let token = null;
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        if (cookie.trim().startsWith('csrftoken=')) {
            token = cookie.split('=')[1];
        }
    });
    return token;
}

// CSRF helper function
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

