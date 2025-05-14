document.addEventListener("DOMContentLoaded", () => {
    console.log("Fish page script loaded")

    // Elements
    const cartIcon = document.getElementById("cartIcon")
    const cartModal = document.getElementById("cartModal")
    const closeCart = document.getElementById("closeCart")
    const cartItems = document.getElementById("cartItems")
    const cartTotal = document.getElementById("cartTotal")
    const cartCount = document.querySelector(".cart-count")
    const clearCartBtn = document.getElementById("clearCart")
    const checkoutBtn = document.getElementById("checkoutBtn")
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")

    // Debug logging to check if elements are found
    console.log("Cart icon found:", !!cartIcon)
    console.log("Cart modal found:", !!cartModal)
    console.log("Close cart button found:", !!closeCart)
    console.log("Cart count element found:", !!cartCount)

    // Create cart overlay if it doesn't exist
    let cartOverlay = document.querySelector(".cart-overlay")
    if (!cartOverlay) {
    console.log("Creating cart overlay")
    cartOverlay = document.createElement("div")
    cartOverlay.className = "cart-overlay"
    document.body.appendChild(cartOverlay)
    }

    // Initialize cart from localStorage - for visual display only
    let cart = JSON.parse(localStorage.getItem("cart")) || {}
    console.log("Initial cart state:", cart)
    updateCartCount() // Add this line to update cart count on page load

    // Add to cart functionality - now just updates UI and adds hidden input to Django form
    addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productId = button.dataset.id
        const name = button.dataset.product
        const price = Number.parseFloat(button.dataset.price)
        const image = button.dataset.image

        // Visual update only
        addToCart(productId, name, price, image)

        // Button animation
        button.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
        button.style.backgroundColor = "var(--secondary-color)"

        setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
        button.style.backgroundColor = ""
        }, 1500)

        // If this button is inside a form, don't prevent the default Django form submission
        const form = button.closest("form")
        if (form && !button.dataset.preventSubmit) {
        // Let Django handle the form submission
        }
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

    // Clear cart button - now just clears visual display
    if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        clearCart()

        // If there's a Django form for clearing cart, submit it
        const djangoClearForm = document.getElementById("django-clear-cart-form")
        if (djangoClearForm) {
        djangoClearForm.submit()
        }
    })
    }

    // Checkout button - MODIFIED to let Django handle checkout
    if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
        // Don't prevent default - let Django handle the checkout
        // e.preventDefault() - REMOVED
        console.log("Checkout button clicked")

        if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!")
        e.preventDefault() // Only prevent if cart is empty
        return
        }

        // Instead of creating a custom form, we'll update hidden inputs in the existing Django form
        const checkoutForm = checkoutBtn.closest("form")
        if (checkoutForm) {
        // Find or create a hidden input for cart data
        let cartDataInput = checkoutForm.querySelector('input[name="cartData"]')
        if (!cartDataInput) {
            cartDataInput = document.createElement("input")
            cartDataInput.type = "hidden"
            cartDataInput.name = "cartData"
            checkoutForm.appendChild(cartDataInput)
        }

        // Update the cart data input
        cartDataInput.value = JSON.stringify(cart)

        // Let Django handle the form submission
        // form.submit() - REMOVED, let the natural click event handle it
        }
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

    // Helper Functions - now just for visual display
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

    // Notify Django about cart changes via hidden form if it exists
    updateDjangoCartForm()
    }

    function removeFromCart(productId) {
    if (cart[productId]) {
        delete cart[productId]
        saveCart()
        updateCartCount()
        renderCartItems()

        // Notify Django about cart changes via hidden form if it exists
        updateDjangoCartForm()
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

        // Notify Django about cart changes via hidden form if it exists
        updateDjangoCartForm()
    }
    }

    function clearCart() {
    cart = {}
    saveCart()
    updateCartCount()
    renderCartItems()

    // Notify Django about cart changes via hidden form if it exists
    updateDjangoCartForm()
    }

    // Update any Django cart forms with current cart data
    function updateDjangoCartForm() {
    const djangoCartForms = document.querySelectorAll(".django-cart-form")
    djangoCartForms.forEach((form) => {
        let cartDataInput = form.querySelector('input[name="cartData"]')
        if (!cartDataInput) {
        cartDataInput = document.createElement("input")
        cartDataInput.type = "hidden"
        cartDataInput.name = "cartData"
        form.appendChild(cartDataInput)
        }
        cartDataInput.value = JSON.stringify(cart)
    })
    }

    function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
    }

    function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count")
    if (!cartCountElement) {
        console.error("Cart count element not found")
        return
    }

    const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0)
    console.log("Updating cart count to:", totalItems)

    cartCountElement.textContent = totalItems
    cartCountElement.style.transform = "scale(1.5)"
    setTimeout(() => {
        cartCountElement.style.transform = "scale(1)"
    }, 300)
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
