document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.style.display = 'none';
            });
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const privacy = document.getElementById('privacy').checked;
            
            // Validate form
            let isValid = true;
            
            if (name === '') {
                document.getElementById('nameError').textContent = 'Please enter your name';
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            }
            
            if (email === '') {
                document.getElementById('emailError').textContent = 'Please enter your email address';
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            } else if (!isValidEmail(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address';
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            
            if (subject === '') {
                document.getElementById('subjectError').textContent = 'Please enter a subject';
                document.getElementById('subjectError').style.display = 'block';
                isValid = false;
            }
            
            if (message === '') {
                document.getElementById('messageError').textContent = 'Please enter your message';
                document.getElementById('messageError').style.display = 'block';
                isValid = false;
            }
            
            if (!privacy) {
                document.getElementById('privacyError').textContent = 'You must agree to the Privacy Policy';
                document.getElementById('privacyError').style.display = 'block';
                isValid = false;
            }
            
            // If form is valid, submit it
            if (isValid) {
                // In a real application, you would send the form data to a server here
                // For this example, we'll just simulate a successful submission
                
                // Show loading state
                const submitButton = contactForm.querySelector('.submit-button');
                const buttonText = submitButton.querySelector('.button-text');
                const originalText = buttonText.textContent;
                
                buttonText.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate form submission with a delay
                setTimeout(function() {
                    // Hide form and show success message
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button state
                    buttonText.textContent = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Login Modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    if (loginBtn && loginModal && closeLoginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeLoginModal.addEventListener('click', function() {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Login Tabs
        const loginTabs = document.querySelectorAll('.login-tab');
        const loginForms = document.querySelectorAll('.login-form');
        
        loginTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and forms
                loginTabs.forEach(t => t.classList.remove('active'));
                loginForms.forEach(f => f.classList.remove('active'));
                
                // Add active class to current tab and form
                this.classList.add('active');
                document.getElementById(tabId + 'Form').classList.add('active');
            });
        });
    }
    
    // Cart Modal
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    if (cartIcon && cartModal && closeCart) {
        cartIcon.addEventListener('click', function() {
            cartModal.classList.add('active');
        });
        
        closeCart.addEventListener('click', function() {
            cartModal.classList.remove('active');
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});