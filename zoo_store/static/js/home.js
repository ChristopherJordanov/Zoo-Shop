document.addEventListener("DOMContentLoaded", () => {
// Elements
const navbar = document.querySelector(".navbar")
const cartIcon = document.getElementById("cartIcon")
const cartModal = document.getElementById("cartModal")
const cartOverlay = document.getElementById("cartOverlay")
const closeCart = document.getElementById("closeCart")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const cartCountElement = document.querySelector(".cart-count")
const checkoutBtn = document.getElementById("checkoutBtn")
const checkoutPage = document.getElementById("checkoutPage")
const checkoutItems = document.getElementById("checkoutItems")
const checkoutTotal = document.getElementById("checkoutTotal")
const placeOrderBtn = document.getElementById("placeOrderBtn")
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navLinks = document.querySelector(".nav-links")

// Admin elements
const adminViewBtn = document.getElementById("adminViewBtn")
const adminPasswordModal = document.getElementById("adminPasswordModal")
const closeAdminPasswordModal = document.getElementById("closeAdminPasswordModal")
const adminPasswordInput = document.getElementById("adminPassword")
const submitAdminPassword = document.getElementById("submitAdminPassword")
const adminPasswordError = document.getElementById("adminPasswordError")
const productsGrid = document.getElementById("products-grid")
const productsSection = document.querySelector(".products-section .container")

// State - Use localStorage for cart persistence
let cart = JSON.parse(localStorage.getItem("cart")) || {}

// Admin state
let isAdminMode = false
const correctPassword = "123dk"

// Get removed products from localStorage
const removedProducts = JSON.parse(localStorage.getItem("removedProducts")) || []

// Get added products from localStorage
const addedProducts = JSON.parse(localStorage.getItem("addedProducts")) || []

// Hide removed products on page load
hideRemovedProducts()

// Load added products on page load
if (productsGrid) {
	loadAddedProducts()
} else {
	// If productsGrid isn't available yet, wait for DOM to be fully loaded
	window.addEventListener("load", () => {
	const productsGridDelayed = document.getElementById("products-grid")
	if (productsGridDelayed) {
		loadAddedProducts()
	}
	})
}

// Fix product card heights and button alignment
function fixProductCardAlignment() {
	const productCards = document.querySelectorAll(".product-card")
	let maxInfoHeight = 0
	let maxTitleHeight = 0
	let maxDescHeight = 0

	// First pass: find maximum heights
	productCards.forEach((card) => {
	const productInfo = card.querySelector(".product-info")
	const productTitle = card.querySelector(".product-title")
	const productDesc = productTitle?.nextElementSibling

	if (productInfo && productTitle && productDesc) {
		maxInfoHeight = Math.max(maxInfoHeight, productInfo.offsetHeight)
		maxTitleHeight = Math.max(maxTitleHeight, productTitle.offsetHeight)
		maxDescHeight = Math.max(maxDescHeight, productDesc.offsetHeight)
	}
	})

	// Second pass: apply consistent heights
	productCards.forEach((card) => {
	const productInfo = card.querySelector(".product-info")
	const productTitle = card.querySelector(".product-title")
	const productDesc = productTitle?.nextElementSibling
	const addToCartBtn = card.querySelector(".add-to-cart-btn")

	if (productTitle) productTitle.style.height = `${maxTitleHeight}px`
	if (productDesc) productDesc.style.height = `${maxDescHeight}px`

	// Ensure consistent button positioning
	if (addToCartBtn) {
		addToCartBtn.style.marginTop = "15px"
		addToCartBtn.style.position = "relative"
		addToCartBtn.style.bottom = "0"
	}
	})
}

// Call the function after a slight delay to ensure all elements are rendered
setTimeout(fixProductCardAlignment, 100)

// Also call it on window resize
window.addEventListener("resize", fixProductCardAlignment)

// Navbar scroll effect
window.addEventListener("scroll", () => {
	if (window.scrollY > 50) {
	navbar.classList.add("scrolled")
	} else {
	navbar.classList.remove("scrolled")
	}

	// Reveal elements on scroll
	revealElements()
})

// Reveal elements on scroll
function revealElements() {
	const elements = document.querySelectorAll(".slide-up")

	elements.forEach((element) => {
	const elementTop = element.getBoundingClientRect().top
	const windowHeight = window.innerHeight

	if (elementTop < windowHeight - 100) {
		element.classList.add("active")
	}
	})
}

// Initial reveal check
revealElements()

// Mobile menu toggle
if (mobileMenuBtn) {
	mobileMenuBtn.addEventListener("click", () => {
	navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex"
	})
}

// Cart Modal Functionality
if (cartIcon && cartModal && closeCart) {
	cartIcon.addEventListener("click", () => {
	updateCartDisplay()
	cartModal.classList.add("active")
	cartOverlay.classList.add("active")
	document.body.style.overflow = "hidden"

	// Fix for cart modal positioning - ensure it's visible
	cartModal.style.right = "0"
	})

	closeCart.addEventListener("click", () => {
	closeCartModal()
	})

	// Close cart when clicking on overlay
	cartOverlay.addEventListener("click", () => {
	closeCartModal()
	})
}

// Function to close cart modal
function closeCartModal() {
	cartModal.classList.remove("active")
	cartOverlay.classList.remove("active")
	document.body.style.overflow = ""

	// Reset cart modal position when closing
	cartModal.style.right = "-400px"
}

// Save cart to localStorage
function saveCart() {
	localStorage.setItem("cart", JSON.stringify(cart))
}

// Add to cart functionality
addToCartButtons.forEach((button) => {
	button.addEventListener("click", function () {
	const product = this.getAttribute("data-product")
	const price = Number.parseFloat(this.getAttribute("data-price"))
	const image = this.getAttribute("data-image") || "https://source.unsplash.com/random/300x300/?pet"

	// Animate image to cart
	animateToCart(this, image)

	// Check if product is already in cart
	if (cart[product]) {
		cart[product].quantity += 1
	} else {
		cart[product] = {
		name: product,
		price: price,
		image: image,
		quantity: 1,
		}
	}

	// Save to localStorage
	saveCart()
	updateCartCount()
	updateCartDisplay()

	// Button animation
	const originalText = this.innerHTML
	this.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
	this.style.backgroundColor = "#d35400"

	setTimeout(() => {
		this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
		this.style.backgroundColor = ""
	}, 1500)
	})
})

// Animate product to cart
function animateToCart(button, imageUrl) {
	const img = document.createElement("img")
	img.src = imageUrl
	img.style.position = "absolute"
	img.style.width = "50px"
	img.style.height = "50px"
	img.style.borderRadius = "50%"
	img.style.zIndex = "1000"
	img.style.transition = "transform 0.8s ease-in-out, opacity 0.8s"

	const rect = button.getBoundingClientRect()
	img.style.left = `${rect.left + window.scrollX}px`
	img.style.top = `${rect.top + window.scrollY}px`
	document.body.appendChild(img)

	const cartIconRect = cartIcon.getBoundingClientRect()

	setTimeout(() => {
	img.style.transform = `translate(${cartIconRect.left - rect.left}px, ${cartIconRect.top - rect.top}px) scale(0.5)`
	img.style.opacity = "0"
	}, 10)

	setTimeout(() => {
	document.body.removeChild(img)
	}, 800)
}

// Update cart count
function updateCartCount() {
	const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0)
	cartCountElement.textContent = totalItems
	cartCountElement.style.transform = "scale(1.5)"
	setTimeout(() => {
	cartCountElement.style.transform = "scale(1)"
	}, 300)
}

// Update cart display
function updateCartDisplay() {
	if (!cartItems) return

	const cartKeys = Object.keys(cart)

	if (cartKeys.length === 0) {
	cartItems.innerHTML = `
				<div class="empty-cart">
				<i class="fas fa-shopping-cart"></i>
				<p>Your cart is empty</p>
				<a href="#products" class="continue-shopping">Continue Shopping</a>
				</div>
			`
	cartTotal.textContent = "$0.00"
	return
	}

	let cartHTML = ""
	let total = 0

	cartKeys.forEach((productKey) => {
	const item = cart[productKey]
	const itemTotal = item.price * item.quantity
	total += itemTotal

	// Use item.name for display if available, otherwise fall back to the key
	const displayName = item.name || productKey

	cartHTML += `
				<div class="cart-item">
				<div class="cart-item-image">
					<img src="${item.image}" alt="${displayName}">
				</div>
				<div class="cart-item-details">
					<h4 class="cart-item-title">${displayName}</h4>
					<p class="cart-item-price">$${item.price.toFixed(2)}</p>
					<div class="cart-item-quantity">
					<button class="quantity-btn decrease-quantity" data-product="${productKey}">-</button>
					<span class="quantity-value">${item.quantity}</span>
					<button class="quantity-btn increase-quantity" data-product="${productKey}">+</button>
					</div>
				</div>
				<button class="remove-item" data-product="${productKey}">
					<i class="fas fa-trash-alt"></i>
				</button>
				</div>
			`
	})

	cartItems.innerHTML = cartHTML
	cartTotal.textContent = `$${total.toFixed(2)}`

	// Add event listeners for quantity buttons and remove buttons
	document.querySelectorAll(".decrease-quantity").forEach((button) => {
	button.addEventListener("click", function () {
		const productName = this.getAttribute("data-product")
		if (cart[productName].quantity > 1) {
		cart[productName].quantity -= 1
		} else {
		delete cart[productName]
		}
		saveCart()
		updateCartCount()
		updateCartDisplay()
	})
	})

	document.querySelectorAll(".increase-quantity").forEach((button) => {
	button.addEventListener("click", function () {
		const productName = this.getAttribute("data-product")
		cart[productName].quantity += 1
		saveCart()
		updateCartCount()
		updateCartDisplay()
	})
	})

	document.querySelectorAll(".remove-item").forEach((button) => {
	button.addEventListener("click", function () {
		const productName = this.getAttribute("data-product")
		delete cart[productName]
		saveCart()
		updateCartCount()
		updateCartDisplay()
	})
	})
}

// Update checkout summary
function updateCheckoutSummary() {
	if (!checkoutItems || !checkoutTotal) return

	let checkoutHTML = ""
	let total = 0

	Object.entries(cart).forEach(([productName, item]) => {
	const itemTotal = item.price * item.quantity
	total += itemTotal

	checkoutHTML += `
				<div class="summary-item">
					<span>${productName} x ${item.quantity}</span>
					<span>$${itemTotal.toFixed(2)}</span>
				</div>
				`
	})

	checkoutItems.innerHTML = checkoutHTML
	checkoutTotal.textContent = `$${total.toFixed(2)}`
}

// Checkout functionality
if (checkoutBtn) {
	checkoutBtn.addEventListener("click", () => {
	if (Object.keys(cart).length === 0) {
		return
	}

	closeCartModal()
	document.body.scrollTop = 0 // For Safari
	document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
	document.querySelectorAll("section").forEach((section) => {
		section.style.display = "none"
	})
	checkoutPage.style.display = "block"
	updateCheckoutSummary()
	})
}

// Place order functionality
if (placeOrderBtn) {
	placeOrderBtn.addEventListener("click", () => {
	// Get current user
	const currentUser = JSON.parse(localStorage.getItem("currentUser"))

	if (currentUser) {
		// Create order object
		const order = {
		id: Date.now().toString(),
		date: new Date().toISOString(),
		items: { ...cart },
		total: Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0),
		}

		// Get users from localStorage
		const users = JSON.parse(localStorage.getItem("users")) || []

		// Find current user in users array
		const userIndex = users.findIndex((u) => u.id === currentUser.id)

		if (userIndex !== -1) {
		// Add order to user's orders
		if (!users[userIndex].orders) {
			users[userIndex].orders = []
		}
		users[userIndex].orders.push(order)

		// Update users in localStorage
		localStorage.setItem("users", JSON.stringify(users))

		// Update current user in localStorage
		localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
		}
	}

	// Simulate order placement
	cart = {}
	saveCart()
	updateCartCount()

	// Redirect back to home page
	setTimeout(() => {
		window.location.reload()
	}, 2000)
	})
}

// Button functionality
const shopNowBtn = document.getElementById("shopNowBtn")
if (shopNowBtn) {
	shopNowBtn.addEventListener("click", () => {
	document.getElementById("products").scrollIntoView({
		behavior: "smooth",
		block: "start",
	})
	})
}

const learnMoreBtn = document.getElementById("learnMoreBtn")
if (learnMoreBtn) {
	learnMoreBtn.addEventListener("click", () => {
	document.getElementById("about").scrollIntoView({
		behavior: "smooth",
		block: "start",
	})
	})
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
	const targetId = this.getAttribute("href")
	if (targetId === "#" || !document.querySelector(targetId)) return

	// If we're in checkout page, return to main page
	if (checkoutPage && checkoutPage.style.display === "block") {
		checkoutPage.style.display = "none"
		document.querySelectorAll("section").forEach((section) => {
		if (section.id !== "checkoutPage") {
			section.style.display = "block"
		}
		})
	}

	const targetElement = document.querySelector(targetId)
	if (targetElement) {
		targetElement.scrollIntoView({ behavior: "smooth", block: "center" })

		// Close mobile menu if open
		if (window.innerWidth < 992 && navLinks) {
		navLinks.style.display = "none"
		}

		// Close cart modal if open
		if (cartModal) {
		closeCartModal()
		}
	}
	})
})

// Special handling for contact-us which is inside testimonials section
const contactUsLink = document.querySelector('a[href="#contact-us"]')
if (contactUsLink) {
	contactUsLink.addEventListener("click", (e) => {
	// First scroll to testimonials section to ensure it's visible

	// Then scroll to the contact-us div with a slight delay to ensure proper positioning
	setTimeout(() => {
		document.getElementById("contact-us").scrollIntoView({
		behavior: "smooth",
		block: "center",
		})
	}, 100)
	})
}

// Initialize cart count on page load
updateCartCount()

// Elements for Quick View
const productCards = document.querySelectorAll(".product-card")
const quickViewModal = document.createElement("div")
quickViewModal.className = "quick-view-modal"
document.body.appendChild(quickViewModal)

// Add quick view button to each product card
productCards.forEach((card) => {
	const productImage = card.querySelector(".product-image")
	if (!productImage) return

	const productTitle = card.querySelector(".product-title")?.textContent
	const productPrice = card.querySelector(".current-price")?.textContent
	const productOldPrice = card.querySelector(".old-price")?.textContent || ""
	const productCategory = card.querySelector(".product-category")?.textContent
	const productDesc = card.querySelector(".product-info p")?.textContent
	const productImg = card.querySelector(".product-image img")?.src
	const addToCartBtn = card.querySelector(".add-to-cart-btn")
	if (!addToCartBtn) return

	const productData = addToCartBtn.dataset

	// Create quick view button
	const quickViewBtn = document.createElement("button")
	quickViewBtn.className = "quick-view-btn"
	quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Quick View'
	productImage.appendChild(quickViewBtn)

	// Quick view button click handler
	quickViewBtn.addEventListener("click", (e) => {
	e.preventDefault()
	e.stopPropagation()
	openQuickView(productTitle, productPrice, productOldPrice, productCategory, productDesc, productImg, productData)
	})
})

// Function to open quick view modal
function openQuickView(title, price, oldPrice, category, description, image, productData) {
	// Create modal content
	quickViewModal.innerHTML = `
			<div class="quick-view-content">
			<button class="close-quick-view">
				<i class="fas fa-times"></i>
			</button>
			<div class="quick-view-header">
				<div class="quick-view-category">${category}</div>
			</div>
			<div class="quick-view-body">
				<div class="quick-view-image">
				<img src="${image}" alt="${title}">
				</div>
				<div class="quick-view-details">
				<h2 class="quick-view-title">${title}</h2>
				<div class="quick-view-price">
					<span class="quick-view-current-price">${price}</span>
					${oldPrice ? `<span class="quick-view-old-price">${oldPrice}</span>` : ""}
				</div>
				<p class="quick-view-description">${description}</p>
				
				<div class="quick-view-specs">
					<div class="spec-row">
					<div class="spec-label">Weight</div>
					<div class="spec-value">500g</div>
					</div>
					<div class="spec-row">
					<div class="spec-label">Ingredients</div>
					<div class="spec-value">Premium meat, vegetables, essential nutrients</div>
					</div>
					<div class="spec-row">
					<div class="spec-label">Protein Content</div>
					<div class="spec-value">15%</div>
					</div>
					<div class="spec-row">
					<div class="spec-label">Shelf Life</div>
					<div class="spec-value">18 months</div>
					</div>
					<div class="spec-row">
					<div class="spec-label">Feeding Instructions</div>
					<div class="spec-value">Feed 1-2 tablespoons daily</div>
					</div>
				</div>
				
				<div class="quick-view-tags">
					<span class="quick-view-tag">All Natural</span>
					<span class="quick-view-tag">No Preservatives</span>
					<span class="quick-view-tag">All Dog Ages</span>
				</div>
				
				<div class="quick-view-quantity">
					<span class="quick-view-quantity-label">Quantity</span>
					<div class="quantity-controls">
					<button class="quantity-btn quantity-decrease">-</button>
					<input type="text" class="quantity-input" value="1" readonly>
					<button class="quantity-btn quantity-increase">+</button>
					</div>
				</div>
				
				<div class="quick-view-actions">
					<button class="quick-view-add-to-cart" 
					data-product="${productData.product}" 
					data-price="${productData.price}" 
					data-image="${image}">
					<i class="fas fa-shopping-cart"></i> Add to Cart
					</button>
				</div>
				</div>
			</div>
			</div>
		`

	// Show modal
	quickViewModal.classList.add("active")
	document.body.style.overflow = "hidden"

	// Close button functionality
	const closeBtn = quickViewModal.querySelector(".close-quick-view")
	closeBtn.addEventListener("click", closeQuickView)

	// Close when clicking outside the content
	quickViewModal.addEventListener("click", (e) => {
	if (e.target === quickViewModal) {
		closeQuickView()
	}
	})

	// Quantity controls
	const quantityInput = quickViewModal.querySelector(".quantity-input")
	const decreaseBtn = quickViewModal.querySelector(".quantity-decrease")
	const increaseBtn = quickViewModal.querySelector(".quantity-increase")

	decreaseBtn.addEventListener("click", () => {
	const value = Number.parseInt(quantityInput.value)
	if (value > 1) {
		quantityInput.value = value - 1
	}
	})

	increaseBtn.addEventListener("click", () => {
	const value = Number.parseInt(quantityInput.value)
	quantityInput.value = value + 1
	})

	// Add to cart functionality
	const addToCartBtn = quickViewModal.querySelector(".quick-view-add-to-cart")
	addToCartBtn.addEventListener("click", function () {
	const product = this.getAttribute("data-product")
	const price = Number.parseFloat(this.getAttribute("data-price"))
	const image = this.getAttribute("data-image")
	const quantity = Number.parseInt(quantityInput.value)

	// Check if product is already in cart
	if (cart[product]) {
		cart[product].quantity += quantity
	} else {
		cart[product] = {
		name: product,
		price: price,
		image: image,
		quantity: quantity,
		}
	}

	// Save to localStorage
	saveCart()
	updateCartCount()
	updateCartDisplay()

	// Close modal after adding to cart
	closeQuickView()

	// Show confirmation
	const toast = document.createElement("div")
	toast.className = "toast"
	toast.innerHTML = `
				<i class="fas fa-check-circle"></i>
				<span>${product} added to cart</span>
				`
	document.body.appendChild(toast)

	setTimeout(() => {
		toast.classList.add("show")
	}, 100)

	setTimeout(() => {
		toast.classList.remove("show")
		setTimeout(() => {
		document.body.removeChild(toast)
		}, 300)
	}, 3000)
	})
}

// Function to close quick view modal
function closeQuickView() {
	quickViewModal.classList.remove("active")
	document.body.style.overflow = ""
}

// Show admin password modal
if (adminViewBtn) {
	adminViewBtn.addEventListener("click", () => {
	adminPasswordModal.classList.add("active")
	adminPasswordInput.value = ""
	adminPasswordError.textContent = ""
	document.body.style.overflow = "hidden"
	})
}

// Close admin password modal
if (closeAdminPasswordModal) {
	closeAdminPasswordModal.addEventListener("click", () => {
	adminPasswordModal.classList.remove("active")
	document.body.style.overflow = ""
	})
}

// Submit admin password
if (submitAdminPassword) {
	submitAdminPassword.addEventListener("click", validateAdminPassword)

	// Also allow Enter key to submit
	adminPasswordInput.addEventListener("keyup", (e) => {
	if (e.key === "Enter") {
		validateAdminPassword()
	}
	})
}

// Validate admin password
function validateAdminPassword() {
	const password = adminPasswordInput.value

	if (password === correctPassword) {
	// Password is correct
	adminPasswordModal.classList.remove("active")
	document.body.style.overflow = ""
	enableAdminMode()
	} else {
	// Password is incorrect
	adminPasswordError.textContent = "Incorrect password. Please try again."
	adminPasswordInput.value = ""
	adminPasswordInput.focus()
	}
}

// Enable admin mode
function enableAdminMode() {
	isAdminMode = true

	// Add admin controls to products section
	addAdminControls()

	// Add remove buttons to each product
	addRemoveButtons()

	// Show success toast
	showToast("Admin mode enabled", "success")
}

// Add admin controls to products section
function addAdminControls() {
	// Check if admin controls already exist
	if (document.querySelector(".admin-product-controls")) {
	document.querySelector(".admin-product-controls").style.display = "block"
	return
	}

	// Create admin controls
	const adminControls = document.createElement("div")
	adminControls.className = "admin-product-controls"
	adminControls.style.display = "block" // Ensure it's visible
	adminControls.style.textAlign = "center"
	adminControls.style.padding = "20px"
	adminControls.style.margin = "20px 0"
	adminControls.style.backgroundColor = "#e7f7ed"
	adminControls.style.border = "3px dashed #27ae60"
	adminControls.style.borderRadius = "8px"

	// Create add product button
	const addProductBtn = document.createElement("button")
	addProductBtn.className = "add-product-btn"
	addProductBtn.innerHTML = '<i class="fas fa-plus"></i> ADD NEW PRODUCT'
	addProductBtn.style.backgroundColor = "#27ae60"
	addProductBtn.style.color = "white"
	addProductBtn.style.border = "none"
	addProductBtn.style.padding = "15px 30px"
	addProductBtn.style.fontSize = "18px"
	addProductBtn.style.fontWeight = "bold"
	addProductBtn.style.borderRadius = "6px"
	addProductBtn.style.cursor = "pointer"
	addProductBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)"
	addProductBtn.addEventListener("click", showAddProductForm)

	// Add elements to DOM
	adminControls.appendChild(addProductBtn)

	// Insert admin controls in a more visible location - directly before the products grid
	if (productsGrid && productsGrid.parentNode) {
	productsGrid.parentNode.insertBefore(adminControls, productsGrid)
	} else {
	// Fallback - insert before products header
	const productsHeader = document.querySelector(".products-header")
	if (productsHeader && productsSection) {
		productsSection.insertBefore(adminControls, productsHeader)
	} else {
		// Last resort - append to products section
		if (productsSection) {
		productsSection.appendChild(adminControls)
		} else {
		// If all else fails, add it to the body
		document.body.appendChild(adminControls)
		}
	}
	}

	// Add a clear message
	const adminMessage = document.createElement("p")
	adminMessage.textContent = "You are in admin mode. Use the button above to add new products."
	adminMessage.style.marginTop = "10px"
	adminMessage.style.color = "#333"
	adminControls.appendChild(adminMessage)

	// Scroll to the admin controls to make them visible
	setTimeout(() => {
	adminControls.scrollIntoView({ behavior: "smooth", block: "center" })
	}, 300)
}

// Add remove buttons to each product
function addRemoveButtons() {
	const productCards = document.querySelectorAll(".product-card")

	productCards.forEach((card) => {
	// Skip if this product is in the removed list
	const productTitle = card.querySelector(".product-title")?.textContent
	if (removedProducts.includes(productTitle)) {
		return
	}

	// Check if remove button already exists
	if (card.querySelector(".remove-product-btn")) {
		card.querySelector(".remove-product-btn").style.display = "flex"
		card.classList.add("admin-mode")
		return
	}

	// Create remove button
	const removeBtn = document.createElement("button")
	removeBtn.className = "remove-product-btn"
	removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove Product'
	removeBtn.addEventListener("click", () => {
		removeProduct(card)
	})

	// Add remove button to product card
	card.appendChild(removeBtn)
	card.classList.add("admin-mode")
	})
}

// Hide removed products on page load
function hideRemovedProducts() {
	const productCards = document.querySelectorAll(".product-card")

	productCards.forEach((card) => {
	const productTitle = card.querySelector(".product-title")?.textContent
	if (removedProducts.includes(productTitle)) {
		card.style.display = "none"
	}
	})
}

// Load added products from localStorage
function loadAddedProducts() {
	if (!addedProducts || addedProducts.length === 0) {
	console.log("No added products to load")
	return
	}

	const productsGridForLoading = document.getElementById("products-grid")
	if (!productsGridForLoading) {
	console.error("Products grid not found in the DOM")
	return
	}

	console.log(`Loading ${addedProducts.length} products from localStorage`)

	addedProducts.forEach((product) => {
	// Skip if this product is in the removed list
	if (removedProducts.includes(product.title)) {
		return
	}

	// Create new product card
	const productCard = document.createElement("div")
	productCard.className = "product-card slide-up active"

	// Build product HTML
	productCard.innerHTML = `
				<div class="product-image">
					<img src="${product.image}" alt="${product.title}">
					${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
					<div class="product-actions">
						<button class="product-action-btn"><i class="fas fa-heart"></i></button>
						<button class="product-action-btn"><i class="fas fa-eye"></i></button>
						<button class="product-action-btn"><i class="fas fa-sync-alt"></i></button>
					</div>
				</div>
				<div class="product-info">
					<span class="product-category">${product.category}</span>
					<h3 class="product-title">${product.title}</h3>
					<p>${product.description}</p>
					<div class="product-price">
						<span class="current-price">$${Number.parseFloat(product.price).toFixed(2)}</span>
						${product.oldPrice ? `<span class="old-price">$${Number.parseFloat(product.oldPrice).toFixed(2)}</span>` : ""}
					</div>
					<button class="add-to-cart-btn" data-product="${product.title}" data-price="${product.price}" data-image="${product.image}">
						<i class="fas fa-shopping-cart"></i> Add to Cart
					</button>
				</div>
			`

	// Add to products grid
	productsGridForLoading.appendChild(productCard)

	// Add event listener to add to cart button
	const addToCartBtn = productCard.querySelector(".add-to-cart-btn")
	if (addToCartBtn) {
		addToCartBtn.addEventListener("click", function () {
		const product = this.getAttribute("data-product")
		const price = Number.parseFloat(this.getAttribute("data-price"))
		const image = this.getAttribute("data-image")

		// Animate image to cart
		animateToCart(this, image)

		// Add to cart logic
		if (cart[product]) {
			cart[product].quantity += 1
		} else {
			cart[product] = {
			name: product,
			price: price,
			image: image,
			quantity: 1,
			}
		}

		// Save to localStorage
		saveCart()
		updateCartCount()
		updateCartDisplay()

		// Button animation
		const originalText = this.innerHTML
		this.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
		this.style.backgroundColor = "#d35400"

		setTimeout(() => {
			this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
			this.style.backgroundColor = ""
		}, 1500)
		})
	}

	// Add quick view functionality
	const productImage = productCard.querySelector(".product-image")
	if (productImage) {
		const quickViewBtn = document.createElement("button")
		quickViewBtn.className = "quick-view-btn"
		quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Quick View'
		productImage.appendChild(quickViewBtn)

		quickViewBtn.addEventListener("click", (e) => {
		e.preventDefault()
		e.stopPropagation()
		openQuickView(
			product.title,
			`$${Number.parseFloat(product.price).toFixed(2)}`,
			product.oldPrice ? `$${Number.parseFloat(product.oldPrice).toFixed(2)}` : "",
			product.category,
			product.description,
			product.image,
			{ product: product.title, price: product.price },
		)
		})
	}
	})

	// Add remove buttons if in admin mode
	if (isAdminMode) {
	addRemoveButtons()
	}

	// Fix product card alignment
	setTimeout(fixProductCardAlignment, 100)
}

// Remove product
function removeProduct(productCard) {
	// Ask for confirmation
	if (confirm("Are you sure you want to remove this product? This action is permanent.")) {
	// Get product title for identification
	const productTitle = productCard.querySelector(".product-title")?.textContent

	if (productTitle) {
		// Add to removed products list if not already there
		if (!removedProducts.includes(productTitle)) {
		removedProducts.push(productTitle)
		localStorage.setItem("removedProducts", JSON.stringify(removedProducts))
		}

		// Remove from addedProducts if it exists there
		const addedProductIndex = addedProducts.findIndex((p) => p.title === productTitle)
		if (addedProductIndex !== -1) {
		addedProducts.splice(addedProductIndex, 1)
		localStorage.setItem("addedProducts", JSON.stringify(addedProducts))
		}
	}

	// Remove product with animation
	productCard.style.opacity = "0"
	productCard.style.transform = "scale(0.8)"

	setTimeout(() => {
		productCard.style.display = "none"
		showToast("Product removed permanently", "success")
	}, 300)
	}
}

// Show add product form
function showAddProductForm() {
	// Create modal if it doesn't exist
	if (!document.getElementById("addProductModal")) {
	createAddProductModal()
	}

	// Show modal
	document.getElementById("addProductModal").classList.add("active")
	document.body.style.overflow = "hidden"
}

// Create add product modal
function createAddProductModal() {
	const modal = document.createElement("div")
	modal.id = "addProductModal"
	modal.className = "add-product-modal"

	modal.innerHTML = `
			<div class="add-product-content">
				<button id="closeAddProductModal" class="close-modal">
					<i class="fas fa-times"></i>
				</button>
				<div class="add-product-container">
					<h2>Add New Product</h2>
					<form id="addProductForm" class="add-product-form">
						<div class="form-row">
							<div class="form-group">
								<label for="productTitle">Product Title</label>
								<input type="text" id="productTitle" required>
							</div>
							<div class="form-group">
								<label for="productCategory">Category</label>
								<input type="text" id="productCategory" required>
							</div>
						</div>
						<div class="form-group">
							<label for="productDescription">Description</label>
							<textarea id="productDescription" required></textarea>
						</div>
						<div class="form-row">
							<div class="form-group">
								<label for="productPrice">Price ($)</label>
								<input type="number" id="productPrice" step="0.01" min="0" required>
							</div>
							<div class="form-group">
								<label for="productOldPrice">Old Price ($) (Optional)</label>
								<input type="number" id="productOldPrice" step="0.01" min="0">
							</div>
						</div>
						<div class="form-group">
							<label for="productImage">Image URL</label>
							<input type="text" id="productImage" value="../static/images/placeholder.jpg" required>
						</div>
						<div class="form-group">
							<label for="productBadge">Badge (Optional)</label>
							<input type="text" id="productBadge" placeholder="e.g., NEW, SALE">
						</div>
						<div class="add-product-actions">
							<button type="button" class="cancel-add-product" id="cancelAddProduct">Cancel</button>
							<button type="submit" class="submit-add-product">Add Product</button>
						</div>
					</form>
				</div>
			</div>
		`

	document.body.appendChild(modal)

	// Add event listeners
	document.getElementById("closeAddProductModal").addEventListener("click", closeAddProductModal)
	document.getElementById("cancelAddProduct").addEventListener("click", closeAddProductModal)
	document.getElementById("addProductForm").addEventListener("submit", addNewProduct)
}

// Close add product modal
function closeAddProductModal() {
	document.getElementById("addProductModal").classList.remove("active")
	document.body.style.overflow = ""
}

// Add new product
function addNewProduct(e) {
	e.preventDefault()

	// Get form values
	const title = document.getElementById("productTitle").value
	const category = document.getElementById("productCategory").value
	const description = document.getElementById("productDescription").value
	const price = document.getElementById("productPrice").value
	const oldPrice = document.getElementById("productOldPrice").value
	const image = document.getElementById("productImage").value
	const badge = document.getElementById("productBadge").value

	// Create product object to store in localStorage
	const newProduct = {
	title: title,
	category: category,
	description: description,
	price: price,
	oldPrice: oldPrice || "",
	image: image,
	badge: badge || "",
	}

	// Add to addedProducts array
	addedProducts.push(newProduct)

	// Save to localStorage
	localStorage.setItem("addedProducts", JSON.stringify(addedProducts))

	// Create new product card
	const productCard = document.createElement("div")
	productCard.className = "product-card slide-up active"

	// Build product HTML
	productCard.innerHTML = `
			<div class="product-image">
				<img src="${image}" alt="${title}">
				${badge ? `<span class="product-badge">${badge}</span>` : ""}
				<div class="product-actions">
					<button class="product-action-btn"><i class="fas fa-heart"></i></button>
					<button class="product-action-btn"><i class="fas fa-eye"></i></button>
					<button class="product-action-btn"><i class="fas fa-sync-alt"></i></button>
				</div>
			</div>
			<div class="product-info">
				<span class="product-category">${category}</span>
				<h3 class="product-title">${title}</h3>
				<p>${description}</p>
				<div class="product-price">
					<span class="current-price">$${Number.parseFloat(price).toFixed(2)}</span>
					${oldPrice ? `<span class="old-price">$${Number.parseFloat(oldPrice).toFixed(2)}</span>` : ""}
				</div>
				<button class="add-to-cart-btn" data-product="${title}" data-price="${price}" data-image="${image}">
					<i class="fas fa-shopping-cart"></i> Add to Cart
				</button>
			</div>
		`

	// Create remove button
	const removeBtn = document.createElement("button")
	removeBtn.className = "remove-product-btn"
	removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove Product'
	removeBtn.style.display = "flex"
	removeBtn.addEventListener("click", () => {
	removeProduct(productCard)
	})

	// Add remove button to product card
	productCard.appendChild(removeBtn)
	productCard.classList.add("admin-mode")

	// Add product to grid
	productsGrid.appendChild(productCard)

	// Add event listener to add to cart button
	const addToCartBtn = productCard.querySelector(".add-to-cart-btn")
	addToCartBtn.addEventListener("click", function () {
	const product = this.getAttribute("data-product")
	const price = Number.parseFloat(this.getAttribute("data-price"))
	const image = this.getAttribute("data-image")

	// Animate image to cart
	animateToCart(this, image)

	// Add to cart logic
	if (cart[product]) {
		cart[product].quantity += 1
	} else {
		cart[product] = {
		name: product,
		price: price,
		image: image,
		quantity: 1,
		}
	}

	// Save to localStorage
	saveCart()
	updateCartCount()
	updateCartDisplay()

	// Button animation
	const originalText = this.innerHTML
	this.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
	this.style.backgroundColor = "#d35400"

	setTimeout(() => {
		this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
		this.style.backgroundColor = ""
	}, 1500)
	})

	// Add quick view functionality
	const productImage = productCard.querySelector(".product-image")
	const quickViewBtn = document.createElement("button")
	quickViewBtn.className = "quick-view-btn"
	quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Quick View'
	productImage.appendChild(quickViewBtn)

	quickViewBtn.addEventListener("click", (e) => {
	e.preventDefault()
	e.stopPropagation()
	openQuickView(
		title,
		`$${Number.parseFloat(price).toFixed(2)}`,
		oldPrice ? `$${Number.parseFloat(oldPrice).toFixed(2)}` : "",
		category,
		description,
		image,
		{ product: title, price: price },
	)
	})

	// Close modal
	closeAddProductModal()

	// Show success message
	showToast("Product added successfully", "success")

	// Reset form
	document.getElementById("addProductForm").reset()

	// Fix product card alignment
	setTimeout(fixProductCardAlignment, 100)

	// Scroll to the new product
	setTimeout(() => {
	productCard.scrollIntoView({ behavior: "smooth", block: "center" })
	}, 300)
}

// Show toast notification
function showToast(message, type = "info") {
	// Remove existing toast if any
	const existingToast = document.querySelector(".toast")
	if (existingToast) {
	existingToast.remove()
	}

	// Create toast element
	const toast = document.createElement("div")
	toast.className = `toast ${type}`

	// Set icon based on type
	let icon = "info-circle"
	if (type === "success") icon = "check-circle"
	if (type === "error") icon = "exclamation-circle"

	toast.innerHTML = `
			<i class="fas fa-${icon}"></i>
			<span>${message}</span>
		`

	// Add to DOM
	document.body.appendChild(toast)

	// Show toast
	setTimeout(() => {
	toast.classList.add("show")
	}, 100)

	// Hide toast after 3 seconds
	setTimeout(() => {
	toast.classList.remove("show")
	setTimeout(() => {
		toast.remove()
	}, 300)
	}, 3000)
}
})

document.addEventListener("DOMContentLoaded", () => {
const checkoutBtn = document.getElementById("checkoutBtn")
if (checkoutBtn) {
	checkoutBtn.addEventListener("click", () => {
	const cart = JSON.parse(localStorage.getItem("cart")) || {}
	const cartDataInput = document.getElementById("cartData")
	if (cartDataInput) {
		cartDataInput.value = JSON.stringify(cart)
		console.log("📦 Cart sent:", cartDataInput.value)
	}
	})
}
})

document.querySelectorAll(".smooth-scroll").forEach((anchor) => {
anchor.addEventListener("click", function (e) {
	const targetId = this.getAttribute("href").substring(1)
	const targetElement = document.getElementById(targetId)

	if (targetElement) {
	window.scrollTo({
		top: targetElement.offsetTop - 50,
		behavior: "smooth",
	})
	}
})
})
