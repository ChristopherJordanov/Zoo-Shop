document.addEventListener('DOMContentLoaded', () => {
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(74, 78, 105, 0.9)';
        } else {
            navbar.style.backgroundColor = 'rgba(74, 78, 105, 1)';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to elements on scroll
    function animateOnScroll(elements) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        });

        elements.forEach(el => {
            observer.observe(el);
        });
    }

    animateOnScroll(document.querySelectorAll('.hero-content, .about, .why-choose-us, .pets-section, .top-sellers, .food-section'));

    // Auth form functionality
    const authBtn = document.getElementById('loginBtn');
    const authOverlay = document.getElementById('authOverlay');
    const closeAuth = document.getElementById('closeAuth');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const forgotPassword = document.getElementById('forgotPassword');
    const backToLogin = document.getElementById('backToLogin');
    const authFormElement = document.querySelector('.auth-form');

    authBtn.addEventListener('click', () => {
        authOverlay.style.display = 'flex';
        setTimeout(() => {
            authFormElement.classList.add('active');
        }, 10);
    });

    closeAuth.addEventListener('click', () => {
        authFormElement.classList.remove('active');
        setTimeout(() => {
            authOverlay.style.display = 'none';
        }, 300);
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            document.querySelectorAll('.auth-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle login logic here
        alert('Login functionality would be implemented here.');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle registration logic here
        alert('Registration functionality would be implemented here.');
    });

    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle forgot password logic here
        alert('Password reset functionality would be implemented here.');
    });

    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.auth-content').forEach(content => {
            content.classList.remove('active');
        });
        forgotForm.classList.add('active');
    });

    backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.auth-content').forEach(content => {
            content.classList.remove('active');
        });
        loginForm.classList.add('active');
    });

    // Learn More button functionality
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    learnMoreBtn.addEventListener('click', () => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });

    // Add click event to pet cards
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('click', () => {
            const petType = card.getAttribute('data-pet');
            alert(`You selected a ${petType}! Here you would see more information about ${petType}s and available ${petType}s for adoption.`);
        });
    });

    // Shopping cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartPopup = document.querySelector('.cart-popup');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    let cart = [];

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <span class="cart-item-remove" data-product="${item.name}">&times;</span>
            `;
            cartItems.appendChild(cartItem);
            total += item.price;
        });
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                name: button.getAttribute('data-product'),
                price: parseFloat(button.getAttribute('data-price'))
            };
            cart.push(product);
            updateCart();
            cartPopup.classList.add('active');
        });
    });

    cartIcon.addEventListener('click', () => {
        cartPopup.classList.toggle('active');
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove')) {
            const productName = e.target.getAttribute('data-product');
            cart = cart.filter(item => item.name !== productName);
            updateCart();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality would be implemented here.');
        cart = [];
        updateCart();
        cartPopup.classList.remove('active');
    });

    // Close cart popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartIcon.contains(e.target) && !cartPopup.contains(e.target)) {
            cartPopup.classList.remove('active');
        }
    });

    // Add hover effect to product images
    const productImages = document.querySelectorAll('.product img');
    productImages.forEach(img => {
        img.addEventListener('mouseover', () => {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.3s ease';
        });
        img.addEventListener('mouseout', () => {
            img.style.transform = 'scale(1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        document.querySelector('.hero').style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // Add 3D tilt effect to product cards
    VanillaTilt.init(document.querySelectorAll(".product"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
    });
});