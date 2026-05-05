
document.addEventListener('DOMContentLoaded', function() {

    initMobileMenu();
    initActiveLinks();
    initSmoothScroll();
    initFormSubmit();
    initGalleryClick();
    initProjectHighlight();
    initScrollAnimation();
});


function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

  
    if (!menuToggle || !sidebar || !overlay) return;

    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');

        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });

   
    overlay.addEventListener('click', closeMenu);

  
    document.querySelectorAll('.sidebar-nav a, .sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                closeMenu();
             
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });

  
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            closeMenu();
        }
    });

   
    function closeMenu() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}


function initActiveLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a, .sidebar-nav a');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href')?.substring(1) || '';
            if (href === current) {
                link.classList.add('active');
            }
        });
    });
}


function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            
            if (this.closest('.sidebar-nav') || this.closest('.sidebar-menu')) return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


function initFormSubmit() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Initialize EmailJS with  Public Key
    emailjs.init("DUwmiJpmJtMzotf2i");   

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button');
        const originalBtnText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        const name = document.getElementById('name').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !contact || !email || !message) {
            alert('Please fill in all fields.');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        // Send email using EmailJS
        emailjs.send("service_ywqwpio", "template_yor8rbg", {
            from_name: name,
            from_email: email,
            contact_number: contact,
            message: message,
            to_email: "dineshtharusha@gmail.com"   // Your email
        })
        .then(() => {
            alert(`✅ Thank you, ${name}!\n\nYour message has been sent successfully. I will reply soon!`);
            form.reset();
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            alert('Failed to send message. Please check your internet connection and try again.');
        })
        .finally(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}


function initGalleryClick() {
    const galleryImages = document.querySelectorAll('.gallery-item img, #gallery img');
    if (!galleryImages.length) return;

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                cursor: pointer;
                backdrop-filter: blur(5px);
            `;

            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
                border: 3px solid var(--primary-color, #3b82f6);
            `;

            modal.appendChild(modalImg);
            document.body.appendChild(modal);

           
            modal.addEventListener('click', () => modal.remove());

            
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    });
}


function initProjectHighlight() {
    const cards = document.querySelectorAll('.project-card, .assignment-card, #projects article');
    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            
            cards.forEach(c => c.classList.remove('highlighted'));
           
            this.classList.add('highlighted');
            updateHighlightIndicator(this);
        });

        
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.project-card') && !e.target.closest('.assignment-card') && !e.target.closest('#projects article')) {
            cards.forEach(c => c.classList.remove('highlighted'));
            removeHighlightIndicator();
        }
    });

    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cards.forEach(c => c.classList.remove('highlighted'));
            removeHighlightIndicator();
        }
    });

  
    function updateHighlightIndicator(element) {
        removeHighlightIndicator();
        const itemName = element.querySelector('h3, h4')?.textContent || 'Item';
        const indicator = document.createElement('div');
        indicator.className = 'highlight-indicator';
        indicator.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span class="highlight-text">Selected: ${itemName}</span>
            <span class="clear-highlight"><i class="fas fa-times"></i></span>
        `;
        document.body.appendChild(indicator);

        
        indicator.querySelector('.clear-highlight').addEventListener('click', function(e) {
            e.stopPropagation();
            cards.forEach(c => c.classList.remove('highlighted'));
            removeHighlightIndicator();
        });
    }

    function removeHighlightIndicator() {
        const existing = document.querySelector('.highlight-indicator');
        if (existing) existing.remove();
    }
}


function initScrollAnimation() {
    const elements = document.querySelectorAll(
        'section, .project-card, .skill-card, .assignment-card, .gallery-item, .contact-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}