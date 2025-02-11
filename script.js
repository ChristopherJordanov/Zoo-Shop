document.getElementById("learnMoreBtn").addEventListener("click", function() {
    document.getElementById("about").scrollIntoView({ behavior: 'smooth' });
});

const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.1)';
        item.style.transition = 'transform 0.3s ease-in-out';
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

const buttons = document.querySelectorAll('.nav-buttons button');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.transition = 'transform 0.3s ease';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    const colors = ['#ffcccb', '#e6e6fa', '#add8e6', '#98fb98', '#f5f5dc'];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
});