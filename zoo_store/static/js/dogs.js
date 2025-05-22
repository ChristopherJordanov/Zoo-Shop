document.addEventListener("DOMContentLoaded", () => {
console.log("Dogs page script loaded")

// Elements
const navbar = document.querySelector(".navbar")
const cartIcon = document.getElementById("cartIcon")
const cartModal = document.getElementById("cartModal")
const closeCart = document.getElementById("closeCart")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const cartCount = document.querySelector(".cart-count")
const checkoutBtn = document.getElementById("checkoutBtn")
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navLinks = document.querySelector(".nav-links")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

// Product Detail Modal Elements
const productDetailModal = document.getElementById("productDetailModal")
const closeProductDetail = document.getElementById("closeProductDetail")
const productDetailBody = document.getElementById("productDetailBody")
const quickViewButtons = document.querySelectorAll(".quick-view-btn")

// Debug logging to check if elements are found
console.log("Cart icon found:", !!cartIcon)
console.log("Cart modal found:", !!cartModal)
console.log("Close cart button found:", !!closeCart)
console.log("Cart count element found:", !!cartCount)
console.log("Product detail modal found:", !!productDetailModal)
console.log("Quick view buttons found:", quickViewButtons.length)

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

    // Show toast notification
    showToast(`${name} added to cart!`)

    // Button animation
    const originalText = button.innerHTML
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

// Quick view functionality
quickViewButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
    e.preventDefault()
    e.stopPropagation()

    const productId = this.dataset.id
    const productName = this.dataset.product
    const productPrice = this.dataset.price
    const productImage = this.dataset.image
    const productCategory = this.dataset.category
    const productTitle = this.dataset.title
    const productDescription = this.dataset.description

    openProductDetail(
        productId,
        productName,
        productPrice,
        productImage,
        productCategory,
        productTitle,
        productDescription,
    )
    })
})

// Open product detail modal
function openProductDetail(productId, productName, productPrice, productImage, category, title, description) {
    if (!productDetailModal || !productDetailBody) return

    // Generate product specifications based on category
    let specifications = ""
    const tags = ""

    // Different specifications based on product category
    if (category.toLowerCase().includes("food") || category.toLowerCase().includes("treats")) {
    specifications = `
            <div class="product-detail-specs">
                <h4>Product Specifications</h4>
                <table class="specs-table">
                <tr>
                    <td>Weight</td>
                    <td>500g</td>
                </tr>
                <tr>
                    <td>Ingredients</td>
                    <td>Premium meat, vegetables, essential nutrients</td>
                </tr>
                <tr>
                    <td>Protein Content</td>
                    <td>15%</td>
                </tr>
                <tr>
                    <td>Shelf Life</td>
                    <td>18 months</td>
                </tr>
                <tr>
                    <td>Feeding Instructions</td>
                    <td>Feed 1-2 tablespoons daily</td>
                </tr>
                </table>
            </div>
            <div class="product-tags">
                <span class="product-tag">All Natural</span>
                <span class="product-tag">No Preservatives</span>
                <span class="product-tag">All Dog Ages</span>
            </div>
            `
    } else if (category.toLowerCase().includes("toy")) {
    specifications = `
            <div class="product-detail-specs">
                <h4>Product Specifications</h4>
                <table class="specs-table">
                <tr>
                    <td>Materials</td>
                    <td>Non-toxic, pet-safe materials</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>15cm x 10cm x 5cm</td>
                </tr>
                <tr>
                    <td>Features</td>
                    <td>Interactive, durable, easy to clean</td>
                </tr>
                <tr>
                    <td>Recommended For</td>
                    <td>All dog sizes and ages</td>
                </tr>
                <tr>
                    <td>Care</td>
                    <td>Wipe clean with damp cloth</td>
                </tr>
                </table>
            </div>
            <div class="product-tags">
                <span class="product-tag">Interactive</span>
                <span class="product-tag">Durable</span>
                <span class="product-tag">Non-Toxic</span>
            </div>
            `
    } else if (category.toLowerCase().includes("bed")) {
    specifications = `
            <div class="product-detail-specs">
                <h4>Product Specifications</h4>
                <table class="specs-table">
                <tr>
                    <td>Materials</td>
                    <td>Premium plush fabric, memory foam</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>50cm x 40cm x 15cm</td>
                </tr>
                <tr>
                    <td>Features</td>
                    <td>Machine washable cover, non-slip bottom</td>
                </tr>
                <tr>
                    <td>Weight Capacity</td>
                    <td>Up to 15kg</td>
                </tr>
                <tr>
                    <td>Care</td>
                    <td>Remove cover and machine wash cold</td>
                </tr>
                </table>
            </div>
            <div class="product-tags">
                <span class="product-tag">Washable</span>
                <span class="product-tag">Memory Foam</span>
                <span class="product-tag">Cozy</span>
            </div>
            `
    } else if (category.toLowerCase().includes("groom")) {
    specifications = `
            <div class="product-detail-specs">
                <h4>Product Specifications</h4>
                <table class="specs-table">
                <tr>
                    <td>Materials</td>
                    <td>Stainless steel, ergonomic handle</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>18cm length</td>
                </tr>
                <tr>
                    <td>Features</td>
                    <td>Gentle on skin, removes loose fur</td>
                </tr>
                <tr>
                    <td>Suitable For</td>
                    <td>All coat types</td>
                </tr>
                <tr>
                    <td>Care</td>
                    <td>Rinse after use, dry thoroughly</td>
                </tr>
                </table>
            </div>
            <div class="product-tags">
                <span class="product-tag">Professional</span>
                <span class="product-tag">Ergonomic</span>
                <span class="product-tag">Gentle</span>
            </div>
            `
    } else if (
    category.toLowerCase().includes("leash") ||
    category.toLowerCase().includes("collar") ||
    category.toLowerCase().includes("harness")
    ) {
    specifications = `
            <div class="product-detail-specs">
                <h4>Product Specifications</h4>
                <table class="specs-table">
                <tr>
                    <td>Materials</td>
                    <td>High-quality nylon/leather, durable hardware</td>
                </tr>
                <tr>
                    <td>Size</td>
                    <td>Adjustable for small to large dogs</td>
                </tr>
                <tr>
                    <td>Features</td>
                    <td>Reflective stitching, padded handle, strong clasp</td>
                </tr>
                <tr>
                    <td>Weight Capacity</td>
                    <td>Up to 50kg</td>
                </tr>
                <tr>
                    <td>Care</td>
                    <td>Hand wash with mild soap, air dry</td>
                </tr>
                </table>
            </div>
            <div class="product-tags">
                <span class="product-tag">Durable</span>
                <span class="product-tag">Comfortable</span>
                <span class="product-tag">Adjustable</span>
            </div>
            `
    } else {
    specifications = `
            <div class="product-detail-specs">
                <h4>Product Specifications</h4>
                <table class="specs-table">
                <tr>
                    <td>Materials</td>
                    <td>Premium quality, dog-safe materials</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>Varies by product</td>
                </tr>
                <tr>
                    <td>Features</td>
                    <td>Durable, easy to clean, dog-friendly design</td>
                </tr>
                <tr>
                    <td>Recommended For</td>
                    <td>All dog sizes and ages</td>
                </tr>
                <tr>
                    <td>Care</td>
                    <td>Follow product-specific cleaning instructions</td>
                </tr>
                </table>
            </div>
            <div class="product-tags">
                <span class="product-tag">Premium Quality</span>
                <span class="product-tag">Dog-Friendly</span>
                <span class="product-tag">Durable</span>
            </div>
            `
    }

    // Calculate the old price (for display purposes)
    const oldPrice = (Number.parseFloat(productPrice) * 1.15).toFixed(2)

    // Create the product detail content with quantity selector
    productDetailBody.innerHTML = `
            <div class="product-detail-image">
                <img src="${productImage}" alt="${title}">
            </div>
            <div class="product-detail-info">
                <div class="product-detail-category">${category}</div>
                <h2 class="product-detail-title">${title}</h2>
                <div class="product-detail-price">
                    <span class="product-detail-current-price">$${productPrice}</span>
                    <span class="product-detail-old-price">$${oldPrice}</span>
                </div>
                <div class="product-detail-description">${description}</div>
                
                ${specifications}
                
                <div class="product-detail-quantity">
                    <h4>Quantity</h4>
                    <div class="quantity-selector">
                        <button class="quantity-btn decrease-detail-quantity">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="99">
                        <button class="quantity-btn increase-detail-quantity">+</button>
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
    const quantityInput = productDetailBody.querySelector(".quantity-input")
    const decreaseBtn = productDetailBody.querySelector(".decrease-detail-quantity")
    const increaseBtn = productDetailBody.querySelector(".increase-detail-quantity")
    const addToCartBtn = productDetailBody.querySelector(".product-detail-add-btn")

    decreaseBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(quantityInput.value)
    if (quantity > 1) {
        quantityInput.value = quantity - 1
    }
    })

    increaseBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(quantityInput.value)
    quantityInput.value = quantity + 1
    })

    addToCartBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(quantityInput.value)

    // Add to cart
    if (cart[productId]) {
        cart[productId].quantity += quantity
    } else {
        cart[productId] = {
        name: productName,
        price: Number.parseFloat(productPrice),
        image: productImage,
        quantity: quantity,
        }
    }

    // Save to localStorage
    saveCart()
    updateCartCount()
    renderCartItems()

    // Show toast notification
    showToast(`${productName} added to cart!`)

    // Close the modal
    closeProductDetailModal()
    })

    // Open the modal
    productDetailModal.classList.add("open")
    document.body.style.overflow = "hidden" // Prevent scrolling
}

// Close product detail modal
if (closeProductDetail) {
    closeProductDetail.addEventListener("click", closeProductDetailModal)
}

function closeProductDetailModal() {
    if (productDetailModal) {
    productDetailModal.classList.remove("open")
    document.body.style.overflow = "" // Re-enable scrolling
    }
}

// Close product detail modal when clicking outside
if (productDetailModal) {
    productDetailModal.addEventListener("click", (e) => {
    if (e.target === productDetailModal) {
        closeProductDetailModal()
    }
    })
}

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
if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
    cartModal.classList.remove("open")
    cartOverlay.classList.remove("open")
    document.body.style.overflow = ""
    })
}

// Checkout button - MODIFIED to let Django handle checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
    // Don't prevent default - let Django handle the checkout
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
    }
    })
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
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

// Show toast notification
function showToast(message) {
    if (toast && toastMessage) {
    toastMessage.textContent = message
    toast.classList.add("show")

    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
    }
}

// Handle ESC key to close modals
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
    if (cartModal && cartModal.classList.contains("open")) {
        cartModal.classList.remove("open")
        cartOverlay.classList.remove("open")
        document.body.style.overflow = ""
    }
    closeProductDetailModal()
    }
})

// Initialize cart count on page load
updateCartCount()
})