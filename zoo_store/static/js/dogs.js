function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            if (cookie.trim().startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.trim().substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ✅ Add to Cart logic
document.addEventListener("DOMContentLoaded", function () {
    // Setup cart buttons
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const name = button.dataset.product;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;

            let cart = JSON.parse(localStorage.getItem('cart')) || {};

            if (cart[productId]) {
                cart[productId].quantity += 1;
            } else {
                cart[productId] = {
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                };
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });

    renderCart(); // Load cart on page load

    // ✅ Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^=\"#\"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ✅ Render Cart in Checkout
function renderCart() {
    const cartItemsContainer = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let total = 0;

    if (!cartItemsContainer || !checkoutTotal) return;

    cartItemsContainer.innerHTML = "";

    Object.values(cart).forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemHTML = `
            <div class=\"checkout-item\" style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\">
                <img src=\"${item.image}\" alt=\"${item.name}\" style=\"width: 50px; height: 50px; object-fit: cover; border-radius: 8px;\">
                <div>
                    <p><strong>${item.name}</strong></p>
                    <p>Qty: ${item.quantity}</p>
                    <p>Price: $${item.price}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += itemHTML;
    });

    checkoutTotal.innerText = `$${total.toFixed(2)}`;
}