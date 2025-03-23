// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Add scroll effect for header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  }
});

// Button hover effect
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('mouseenter', () => {
  ctaButton.style.transform = 'translateY(-3px)';
});

ctaButton.addEventListener('mouseleave', () => {
  ctaButton.style.transform = 'translateY(0)';
});

// Page load animations
document.addEventListener('DOMContentLoaded', () => {
  const heroElements = document.querySelectorAll('.hero h2, .hero p, .cta-button');
  heroElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 1s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 300 * index);
  });
});
