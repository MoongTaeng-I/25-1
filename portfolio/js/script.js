document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            navbar.style.top = `-${navbar.offsetHeight}px`;
        } else {
            navbar.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (document.getElementById('particles-js')) {
        const particleColor = getComputedStyle(document.documentElement)
                              .getPropertyValue('--hero-particle-color').trim() || '#0098D9'; // 현재 파티클 색상 (style.css에서 --primary-accent-color인 #0098D9로 설정됨)

        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 70, // 파티클 개수 증가 (기존 60)
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": particleColor }, // 이 색상을 더 어둡게 하려면 style.css에서 --hero-particle-color 값을 var(--font-color) 등으로 변경 가능
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" }
                },
                "opacity": {
                    "value": 0.6, // 파티클 투명도 증가 (기존 0.4) -> 더 진하게 보임
                    "random": true,
                    "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3.5, // 파티클 크기 증가 (기존 2.5)
                    "random": true,
                    "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150, // 연결선 거리 유지 또는 약간 증가
                    "color": particleColor,
                    "opacity": 0.5, // 연결선 투명도 증가 (기존 0.3) -> 더 진하게 보임
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2, // 속도는 취향에 따라 조절 (기존 2.5)
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false, "mode": "push" }, "resize": true },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } }, // grab 시 연결선 투명도 증가
                    "bubble": {}, "repulse": {}, "push": {}, "remove": {}
                }
            },
            "retina_detect": true
        });
    }

    const sections = document.querySelectorAll('section');
    const toolLogos = document.querySelectorAll('.tool-logo-item');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'tools') {
                    toolLogos.forEach((logo, index) => {
                        setTimeout(() => {
                            logo.classList.add('revealed');
                        }, index * 100);
                    });
                }
            }
        });
    };
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1,
    });
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const navLinks = document.querySelectorAll('#navbar ul li a');
    const updateActiveNav = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - navbar.offsetHeight - 50 && pageYOffset < sectionTop + sectionHeight - navbar.offsetHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.clientHeight;
             if (pageYOffset < heroBottom - navbar.offsetHeight - 50) {
                currentSectionId = 'hero';
            }
        }
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    const modalButtons = document.querySelectorAll('.work-item-details-button');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');
    modalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const cursorGlow = document.getElementById('cursor-glow');
    // window.matchMedia와 해당 matches 속성이 존재하는지 안전하게 확인
    const hasFinePointer = window.matchMedia && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;

    if (cursorGlow && hasFinePointer) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
        document.body.addEventListener('mouseleave', () => {
            if(cursorGlow) cursorGlow.style.opacity = '0';
        });
        document.body.addEventListener('mouseenter', () => {
            if(cursorGlow) cursorGlow.style.opacity = '1';
        });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }
});