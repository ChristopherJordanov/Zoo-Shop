document.addEventListener("DOMContentLoaded", function() {
    // Tab switching with animation
    const tabs = document.querySelectorAll('.login-tab');
    const forms = document.querySelectorAll('.login-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Skip if this tab is already active
            if (tab.classList.contains('active')) {
                return;
            }
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to current tab
            tab.classList.add('active');
            
            // Handle form transitions
            forms.forEach(form => {
                if (form.id === tabId + 'Form') {
                    // Show the selected form with animation
                    form.classList.add('active');
                } else {
                    // Hide other forms
                    form.classList.remove('active');
                }
            });
        });
    });
    
    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});