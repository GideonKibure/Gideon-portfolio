// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const currentYear = document.getElementById('currentYear');
const skillBars = document.querySelectorAll('.skill-level');
const statNumbers = document.querySelectorAll('.stat-number');
const networkCanvas = document.getElementById('networkCanvas');

// Initialize current year
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    // Add scrolled class to navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Animated Counter for Stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate Skill Bars
function animateSkillBar(bar) {
    const level = bar.getAttribute('data-level');
    bar.style.width = `${level}%`;
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate skill bars
            if (entry.target.classList.contains('skill-item')) {
                const skillBar = entry.target.querySelector('.skill-level');
                if (skillBar && !skillBar.classList.contains('animated')) {
                    skillBar.classList.add('animated');
                    animateSkillBar(skillBar);
                }
            }
            
            // Animate stats
            if (entry.target.classList.contains('stat-card')) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber);
                }
            }
            
            // Add AOS animation class
            if (entry.target.hasAttribute('data-aos')) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('[data-aos], .skill-item, .stat-card').forEach(element => {
    observer.observe(element);
});

// Network Background Animation
function initNetworkBackground() {
    if (!networkCanvas) return;
    
    const ctx = networkCanvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let connections = [];
    let mouse = { x: width / 2, y: height / 2 };
    let mouseMoved = false;
    
    // Set canvas size
    networkCanvas.width = width;
    networkCanvas.height = height;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouseMoved = true;
    });
    
    document.addEventListener('mouseleave', () => {
        mouseMoved = false;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(56, 189, 248, ${Math.random() * 0.7 + 0.3})`;
            this.originalColor = this.color;
            this.glowIntensity = 0;
        }
        
        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off walls with faster response
            if (this.x > width) {
                this.speedX = -Math.abs(this.speedX);
                this.x = width;
            }
            if (this.x < 0) {
                this.speedX = Math.abs(this.speedX);
                this.x = 0;
            }
            if (this.y > height) {
                this.speedY = -Math.abs(this.speedY);
                this.y = height;
            }
            if (this.y < 0) {
                this.speedY = Math.abs(this.speedY);
                this.y = 0;
            }
            
            // Mouse interaction - faster and more responsive
            if (mouseMoved) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    // Repel from mouse with stronger force
                    const angle = Math.atan2(dy, dx);
                    const force = (120 - distance) / 120 * 1.5;
                    
                    this.speedX -= Math.cos(angle) * force * 0.3;
                    this.speedY -= Math.sin(angle) * force * 0.3;
                    
                    // Glow effect
                    this.glowIntensity = Math.max(this.glowIntensity, (120 - distance) / 120);
                    this.color = `rgba(56, 189, 248, ${0.8 + this.glowIntensity * 0.2})`;
                } else {
                    // Faster glow fade
                    this.glowIntensity *= 0.85;
                    const alpha = 0.3 + this.glowIntensity * 0.5;
                    this.color = `rgba(56, 189, 248, ${alpha})`;
                }
            }
            
            // Limit speed for fast movement
            const maxSpeed = 3;
            const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            if (speed > maxSpeed) {
                this.speedX = (this.speedX / speed) * maxSpeed;
                this.speedY = (this.speedY / speed) * maxSpeed;
            }
            
            // Faster slowdown
            this.speedX *= 0.97;
            this.speedY *= 0.97;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            if (this.glowIntensity > 0.1) {
                ctx.shadowBlur = 20 * this.glowIntensity;
                ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    
    // Create more particles for denser network
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    // Draw connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    
                    // Enhanced glow for connections near mouse
                    if (mouseMoved) {
                        const mouseDist1 = Math.sqrt(
                            Math.pow(mouse.x - particles[i].x, 2) + 
                            Math.pow(mouse.y - particles[i].y, 2)
                        );
                        const mouseDist2 = Math.sqrt(
                            Math.pow(mouse.x - particles[j].x, 2) + 
                            Math.pow(mouse.y - particles[j].y, 2)
                        );
                        
                        if (mouseDist1 < 150 || mouseDist2 < 150) {
                            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.4})`;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        // Clear with slight fade for trail effect
        ctx.fillStyle = 'rgba(2, 12, 27, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        networkCanvas.width = width;
        networkCanvas.height = height;
        
        // Reset particles on resize
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    });
}

// Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Create success animation
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for your message! I will get back to you soon.</p>
            `;
            
            contactForm.parentElement.appendChild(successMessage);
            
            // Animate success message
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 10);
            
            // Reset form
            this.reset();
            
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Remove success message
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 3000);
            }, 500);
        }, 2000);
    });
}

// Smooth scrolling for anchor links
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

// Hover effects for interactive elements
document.querySelectorAll('.service-card, .project-card, .stat-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize network background
    initNetworkBackground();
    
    // Add initial animations for elements in viewport
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight - 100) {
                const delay = el.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, 500);
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero .title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        transform: translateX(150%);
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .success-message.show {
        transform: translateX(0);
    }
    
    .success-message i {
        font-size: 2rem;
    }
    
    .success-message p {
        color: white;
        margin: 0;
        font-weight: 500;
    }
    
    .no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(style);