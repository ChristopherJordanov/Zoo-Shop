document.addEventListener("DOMContentLoaded", () => {
    console.log("Bird page script loaded")

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

    // Function to open product detail modal with enhanced details
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

    // Different specifications based on product category
    if (
        category.toLowerCase().includes("seeds") ||
        category.toLowerCase().includes("pellets") ||
        category.toLowerCase().includes("treats")
    ) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Weight</span>
                <span class="product-specifications-value">500g</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Ingredients</span>
                <span class="product-specifications-value">Mixed seeds, grains, dried fruits, nuts</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Protein Content</span>
                <span class="product-specifications-value">15%</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Shelf Life</span>
                <span class="product-specifications-value">18 months</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Feeding Instructions</span>
                <span class="product-specifications-value">Feed 1-2 tablespoons daily</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">All Natural</span>
            <span class="product-tag">No Preservatives</span>
            <span class="product-tag">All Bird Types</span>
            </div>
        </div>
        `
    } else if (category.toLowerCase().includes("cage") || category.toLowerCase().includes("aviar")) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dimensions</span>
                <span class="product-specifications-value">60cm × 40cm × 80cm</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Material</span>
                <span class="product-specifications-value">Powder-coated steel</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Bar Spacing</span>
                <span class="product-specifications-value">1.2 cm</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Weight</span>
                <span class="product-specifications-value">5.5 kg</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Includes</span>
                <span class="product-specifications-value">Perches, food dishes, toy hook</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Easy Assembly</span>
            <span class="product-tag">Durable</span>
            <span class="product-tag">Easy to Clean</span>
            </div>
        </div>
        `
    } else if (
        category.toLowerCase().includes("toy") ||
        category.toLowerCase().includes("swing") ||
        category.toLowerCase().includes("chew")
    ) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Materials</span>
                <span class="product-specifications-value">Natural wood, cotton rope, non-toxic dyes</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dimensions</span>
                <span class="product-specifications-value">25cm × 15cm × 10cm</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Bird Size</span>
                <span class="product-specifications-value">Small to medium birds</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Features</span>
                <span class="product-specifications-value">Chewable parts, bells, moving components</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Care</span>
                <span class="product-specifications-value">Wipe clean, replace when worn</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Interactive</span>
            <span class="product-tag">Stimulating</span>
            <span class="product-tag">Bird Safe</span>
            </div>
        </div>
        `
    } else if (
        category.toLowerCase().includes("supplement") ||
        category.toLowerCase().includes("vitamin") ||
        category.toLowerCase().includes("health")
    ) {
        specifications = `
        <div class="product-specifications">
            <h4 class="product-specifications-title">Product Specifications</h4>
            <ul class="product-specifications-list">
            <li class="product-specifications-item">
                <span class="product-specifications-label">Volume</span>
                <span class="product-specifications-value">100ml</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dosage</span>
                <span class="product-specifications-value">2-3 drops per 100ml of water</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Active Ingredients</span>
                <span class="product-specifications-value">Vitamins A, D3, E, B complex</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Usage</span>
                <span class="product-specifications-value">Add to drinking water 2-3 times weekly</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Shelf Life</span>
                <span class="product-specifications-value">24 months unopened, 6 months after opening</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Complete Formula</span>
            <span class="product-tag">Immune Support</span>
            <span class="product-tag">Feather Health</span>
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
                <span class="product-specifications-value">High-quality, bird-safe materials</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Dimensions</span>
                <span class="product-specifications-value">Varies by product</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Weight</span>
                <span class="product-specifications-value">Varies by product</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Suitable For</span>
                <span class="product-specifications-value">All bird types</span>
            </li>
            <li class="product-specifications-item">
                <span class="product-specifications-label">Care</span>
                <span class="product-specifications-value">Easy to clean and maintain</span>
            </li>
            </ul>
            <div class="product-tags">
            <span class="product-tag">Premium Quality</span>
            <span class="product-tag">Durable</span>
            <span class="product-tag">Bird Safe</span>
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

    // Add event listeners for the quantity controls
    const quantityInput = productDetailBody.querySelector(".product-detail-quantity-input")
    const minusBtn = productDetailBody.querySelector(".product-detail-quantity-btn.minus")
    const plusBtn = productDetailBody.querySelector(".product-detail-quantity-btn.plus")
    const addToCartBtn = productDetailBody.querySelector(".product-detail-add-btn")

    minusBtn.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        if (quantity > 1) {
        quantityInput.value = quantity - 1
        }
    })

    plusBtn.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        quantityInput.value = quantity + 1
    })

    addToCartBtn.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value)
        addToCart(productId, productName, productPrice, productImage, quantity)

        // Button animation
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
        addToCartBtn.style.backgroundColor = "var(--secondary-color)"

        setTimeout(() => {
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
        addToCartBtn.style.backgroundColor = ""
        }, 1500)

        // Close the modal after adding to cart
        closeProductDetailModal()
    })

    // Open the modal
    productDetailModal.classList.add("open")
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }

    // Function to close product detail modal
    function closeProductDetailModal() {
    if (productDetailModal) {
        productDetailModal.classList.remove("open")
        document.body.style.overflow = "" // Reset body overflow to allow scrolling
    }
    }

    // Add quick view functionality to product images
    document.querySelectorAll(".product-image").forEach((productImage) => {
    productImage.addEventListener("click", (e) => {
        // Only open modal if click is not on the add to cart button
        if (!e.target.closest(".add-to-cart-btn")) {
        const productCard = productImage.closest(".product-card")
        const addToCartBtn = productCard.querySelector(".add-to-cart-btn")

        const productId = addToCartBtn.dataset.id
        const productName = addToCartBtn.dataset.product
        const productPrice = addToCartBtn.dataset.price
        const productImageSrc = addToCartBtn.dataset.image

        const productTitle = productCard.querySelector(".product-title").textContent
        const productCategory = productCard.querySelector(".product-category").textContent
        const productDescription = productCard.querySelector(".product-description").textContent

        const currentPriceEl = productCard.querySelector(".current-price")
        const oldPriceEl = productCard.querySelector(".old-price")

        const currentPrice = currentPriceEl ? currentPriceEl.textContent : `$${productPrice}`
        const oldPrice = oldPriceEl ? oldPriceEl.textContent : ""

        window.openProductDetail(
            productId,
            productName,
            productPrice,
            productImageSrc,
            productTitle,
            productCategory,
            productDescription,
            currentPrice,
            oldPrice,
        )
        }
    })
    })

    // Initialize the cart display
    renderCartItems()
})
