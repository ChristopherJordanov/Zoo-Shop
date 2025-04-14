document.addEventListener("DOMContentLoaded", () => {
    // Cart functionality
    const cartIcon = document.getElementById("cartIcon")
    const cartModal = document.getElementById("cartModal")
    const closeCart = document.getElementById("closeCart")
    const cartItems = document.getElementById("cartItems")
    const cartTotal = document.getElementById("cartTotal")
    const cartCount = document.getElementById("cartCount")
    const clearCartBtn = document.getElementById("clearCart")
    const checkoutBtn = document.getElementById("checkoutBtn")
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")

    // Create cart overlay
    const cartOverlay = document.createElement("div")
    cartOverlay.className = "cart-overlay"
    document.body.appendChild(cartOverlay)

    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || {}

    // Update cart count on page load
    updateCartCount()

    // Add to cart functionality
    addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productId = button.dataset.id
        const name = button.dataset.product
        const price = Number.parseFloat(button.dataset.price)
        const image = button.dataset.image

        addToCart(productId, name, price, image)

        // Button animation
        button.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
        button.style.backgroundColor = "var(--secondary-color)"

        setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
        button.style.backgroundColor = ""
        }, 1500)
    })
    })

    // Cart icon click - open cart modal
    if (cartIcon) {
    cartIcon.addEventListener("click", () => {
        openCartModal()
    })
    }

    // Close cart modal
    if (closeCart) {
    closeCart.addEventListener("click", () => {
        cartModal.classList.remove("open")
        cartOverlay.classList.remove("open")
        document.body.style.overflow = ""
    })
    }

    // Click outside to close cart modal
    cartOverlay.addEventListener("click", () => {
    cartModal.classList.remove("open")
    cartOverlay.classList.remove("open")
    document.body.style.overflow = ""
    })

    // Clear cart button
    if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        clearCart()
    })
    }

    // Checkout button
    if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
        return
        }

        // Simulate a redirect after a short delay
        setTimeout(() => {
        alert("This would redirect to a checkout page in a real implementation.")
        }, 1500)
    })
    }

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
    } else {
        navbar.classList.remove("scrolled")
    }
    })

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("href").substring(1)
        const target = document.getElementById(targetId)

        if (target) {
        window.scrollTo({
            top: target.offsetTop - 80, // Adjust for navbar height
            behavior: "smooth",
        })
        }
    })
    })

    // Helper Functions
    function addToCart(productId, name, price, image) {
    if (cart[productId]) {
        cart[productId].quantity += 1
    } else {
        cart[productId] = {
        name: name,
        price: price,
        image: image,
        quantity: 1,
        }
    }

    saveCart()
    updateCartCount()
    renderCartItems()
    }

    function removeFromCart(productId) {
    if (cart[productId]) {
        delete cart[productId]
        saveCart()
        updateCartCount()
        renderCartItems()
    }
    }

    function updateQuantity(productId, quantity) {
    if (cart[productId]) {
        if (quantity <= 0) {
        removeFromCart(productId)
        return
        }

        cart[productId].quantity = quantity
        saveCart()
        updateCartCount()
        renderCartItems()
    }
    }

    function clearCart() {
    cart = {}
    saveCart()
    updateCartCount()
    renderCartItems()
    }

    function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
    }

    function updateCartCount() {
    const count = Object.values(cart).reduce((total, item) => total + item.quantity, 0)
    if (cartCount) {
        cartCount.textContent = count
        cartCount.style.transform = "scale(1.5)"
        setTimeout(() => {
        cartCount.style.transform = "scale(1)"
        }, 300)
    }
    }

    function calculateTotal() {
    return Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0)
    }

    function renderCartItems() {
    if (!cartItems || !cartTotal) return

    cartItems.innerHTML = ""

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>'
        cartTotal.textContent = "$0.00"
        return
    }

    for (const [productId, item] of Object.entries(cart)) {
        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"

        cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${productId}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" data-id="${productId}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${productId}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `

        cartItems.appendChild(cartItem)
    }

    // Update total
    cartTotal.textContent = `$${calculateTotal().toFixed(2)}`

    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
        btn.addEventListener("click", () => {
        const productId = btn.dataset.id
        if (cart[productId]) {
            updateQuantity(productId, cart[productId].quantity - 1)
        }
        })
    })

    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
        btn.addEventListener("click", () => {
        const productId = btn.dataset.id
        if (cart[productId]) {
            updateQuantity(productId, cart[productId].quantity + 1)
        }
        })
    })

    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
        const productId = btn.dataset.id
        removeFromCart(productId)
        })
    })
    }

    function openCartModal() {
    renderCartItems()
    cartModal.classList.add("open")
    cartOverlay.classList.add("open")
    document.body.style.overflow = "hidden"
    }
})
