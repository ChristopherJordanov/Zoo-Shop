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

// State - Use localStorage for cart persistence
let cart = JSON.parse(localStorage.getItem("cart")) || {}

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
	const productTitle = card.querySelector(".product-title").textContent
	const productPrice = card.querySelector(".current-price").textContent
	const productOldPrice = card.querySelector(".old-price")?.textContent || ""
	const productCategory = card.querySelector(".product-category").textContent
	const productDesc = card.querySelector(".product-info p").textContent
	const productImg = card.querySelector(".product-image img").src
	const addToCartBtn = card.querySelector(".add-to-cart-btn")
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
