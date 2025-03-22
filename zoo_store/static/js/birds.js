// Add this JavaScript to your birds.js file or include it in a <script> tag at the end of the page

document.addEventListener('DOMContentLoaded', () => {
    // Cart elements
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    // Initialize cart from localStorage if available
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count on load
    function initializeCart() {
        updateCartCount();
        updateCartDisplay();
    }
    
    // Toggle cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.classList.toggle('active');
        document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
        updateCartDisplay();
    });
    
    // Close cart when clicking the X
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close cart when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Add to cart functionality for bird products
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('disabled')) {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                return;
            }
            
            const product = button.getAttribute('data-product');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            addToCart(product, price, image);
            
            // Button animation
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            button.style.backgroundColor = 'var(--secondary-color)';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Add item to cart
    function addToCart(product, price, image) {
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.product === product);
        
        if (existingItemIndex > -1) {
            // Increment quantity if product already in cart
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                product: product,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartDisplay();
        showToast(`${product} added to your cart!`);
    }
    
    // Update cart count in the navbar
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
        
        // Animation effect
        const cartCount = document.querySelector('.cart-count');
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Update cart display in modal
    function updateCartDisplay() {
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Clear current items
        while (cartItems.firstChild) {
            cartItems.removeChild(cartItems.firstChild);
        }
        
        // Show empty cart message if needed
        if (cart.length === 0) {
            cartItems.appendChild(emptyCartMessage);
            return;
        }
        
        // Add each item to cart display
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.product}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.product}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                decreaseQuantity(index);
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                increaseQuantity(index);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    // Increase item quantity
    function increaseQuantity(index) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
    
    // Decrease item quantity
    function decreaseQuantity(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            removeFromCart(index);
            return;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
    
    // Remove item from cart
    function removeFromCart(index) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showToast(`${removedItem.product} removed from cart`);
    }
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        
        // Redirect to checkout page or show checkout section
        // You can customize this based on your checkout flow
        window.location.href = 'checkout.html';
    });
    
    // Initialize cart on page load
    initializeCart();
});