// Modal functionality
function showSubmitForm() {
    document.getElementById('submitModal').style.display = 'block';
}

function closeSubmitForm() {
    document.getElementById('submitModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('submitModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Form submission
document.getElementById('submitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Simulate submission
    alert('Thank you for your submission! We\'ll review it soon.');
    console.log('Submission data:', data);
    
    // Close modal and reset form
    closeSubmitForm();
    this.reset();
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Radio player functionality (placeholder)
document.querySelector('.play-button').addEventListener('click', function() {
    if (this.textContent === '▶') {
        this.textContent = '⏸';
        console.log('Radio started playing...');
    } else {
        this.textContent = '▶';
        console.log('Radio paused...');
    }
});

// Dynamic content loading (placeholder)
function loadContent() {
    // This would connect to your backend API
    console.log('Loading dynamic content...');
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.background = '#fff';
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enamorado Editorial Platform - Wireframe Ready');
    loadContent();
});