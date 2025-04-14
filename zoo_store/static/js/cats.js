// This is the fixed version of your cart functionality
// The main issue is that your JS adds "active" class but CSS looks for "open" class

document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const navbar = document.querySelector(".navbar")
	const cartIcon = document.querySelector(".cart-icon")
	const cartCount = document.querySelector(".cart-count")
	const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
	const navLinks = document.querySelector(".nav-links")

	// State - Use localStorage for cart persistence
	let cart = JSON.parse(localStorage.getItem("cart")) || {}

	// Get cart modal elements
	const cartModal = document.getElementById("cartModal")
	const closeCart = document.getElementById("closeCartBtn")
	const cartItems = document.getElementById("cartItems")
	const cartTotal = document.getElementById("cartTotal")
	const checkoutBtn = document.querySelector(".checkout-btn")

	// Get newly created checkout elements
	const checkoutPage = document.getElementById("checkoutPage")
	const checkoutItems = document.getElementById("checkoutItems")
	const checkoutTotal = document.getElementById("checkoutTotal")
	const placeOrderBtn = document.getElementById("placeOrderBtn")

	// Save cart to localStorage
	function saveCart() {
	localStorage.setItem("cart", JSON.stringify(cart))
	}

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
		cartModal.classList.add("open") // FIXED: Changed from "active" to "open" to match CSS
		document.body.style.overflow = "hidden"

		// Add animation class
		setTimeout(() => {
		cartModal.querySelector(".cart-content") && cartModal.querySelector(".cart-content").classList.add("slide-in")
		}, 10)
	})

	closeCart.addEventListener("click", () => {
		closeCartModal()
	})

	// Close cart when clicking outside
	window.addEventListener("click", (e) => {
		if (e.target === cartModal) {
		closeCartModal()
		}
	})
	}

	// Function to close cart modal with animation
	function closeCartModal() {
	const cartContent = cartModal.querySelector(".cart-content")
	if (cartContent) {
		cartContent.classList.remove("slide-in")
		cartContent.classList.add("slide-out")

		setTimeout(() => {
		cartModal.classList.remove("open") // FIXED: Changed from "active" to "open" to match CSS
		document.body.style.overflow = ""
		cartContent.classList.remove("slide-out")
		}, 300)
	} else {
		cartModal.classList.remove("open") // FIXED: Changed from "active" to "open" to match CSS
		document.body.style.overflow = ""
	}
	}

	// Add to cart functionality
	addToCartButtons.forEach((button) => {
	// Remove disabled class if present
	button.classList.remove("disabled")

	button.addEventListener("click", function () {
		const product = this.getAttribute("data-product")
		const price = Number.parseFloat(this.getAttribute("data-price"))
		const image =
		this.getAttribute("data-image") || this.closest(".product-card").querySelector(".product-image img").src

		// Animate image to cart
		animateToCart(this, image)

		// Check if product is already in cart
		if (cart[product]) {
		cart[product].quantity += 1
		} else {
		cart[product] = {
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
		this.style.backgroundColor = "var(--primary-dark, #388E3C)"

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
	cartCount.textContent = totalItems
	cartCount.style.transform = "scale(1.5)"
	setTimeout(() => {
		cartCount.style.transform = "scale(1)"
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
		<a href="#food" class="continue-shopping">Continue Shopping</a>
		</div>
	`
		cartTotal.textContent = "$0.00"
		return
	}

	let cartHTML = ""
	let total = 0

	cartKeys.forEach((productName) => {
		const item = cart[productName]
		const itemTotal = item.price * item.quantity
		total += itemTotal

		cartHTML += `
				<div class="cart-item">
					<div class="cart-item-image">
						<img src="${item.image}" alt="${productName}">
					</div>
					<div class="cart-item-details">
						<h4 class="cart-item-title">${productName}</h4>
						<p class="cart-item-price">$${item.price.toFixed(2)}</p>
						<div class="cart-item-quantity">
							<button class="quantity-btn decrease-quantity" data-product="${productName}">-</button>
							<span class="quantity-value">${item.quantity}</span>
							<button class="quantity-btn increase-quantity" data-product="${productName}">+</button>
						</div>
					</div>
					<button class="remove-item" data-product="${productName}">
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

		cartModal.classList.remove("open") // FIXED: Changed from "active" to "open" to match CSS
		document.body.style.overflow = ""
		document.body.scrollTop = 0 // For Safari
		document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
		document.querySelectorAll("section").forEach((section) => {
		if (section.id !== "checkoutPage") {
			section.style.display = "none"
		}
		})
		checkoutPage.style.display = "block"
		updateCheckoutSummary()
	})
	}

	// Place order functionality
	if (placeOrderBtn) {
	placeOrderBtn.addEventListener("click", () => {
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

	// Newsletter form submission
	const newsletterForm = document.querySelector(".newsletter-form")
	if (newsletterForm) {
	newsletterForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const emailInput = newsletterForm.querySelector('input[type="email"]')
		const email = emailInput.value

		if (email) {
		emailInput.value = ""
		}
	})
	}

	// Smooth scrolling
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault()

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

	// Initialize cart count on page load
	updateCartCount()
})
