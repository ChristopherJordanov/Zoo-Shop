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
	const toast = document.getElementById("toast")
	const toastMessage = document.getElementById("toastMessage")

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
		this.style.backgroundColor = "var(--primary-dark)"

		setTimeout(() => {
		this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart'
		this.style.backgroundColor = ""
		}, 1500)

		showToast(`${product} added to your cart!`)
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
		showToast("Item removed from cart")
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
		showToast("Your cart is empty")
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
		// Simulate order placement
		showToast("Order placed successfully! Thank you for shopping with us.")
		cart = {}
		saveCart()
		updateCartCount()

		// Redirect back to home page
		setTimeout(() => {
		window.location.reload()
		}, 2000)
	})
	}

	// Show toast notification
	function showToast(message) {
	if (!toast) {
		// Create toast if it doesn't exist
		const newToast = document.createElement("div")
		newToast.className = "toast"
		newToast.id = "toast"
		newToast.innerHTML = `
				<i class="fas fa-check-circle"></i>
				<span id="toastMessage">${message}</span>
			`
		document.body.appendChild(newToast)

		setTimeout(() => {
		newToast.classList.add("show")
		}, 10)

		setTimeout(() => {
		newToast.classList.remove("show")
		setTimeout(() => {
			document.body.removeChild(newToast)
		}, 300)
		}, 3000)
		return
	}

	if (!toastMessage) {
		toast.innerHTML = `
				<i class="fas fa-check-circle"></i>
				<span id="toastMessage">${message}</span>
			`
	} else {
		toastMessage.textContent = message
	}

	toast.classList.add("show")

	setTimeout(() => {
		toast.classList.remove("show")
	}, 3000)
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

	// Newsletter form submission
	const newsletterForm = document.querySelector(".newsletter-form")
	if (newsletterForm) {
	newsletterForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const emailInput = newsletterForm.querySelector('input[type="email"]')
		const email = emailInput.value

		if (email) {
		showToast(`Thank you for subscribing with ${email}!`)
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

	// Special handling for contact-us which is inside testimonials section
	const contactUsLink = document.querySelector('a[href="#contact-us"]')
	if (contactUsLink) {
	contactUsLink.addEventListener("click", (e) => {
		e.preventDefault()

		// First scroll to testimonials section to ensure it's visible
		document.getElementById("testimonials").scrollIntoView({
		behavior: "smooth",
		})

		// Then scroll to the contact-us div with a slight delay to ensure proper positioning
		setTimeout(() => {
		document.getElementById("contact-us").scrollIntoView({
			behavior: "smooth",
			block: "center",
		})
		}, 100)
	})
	}

	// Logo link functionality
	const logoLink = document.getElementById("logoLink")
	if (logoLink) {
	logoLink.addEventListener("click", (e) => {
		// Let the default behavior handle the navigation to index page
		// No need to prevent default since we want the URL template tag to work
	})
	}

	// Initialize cart count on page load
	updateCartCount()
})

