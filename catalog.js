// Catalog page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 100);
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });

    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Create modal or show product details
            alert(`Quick View: ${productName}\nPrice: ${productPrice}`);
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isAdded = this.textContent === '♥';
            this.textContent = isAdded ? '♡' : '♥';
            this.style.color = isAdded ? 'white' : '#ff6b6b';
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            if (!isAdded) {
                // Add to wishlist
                console.log(`Added ${productName} to wishlist`);
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            } else {
                // Remove from wishlist
                console.log(`Removed ${productName} from wishlist`);
            }
        });
    });

    // Add to cart functionality with animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Loading state
            this.textContent = 'Adding...';
            this.disabled = true;
            this.style.opacity = '0.7';

            // Simulate adding to cart
            setTimeout(() => {
                this.textContent = 'Added!';
                this.style.backgroundColor = '#28a745';
                this.style.transform = 'scale(1.05)';
                
                // Create confetti effect
                createConfetti(this);
                
                console.log(`Added ${productName} to cart`);

                // Reset button after 2 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                    this.style.transform = 'scale(1)';
                    this.style.opacity = '1';
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

        for (let i = 0; i < 15; i++) {
            createConfettiPiece(centerX, centerY);
        }
    }

    function createConfettiPiece(x, y) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);

        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 150 + 50;
        const gravity = 300;
        
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
            filterProductsBySearch(searchTerm);
        }
    });

    function filterProductsBySearch(searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (productName.includes(searchLower) || productDescription.includes(searchLower)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                // Highlight matching text
                card.style.border = '2px solid #FFD700';
            } else {
                card.style.opacity = '0.3';
                card.style.border = 'none';
            }
        });

        // Reset filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
    }

    // Initialize animations
    const animatedElements = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    console.log('Catalog page loaded successfully!');
});