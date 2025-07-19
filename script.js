// JavaScript for Rithanyaa Store

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hero slideshow functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const slideContent = [
        {
            title: "Premium Silk Collections",
            description: "Discover our exquisite range of traditional and contemporary silk sarees",
            buttonText: "Shop Now"
        },
        {
            title: "Handwoven Chettinad Silks",
            description: "Authentic craftsmanship from the heart of Tamil Nadu",
            buttonText: "Explore Collection"
        },
        {
            title: "Luxury Soft Sico",
            description: "Experience the finest silk with modern designs",
            buttonText: "View Collection"
        }
    ];

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) {
            slides[index].classList.add('active');
            updateSlideContent(index);
        }
    }

    function updateSlideContent(index) {
        const slideContentElement = document.querySelector('.slide-content');
        if (slideContentElement && slideContent[index]) {
            slideContentElement.innerHTML = `
                <h2>${slideContent[index].title}</h2>
                <p>${slideContent[index].description}</p>
                <button class="cta-button">${slideContent[index].buttonText}</button>
            `;
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideContent.length;
        showSlide(currentSlide);
    }

    // Auto-advance slideshow every 5 seconds
    setInterval(nextSlide, 5000);

    // Add to cart functionality with confetti effect
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Adding...';
            this.disabled = true;

            // Simulate adding to cart
            setTimeout(() => {
                this.textContent = 'Added!';
                this.style.backgroundColor = '#28a745';
                
                // Create confetti effect
                createConfetti(this);

                // Reset button after 2 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                    this.disabled = false;
                }, 2000);
            }, 500);
        });
    });

    // Confetti animation function
    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            createConfettiPiece(centerX, centerY);
        }
    }

    function createConfettiPiece(x, y) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);

        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100;
        const gravity = 500;
        
        let startTime = Date.now();
        function animateConfetti() {
            const elapsed = (Date.now() - startTime) / 1000;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity + gravity * elapsed;
            
            confetti.style.left = (x + vx * elapsed) + 'px';
            confetti.style.top = (y + vy * elapsed) + 'px';
            confetti.style.opacity = Math.max(0, 1 - elapsed * 2);
            
            if (elapsed < 1) {
                requestAnimationFrame(animateConfetti);
            } else {
                document.body.removeChild(confetti);
            }
        }
        
        requestAnimationFrame(animateConfetti);
    }

    function getRandomColor() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', function() {
        const searchTerm = prompt('Search for products:');
        if (searchTerm) {
            // Simulate search functionality
            alert(`Searching for: ${searchTerm}`);
        }
    });

    // Cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    let cartCount = 0;
    
    cartIcon.addEventListener('click', function() {
        alert(`Cart items: ${cartCount}`);
    });

    // Update cart count when items are added
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                cartCount++;
                // You could update a cart badge here
            }, 500);
        });
    });

    // Collection explore buttons
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const collectionItem = this.closest('.collection-item');
            const collectionName = collectionItem.querySelector('h3').textContent;
            alert(`Exploring ${collectionName} collection`);
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation to elements
    const animatedElements = document.querySelectorAll('.product-card, .collection-item, .feature-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle (if needed)
    function toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('mobile-active');
    }

    // Add mobile menu styles if screen is small
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            .nav-menu.mobile-active {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize slideshow
    showSlide(0);
    
    console.log('Rithanyaa Store website loaded successfully!');
});