document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const cartIcon = document.getElementById("cartIcon");
    const cartModal = document.getElementById("cartModal");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
    
    // Cart functionality (keeping basic UI interactions)
    if (cartIcon && cartModal && cartOverlay && closeCart) {
        cartIcon.addEventListener("click", () => {
            cartModal.classList.add("active");
            cartOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
        
        function closeCartModal() {
            cartModal.classList.remove("active");
            cartOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
        
        closeCart.addEventListener("click", closeCartModal);
        cartOverlay.addEventListener("click", closeCartModal);
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileMenuBtn.classList.toggle("active");
        });
    }
    
    // Show toast notification (utility function)
    window.showToast = function(message, type = "success") {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");
        
        if (!toast) {
            // Create toast if it doesn't exist
            const newToast = document.createElement("div");
            newToast.className = `toast ${type === "error" ? "toast-error" : ""}`;
            newToast.id = "toast";
            newToast.innerHTML = `
                <i class="${type === "error" ? "fas fa-exclamation-circle" : "fas fa-check-circle"}"></i>
                <span id="toastMessage">${message}</span>
            `;
            document.body.appendChild(newToast);
            
            setTimeout(() => {
                newToast.classList.add("show");
            }, 10);
            
            setTimeout(() => {
                newToast.classList.remove("show");
                setTimeout(() => {
                    document.body.removeChild(newToast);
                }, 300);
            }, 3000);
            return;
        }
        
        // Update existing toast
        toast.className = `toast ${type === "error" ? "toast-error" : ""}`;
        toast.innerHTML = `
            <i class="${type === "error" ? "fas fa-exclamation-circle" : "fas fa-check-circle"}"></i>
            <span id="toastMessage">${message}</span>
        `;
        
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
});