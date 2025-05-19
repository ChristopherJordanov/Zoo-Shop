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
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const cartOverlay = document.querySelector(".cart-overlay")

    // Product detail modal elements
    const productDetailModal = document.getElementById("productDetailModal")
    const closeProductDetail = document.getElementById("closeProductDetail")
    const productDetailBody = document.getElementById("productDetailBody")

    // Debug logging to check if elements are found
    console.log("Cart icon found:", !!cartIcon)
    console.log("Cart modal found:", !!cartModal)
    console.log("Close cart button found:", !!closeCart)
    console.log("Cart count element found:", !!cartCount)
    console.log("Cart overlay found:", !!cartOverlay)

    // Initialize cart from localStorage - for visual display only
    let cart = JSON.parse(localStorage.getItem("cart")) || {}
    console.log("Initial cart state:", cart)
    updateCartCount() // Add this line to update cart count on page load

    // Add to cart functionality - now just updates UI and adds hidden input to Django form
    addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        // Stop event propagation to prevent opening the product detail modal
        e.stopPropagation()

        const productId = button.dataset.id
        const name = button.dataset.product
        const price = Number.parseFloat(button.dataset.price)
        const image = button.dataset.image

        // Visual update only
        addToCart(productId, name, price, image, 1)

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
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("Cart icon clicked")
        openCartModal()
    })
    }

    // Close cart modal
    if (closeCart) {
    closeCart.addEventListener("click", (e) => {
        e.preventDefault()
        closeCartModal()
    })
    }

    // Click outside to close cart modal
    if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
        closeCartModal()
    })
    }

    // Add event listener to handle ESC key to close cart
    document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartModal.classList.contains("open")) {
        closeCartModal()
    }
    if (e.key === "Escape" && productDetailModal && productDetailModal.classList.contains("open")) {
        closeProductDetailModal()
    }
    })

    // Close product detail modal
    if (closeProductDetail) {
    closeProductDetail.addEventListener("click", () => {
        closeProductDetailModal()
    })
    }

    // Click outside product detail modal to close
    if (productDetailModal) {
    productDetailModal.addEventListener("click", (e) => {
        if (e.target === productDetailModal) {
        closeProductDetailModal()
        }
    })
    }

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
    function addToCart(productId, name, price, image, quantity = 1) {
    if (cart[productId]) {
        cart[productId].quantity += quantity
    } else {
        cart[productId] = {
        name: name,
        price: price,
        image: image,
        quantity: quantity,
        }
    }

    saveCart()
    updateCartCount()
    renderCartItems()

    // Notify Django about cart changes via hidden form if it exists
    updateDjangoCartForm()

    // CHANGE: Don't open cart modal automatically when adding items
    // openCartModal() - REMOVED
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

    // Function to close cart modal
    function closeCartModal() {
    console.log("Closing cart modal")
    cartModal.classList.remove("open")
    cartOverlay.classList.remove("open")
    document.body.style.overflow = "" // Reset body overflow to allow scrolling
    }

    // Function to open cart modal
    function openCartModal() {
    console.log("Opening cart modal")
    renderCartItems()
    cartModal.classList.add("open")
    cartOverlay.classList.add("open")
    document.body.style.overflow = "hidden" // Prevent scrolling when cart is open
    }

    // NEW: Function to open product detail modal with enhanced details
    window.openProductDetail = (
    productId,
    productName,
    productPrice,
    productImage,
    title,
    category,
    description,
    currentPrice,
    oldPrice,
    ) => {
    if (!productDetailModal || !productDetailBody) return

    // Generate product specifications based on category
    let specifications = ""
    const tags = ""

    // Different specifications based on product category
    if (
        category.toLowerCase().includes("flakes") ||
        category.toLowerCase().includes("pellets") ||
        category.toLowerCase().includes("frozen")
    ) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Weight</span>
                <span class="product-specifications-value">250g</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Ingredients</span>
                <span class="product-specifications-value">Fish meal, wheat germ, shrimp meal, algae</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Protein Content</span>
                <span class="product-specifications-value">42%</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Shelf Life</span>
                <span class="product-specifications-value">24 months</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Feeding Frequency</span>
                <span class="product-specifications-value">2-3 times daily</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">High Protein</span>
            <span class="product-tag">Color Enhancing</span>
            <span class="product-tag">All Fish Types</span>
            </div>
        </div>
        `
    } else if (category.toLowerCase().includes("tank") || category.toLowerCase().includes("aquarium")) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dimensions</span>
                <span class="product-specifications-value">60cm × 30cm × 36cm</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Material</span>
                <span class="product-specifications-value">High-clarity glass</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Volume</span>
                <span class="product-specifications-value">54 liters</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Weight (Empty)</span>
                <span class="product-specifications-value">8.5 kg</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Includes</span>
                <span class="product-specifications-value">Filter, heater, LED lighting</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Beginner Friendly</span>
            <span class="product-tag">Complete Kit</span>
            <span class="product-tag">Energy Efficient</span>
            </div>
        </div>
        `
    } else if (
        category.toLowerCase().includes("filter") ||
        category.toLowerCase().includes("heater") ||
        category.toLowerCase().includes("light")
    ) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Power</span>
                <span class="product-specifications-value">15W</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Flow Rate</span>
                <span class="product-specifications-value">300 L/h</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">For Tank Size</span>
                <span class="product-specifications-value">Up to 100 liters</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dimensions</span>
                <span class="product-specifications-value">15cm × 8cm × 22cm</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Warranty</span>
                <span class="product-specifications-value">2 years</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Energy Efficient</span>
            <span class="product-tag">Quiet Operation</span>
            <span class="product-tag">Easy Maintenance</span>
            </div>
        </div>
        `
    } else if (
        category.toLowerCase().includes("treatment") ||
        category.toLowerCase().includes("testing") ||
        category.toLowerCase().includes("maintenance")
    ) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Volume</span>
                <span class="product-specifications-value">250ml</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Treats</span>
                <span class="product-specifications-value">Up to 1000 liters</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Active Ingredients</span>
                <span class="product-specifications-value">Sodium thiosulfate, aloe vera</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dosage</span>
                <span class="product-specifications-value">5ml per 10 liters</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Shelf Life</span>
                <span class="product-specifications-value">36 months</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Fast Acting</span>
            <span class="product-tag">Safe for All Fish</span>
            <span class="product-tag">Plant Safe</span>
            </div>
        </div>
        `
    } else {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Material</span>
                <span class="product-specifications-value">Non-toxic resin</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dimensions</span>
                <span class="product-specifications-value">25cm × 15cm × 12cm</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Weight</span>
                <span class="product-specifications-value">450g</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Suitable For</span>
                <span class="product-specifications-value">All aquarium types</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Care</span>
                <span class="product-specifications-value">Rinse before use</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Fish Safe</span>
            <span class="product-tag">Durable</span>
            <span class="product-tag">Natural Look</span>
            </div>
        </div>
        `
    }

    // Create the product detail content with quantity selector
    productDetailBody.innerHTML = `
            <div class="product-detail-image">
                <img src="${productImage}" alt="${title}">
            </div>
            <div class="product-detail-info">
                <div class="product-detail-category">${category}</div>
                <h2 class="product-detail-title">${title}</h2>
                <div class="product-detail-price">
                    <span class="product-detail-current-price">${currentPrice}</span>
                    ${oldPrice ? `<span class="product-detail-old-price">${oldPrice}</span>` : ""}
                </div>
                <div class="product-detail-description">${description}</div>
                
                ${specifications}
                
                <div class="product-detail-quantity">
                    <span class="product-detail-quantity-label">Quantity:</span>
                    <div class="product-detail-quantity-controls">
                        <button class="product-detail-quantity-btn minus">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="product-detail-quantity-input" value="1" min="1" max="99">
                        <button class="product-detail-quantity-btn plus">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-detail-actions">
                    <button class="product-detail-add-btn" data-id="${productId}" data-product="${productName}" data-price="${productPrice}" data-image="${productImage}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `

    // Add event listeners for quantity controls
    const quantityInput = productDetailBody.querySelector(".product-detail-quantity-input")
    const minusBtn = productDetailBody.querySelector(".product-detail-quantity-btn.minus")
    const plusBtn = productDetailBody.querySelector(".product-detail-quantity-btn.plus")

    if (minusBtn) {
        minusBtn.addEventListener("click", () => {
        const currentValue = Number.parseInt(quantityInput.value)
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1
        }
        })
    }

    if (plusBtn) {
        plusBtn.addEventListener("click", () => {
        const currentValue = Number.parseInt(quantityInput.value)
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1
        }
        })
    }

    if (quantityInput) {
        quantityInput.addEventListener("change", () => {
        const value = Number.parseInt(quantityInput.value)
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1
        } else if (value > 99) {
            quantityInput.value = 99
        }
        })
    }

    // Add event listener to the Add to Cart button in the modal
    const addToCartBtn = productDetailBody.querySelector(".product-detail-add-btn")
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
        const id = addToCartBtn.dataset.id
        const name = addToCartBtn.dataset.product
        const price = Number.parseFloat(addToCartBtn.dataset.price)
        const image = addToCartBtn.dataset.image
        const quantity = Number.parseInt(quantityInput.value) || 1

        addToCart(id, name, price, image, quantity)

        // Button animation
        addToCartBtn.innerHTML = `<i class="fas fa-check"></i> Added ${quantity} to Cart`
        addToCartBtn.style.backgroundColor = "var(--secondary-color)"

        setTimeout(() => {
            addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
            addToCartBtn.style.backgroundColor = ""
        }, 1500)
        })
    }

    // Open the modal
    productDetailModal.classList.add("open")
    document.body.style.overflow = "hidden" // Prevent scrolling
    }

    // NEW: Function to close product detail modal
    function closeProductDetailModal() {
    if (!productDetailModal) return

    productDetailModal.classList.remove("open")
    document.body.style.overflow = "" // Allow scrolling again
    }

    // Initialize cart display
    renderCartItems()
})
