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
	const productDetailModal = document.getElementById("productDetailModal")
	const closeProductDetail = document.getElementById("closeProductDetail")
	const productDetailBody = document.getElementById("productDetailBody")
	const quickViewButtons = document.querySelectorAll(".quick-view-btn")

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
		const productId = this.getAttribute("data-id")
		const product = this.getAttribute("data-product")
		const price = Number.parseFloat(this.getAttribute("data-price"))
		const image = this.getAttribute("data-image")

		// Animate image to cart
		animateToCart(this, image)

		// Check if product is already in cart
		if (cart[productId]) {
		cart[productId].quantity += 1
		} else {
		cart[productId] = {
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

	// Quick view functionality
	quickViewButtons.forEach((button) => {
	button.addEventListener("click", function (e) {
		e.preventDefault()
		e.stopPropagation()

		const productCard = this.closest(".product-card")
		const addToCartBtn = productCard.querySelector(".add-to-cart-btn")

		const productId = addToCartBtn.getAttribute("data-id")
		const productName = addToCartBtn.getAttribute("data-product")
		const productPrice = addToCartBtn.getAttribute("data-price")
		const productImage = addToCartBtn.getAttribute("data-image")
		const productCategory = productCard.querySelector(".product-category").textContent
		const productTitle = productCard.querySelector(".product-title").textContent
		const productDescription = productCard.querySelector(".product-description").textContent

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
	let specifications = "";
	let tags = "";

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
			<span class="product-tag">All Cat Ages</span>
		</div>
		`;
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
				<td>All cat sizes and ages</td>
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
		`;
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
		`;
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
		`;
	} else {
		specifications = `
		<div class="product-detail-specs">
			<h4>Product Specifications</h4>
			<table class="specs-table">
			<tr>
				<td>Materials</td>
				<td>Premium quality, cat-safe materials</td>
			</tr>
			<tr>
				<td>Dimensions</td>
				<td>Varies by product</td>
			</tr>
			<tr>
				<td>Features</td>
				<td>Durable, easy to clean, cat-friendly design</td>
			</tr>
			<tr>
				<td>Recommended For</td>
				<td>All cat sizes and ages</td>
			</tr>
			<tr>
				<td>Care</td>
				<td>Follow product-specific cleaning instructions</td>
			</tr>
			</table>
		</div>
		<div class="product-tags">
			<span class="product-tag">Premium Quality</span>
			<span class="product-tag">Cat-Friendly</span>
			<span class="product-tag">Durable</span>
		</div>
		`;
	}

	// Calculate the old price (for display purposes)
	const oldPrice = (parseFloat(productPrice) * 1.15).toFixed(2);

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
		updateCartDisplay()

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

	cartKeys.forEach((productId) => {
		const item = cart[productId]
		const itemTotal = item.price * item.quantity
		total += itemTotal

		cartHTML += `
		<div class="cart-item">
			<div class="cart-item-image">
			<img src="${item.image}" alt="${item.name}">
			</div>
			<div class="cart-item-details">
			<h4 class="cart-item-title">${item.name}</h4>
			<p class="cart-item-price">$${item.price.toFixed(2)}</p>
			<div class="cart-item-quantity">
				<button class="quantity-btn decrease-quantity" data-id="${productId}">-</button>
				<span class="quantity-value">${item.quantity}</span>
				<button class="quantity-btn increase-quantity" data-id="${productId}">+</button>
			</div>
			</div>
			<button class="cart-item-remove" data-id="${productId}">
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
		const productId = this.getAttribute("data-id")
		if (cart[productId].quantity > 1) {
			cart[productId].quantity -= 1
		} else {
			delete cart[productId]
		}
		saveCart()
		updateCartCount()
		updateCartDisplay()
		})
	})

	document.querySelectorAll(".increase-quantity").forEach((button) => {
		button.addEventListener("click", function () {
		const productId = this.getAttribute("data-id")
		cart[productId].quantity += 1
		saveCart()
		updateCartCount()
		updateCartDisplay()
		})
	})

	document.querySelectorAll(".cart-item-remove").forEach((button) => {
		button.addEventListener("click", function () {
		const productId = this.getAttribute("data-id")
		delete cart[productId]
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
		e.preventDefault()
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

	// Handle ESC key to close modals
	document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeCartModal()
		closeProductDetailModal()
	}
	})

	// Initialize cart count on page load
	updateCartCount()
})