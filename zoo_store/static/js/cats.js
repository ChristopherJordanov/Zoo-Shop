document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const navbar = document.querySelector(".navbar")
	const cartIcon = document.getElementById("cartIcon")
	const cartModal = document.getElementById("cartModal")
	const cartOverlay = document.getElementById("cartOverlay")
	const closeCartBtn = document.getElementById("closeCartBtn")
	const cartItems = document.getElementById("cartItems")
	const cartTotal = document.getElementById("cartTotal")
	const cartCountElement = document.querySelector(".cart-count")
	const checkoutBtn = document.getElementById("checkoutBtn")
	const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
	const navLinks = document.querySelector(".nav-links")
	const toast = document.getElementById("toast")
	const toastMessage = document.getElementById("toastMessage")

	// State - Use localStorage for cart persistence
	const cart = JSON.parse(localStorage.getItem("cart")) || {}

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
	if (mobileMenuBtn && navLinks) {
	mobileMenuBtn.addEventListener("click", () => {
		navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex"
	})
	}

	// Cart Modal Functionality
	if (cartIcon && cartModal && cartOverlay) {
	cartIcon.addEventListener("click", () => {
		updateCartDisplay()
		cartModal.classList.add("open")
		cartOverlay.classList.add("open")
		document.body.style.overflow = "hidden"
	})
	}

	if (closeCartBtn) {
	closeCartBtn.addEventListener("click", () => {
		closeCartModal()
	})
	}

	// Close cart when clicking on overlay
	if (cartOverlay) {
	cartOverlay.addEventListener("click", () => {
		closeCartModal()
	})
	}

	// Function to close cart modal
	function closeCartModal() {
	if (cartModal) cartModal.classList.remove("open")
	if (cartOverlay) cartOverlay.classList.remove("open")
	document.body.style.overflow = ""
	}

	// Add to cart functionality
	addToCartButtons.forEach((button) => {
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

		// Show toast notification
		showToast(`${product} added to cart!`)

		// Button animation
		const originalText = this.innerHTML
		this.innerHTML = '<i class="fas fa-check"></i> Added to Cart'
		this.style.backgroundColor = "var(--primary-dark)"

		setTimeout(() => {
		this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
		this.style.backgroundColor = ""
		}, 1500)
	})
	})

	// Animate product to cart
	function animateToCart(button, imageUrl) {
	if (!cartIcon) return

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

	// Update cart count
	function updateCartCount() {
	if (!cartCountElement) return

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
			<a href="#food" class="continue-shopping">Continue Shopping</a>
		</div>
		`
		if (cartTotal) cartTotal.textContent = "$0.00"
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
			<button class="cart-item-remove" data-product="${productName}">
			<i class="fas fa-trash-alt"></i>
			</button>
		</div>
		`
	})

	cartItems.innerHTML = cartHTML
	if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`

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

	document.querySelectorAll(".cart-item-remove").forEach((button) => {
		button.addEventListener("click", function () {
		const productName = this.getAttribute("data-product")
		delete cart[productName]
		saveCart()
		updateCartCount()
		updateCartDisplay()
		})
	})
	}

	// Checkout functionality
	if (checkoutBtn) {
	checkoutBtn.addEventListener("click", () => {
		if (Object.keys(cart).length === 0) {
		showToast("Your cart is empty!")
		return
		}

		// Add cart data to hidden input for form submission
		const cartDataInput = document.getElementById("cartData")
		if (cartDataInput) {
		cartDataInput.value = JSON.stringify(cart)
		}
	})
	}

	// Smooth scrolling
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		const targetId = this.getAttribute("href")
		if (targetId === "#" || !document.querySelector(targetId)) return

		const targetElement = document.querySelector(targetId)
		if (targetElement) {
		targetElement.scrollIntoView({ behavior: "smooth", block: "center" })

		// Close mobile menu if open
		if (window.innerWidth < 992 && navLinks) {
			navLinks.style.display = "none"
		}

		// Close cart modal if open
		closeCartModal()
		}
	})
	})

	// Initialize cart count on page load
	updateCartCount()
})
