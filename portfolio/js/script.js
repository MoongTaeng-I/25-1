document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    // Navigation Bar Scroll Effect
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (navbar) { // Ensure navbar exists
            if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
                navbar.style.top = `-${navbar.offsetHeight}px`;
            } else {
                navbar.style.top = '0';
            }
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Particles.js Initialization
    if (document.getElementById('particles-js')) {
        const particleColor = getComputedStyle(document.documentElement)
                              .getPropertyValue('--hero-particle-color').trim() || '#0098D9';
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 70, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": particleColor },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true },
                "size": { "value": 3.5, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": particleColor, "opacity": 0.5, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } } }
            },
            "retina_detect": true
        });
    }

    // Section Scroll Reveal
    const sections = document.querySelectorAll('section.section-padding'); // Target sections with specific class for reveal
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Uncomment if you want the animation only once
            } else {
                // entry.target.classList.remove('visible'); // Uncomment to re-animate when scrolling back up
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => sectionObserver.observe(section));

    // Active Navigation Link
    const navLinks = document.querySelectorAll('#navbar ul li a');
    const updateActiveNav = () => {
        let currentSectionId = '';
        const heroSection = document.getElementById('hero');
        const navHeight = navbar ? navbar.offsetHeight : 70; // Fallback nav height

        if (heroSection && pageYOffset < heroSection.offsetTop + heroSection.clientHeight - navHeight - 50) {
            currentSectionId = 'hero';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - navHeight - 50) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // Skills & Tools Carousel
    const toolCarouselTrack = document.querySelector('.tool-logos-track');
    if (toolCarouselTrack) {
        const logos = Array.from(toolCarouselTrack.children);
        // Duplicate logos for seamless loop
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            toolCarouselTrack.appendChild(clone);
        });

        // Set spacing (margin-right) for each logo item
        const logoWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--logo-width')) || 70;
        const logoSpacing = logoWidth * 1.5;
        toolCarouselTrack.querySelectorAll('.tool-logo-item').forEach(item => {
            item.style.marginRight = `${logoSpacing}px`;
        });
        
        const totalWidthOfOriginalLogos = logos.reduce((acc, logo) => {
            return acc + logo.offsetWidth + logoSpacing;
        }, 0);

        toolCarouselTrack.style.width = `${totalWidthOfOriginalLogos * 2}px`; // Track width for original + cloned

        // Animation
        const animationDuration = logos.length * 5; // Adjust speed: higher number = slower (e.g., 5 seconds per logo)
        toolCarouselTrack.style.animation = `scrollLogos ${animationDuration}s linear infinite`;

        // Create @keyframes rule dynamically if not in CSS (or ensure it's in CSS)
        if (!document.styleSheets[0].cssRules || ![...document.styleSheets[0].cssRules].some(rule => rule.name === 'scrollLogos')) {
            const styleSheet = document.styleSheets[0]; // Assumes style.css is the first stylesheet
            try {
                 styleSheet.insertRule(`
                    @keyframes scrollLogos {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-${totalWidthOfOriginalLogos}px); }
                    }
                `, styleSheet.cssRules.length);
            } catch (e) {
                console.warn("Could not insert scrollLogos keyframes dynamically. Ensure it's in CSS.", e);
                // Fallback or ensure it's in style.css:
                // @keyframes scrollLogos {
                //   0% { transform: translateX(0); }
                //   100% { transform: translateX(-50%); } /* If track width is 2x total content width */
                // }
                // If using translateX(-50%), then toolCarouselTrack.style.width must be totalWidthOfOriginalLogos * 2
            }
        }
         // Optional: Pause animation on hover
        toolCarouselTrack.addEventListener('mouseenter', () => {
            toolCarouselTrack.style.animationPlayState = 'paused';
        });
        toolCarouselTrack.addEventListener('mouseleave', () => {
            toolCarouselTrack.style.animationPlayState = 'running';
        });
    }


    // Work Experience Tabs
    const tabButtons = document.querySelectorAll('.work-tab-button');
    const workItems = document.querySelectorAll('.work-item');

    if (tabButtons.length > 0 && workItems.length > 0) {
        // Function to filter work items
        const filterWorkItems = (category) => {
            workItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden-item');
                    // Staggered animation for items appearing
                    // item.style.animationDelay = `${index * 0.05}s`; // Only if CSS animation is complex
                    item.style.display = ''; // Or 'grid', 'flex' if it's part of such layout
                } else {
                    item.classList.add('hidden-item');
                    item.style.display = 'none';
                }
            });
        };

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.getAttribute('data-category');
                filterWorkItems(category);
            });
        });

        // Initial filter (show items of the initially active tab)
        const activeTab = document.querySelector('.work-tab-button.active');
        if (activeTab) {
            filterWorkItems(activeTab.getAttribute('data-category'));
        } else {
            filterWorkItems('activity'); // Default if no active tab set
        }
    }


    // Modal Functionality
    const modalTriggerButtons = document.querySelectorAll('.work-item-details-button');
    const allModals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-button');

    modalTriggerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    window.addEventListener('click', (e) => { // Close modal if clicked outside content
        allModals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Footer Current Year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    const hasFinePointer = window.matchMedia && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
    if (cursorGlow && hasFinePointer) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
        document.body.addEventListener('mouseleave', () => { if (cursorGlow) cursorGlow.style.opacity = '0'; });
        document.body.addEventListener('mouseenter', () => { if (cursorGlow) cursorGlow.style.opacity = '1'; });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none'; // Hide on touch devices or if matchMedia not supported
    }
});