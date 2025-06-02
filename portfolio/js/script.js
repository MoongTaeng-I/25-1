document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션 바 숨김/보임 처리
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            navbar.style.top = `-${navbar.offsetHeight}px`; // 스크롤 내릴 때 숨김
        } else {
            navbar.style.top = '0'; // 스크롤 올릴 때 보임
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // Particles.js 초기화 (Hero 섹션 배경)
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#00aeff" }, // var(--primary-color)
                "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
                "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
                "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#00aeff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
            },
            "retina_detect": true
        });
    }

    // 스크롤 시 섹션 나타나는 효과
    const sections = document.querySelectorAll('section');
    const toolLogos = document.querySelectorAll('.tool-logo-item');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'tools') { // Tools 섹션일 경우 로고 애니메이션
                    toolLogos.forEach((logo, index) => {
                        setTimeout(() => {
                            logo.classList.add('revealed');
                        }, index * 100); // 순차적으로 나타나도록 딜레이
                    });
                }
                observer.unobserve(entry.target); // 한번 나타나면 관찰 중지
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15, // 섹션의 15%가 보일 때
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // 네비게이션 활성 상태 업데이트
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

        // Hero 섹션 특별 처리
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
    updateActiveNav(); // 초기 로드 시 실행


    // Work Modals
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
                document.body.style.overflow = 'hidden'; // 스크롤 방지
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // 스크롤 복구
            }
        });
    });

    // 모달 바깥 클릭 시 닫기
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // PDF 임베드 Modal (선택 사항)
    // const embedPdfButtons = document.querySelectorAll('.embed-pdf');
    // const pdfModal = document.getElementById('pdf-modal');
    // const pdfIframe = document.getElementById('pdf-iframe');
    // const pdfCloseButton = document.querySelector('.pdf-close-button');

    // if (embedPdfButtons.length && pdfModal && pdfIframe && pdfCloseButton) {
    //     embedPdfButtons.forEach(button => {
    //         button.addEventListener('click', () => {
    //             const pdfSrc = button.getAttribute('data-pdf-src');
    //             pdfIframe.setAttribute('src', pdfSrc);
    //             pdfModal.style.display = 'block';
    //             document.body.style.overflow = 'hidden';
    //         });
    //     });

    //     pdfCloseButton.addEventListener('click', () => {
    //         pdfModal.style.display = 'none';
    //         pdfIframe.setAttribute('src', ''); // PDF 로드 해제
    //         document.body.style.overflow = 'auto';
    //     });

    //     window.addEventListener('click', (e) => {
    //         if (e.target === pdfModal) {
    //             pdfModal.style.display = 'none';
    //             pdfIframe.setAttribute('src', '');
    //             document.body.style.overflow = 'auto';
    //         }
    //     });
    // }


    // Footer 현재 연도 업데이트
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 커서 따라다니는 빛 효과
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
        document.addEventListener('mouseleave', () => {
             cursorGlow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
             cursorGlow.style.opacity = '0.5'; // body:hover #cursor-glow 에서 제어하므로 필요없을 수도 있음
        });
    }
});
