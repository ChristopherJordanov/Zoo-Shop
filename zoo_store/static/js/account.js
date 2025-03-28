document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const accountNavItems = document.querySelectorAll(".account-nav-item");
    const accountTabs = document.querySelectorAll(".account-tab");
    const logoutButton = document.getElementById("logoutButton");
    const profileForm = document.getElementById("profileForm");
    const passwordForm = document.getElementById("passwordForm");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");
    const profileAddress = document.getElementById("profileAddress");
    const ordersList = document.getElementById("ordersList");

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        // Redirect to home page if not logged in
        window.location.href = "index.html";
        return;
    }

    // Populate user info
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    profileName.value = currentUser.name;
    profileEmail.value = currentUser.email;
    profilePhone.value = currentUser.phone || "";
    profileAddress.value = currentUser.address || "";

    // Tab navigation
    accountNavItems.forEach(item => {
        if (item.id !== "logoutButton") {
            item.addEventListener("click", () => {
                const tabName = item.getAttribute("data-tab");
                
                // Update active tab
                accountNavItems.forEach(navItem => {
                    if (navItem.id !== "logoutButton") {
                        navItem.classList.remove("active");
                    }
                });
                item.classList.add("active");
                
                // Show corresponding tab
                accountTabs.forEach(tab => tab.classList.remove("active"));
                document.getElementById(`${tabName}Tab`).classList.add("active");
            });
        }
    });

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });

    // Update profile
    profileForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = profileName.value;
        const phone = profilePhone.value;
        const address = profileAddress.value;
        
        // Update current user
        currentUser.name = name;
        currentUser.phone = phone;
        currentUser.address = address;
        
        // Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem("users", JSON.stringify(users));
        }
        
        // Update display
        userName.textContent = name;
        
        // Show success message
        showToast("Profile updated successfully!");
    });

    // Change password
    passwordForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;
        
        // Validate current password
        if (currentPassword !== currentUser.password) {
            showToast("Current password is incorrect", "error");
            return;
        }
        
        // Validate new passwords match
        if (newPassword !== confirmNewPassword) {
            showToast("New passwords do not match", "error");
            return;
        }
        
        // Update password
        currentUser.password = newPassword;
        
        // Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
        }
        
        // Reset form
        passwordForm.reset();
        
        // Show success message
        showToast("Password changed successfully!");
    });

    // Delete account
    deleteAccountBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            // Remove user from users array
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const updatedUsers = users.filter(u => u.id !== currentUser.id);
            
            // Save updated users array
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            
            // Remove current user
            localStorage.removeItem("currentUser");
            
            // Redirect to home page
            window.location.href = "index.html";
        }
    });

    // Display orders
    function displayOrders() {
        if (!currentUser.orders || currentUser.orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <p>You haven't placed any orders yet</p>
                    <a href="index.html#products" class="shop-now-btn">Shop Now</a>
                </div>
            `;
            return;
        }
        
        let ordersHTML = "";
        
        // Sort orders by date (newest first)
        const sortedOrders = [...currentUser.orders].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        sortedOrders.forEach(order => {
            const orderDate = new Date(order.date).toLocaleDateString();
            
            let orderItemsHTML = "";
            let itemsCount = 0;
            
            Object.entries(order.items).forEach(([itemName, item]) => {
                itemsCount += item.quantity;
                orderItemsHTML += `
                    <div class="order-item">
                        <span class="order-item-name">${itemName}</span>
                        <span class="order-item-quantity">x${item.quantity}</span>
                        <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });
            
            ordersHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">Order #${order.id.slice(-8)}</span>
                        <span class="order-date">${orderDate}</span>
                    </div>
                    <div class="order-items">
                        ${orderItemsHTML}
                    </div>
                    <div class="order-total">
                        <span class="order-total-label">Total (${itemsCount} items):</span>
                        <span class="order-total-amount">$${order.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        ordersList.innerHTML = ordersHTML;
    }
    
    // Call displayOrders on page load
    displayOrders();

    // Show toast notification
    function showToast(message, type = "success") {
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