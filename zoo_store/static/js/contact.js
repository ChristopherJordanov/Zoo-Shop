document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");

    contactForm.addEventListener("submit", function () {
        // Let the form submit normally to Django (no preventDefault)

        // Reset error messages
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach(error => {
            error.style.display = "none";
        });

        // Basic client-side validation (optional)
        let isValid = true;

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();
        const privacy = document.getElementById("privacy").checked;

        if (name === "") {
            showError("nameError", "Please enter your name.");
            isValid = false;
        }

        if (email === "" || !email.includes("@")) {
            showError("emailError", "Please enter a valid email address.");
            isValid = false;
        }

        if (subject === "") {
            showError("subjectError", "Please enter a subject.");
            isValid = false;
        }

        if (message === "") {
            showError("messageError", "Please enter your message.");
            isValid = false;
        }

        if (!privacy) {
            showError("privacyError", "You must agree to the privacy policy.");
            isValid = false;
        }

        if (!isValid) {
            // Prevent submission if validation fails
            event.preventDefault();
        }
    });

    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
});
