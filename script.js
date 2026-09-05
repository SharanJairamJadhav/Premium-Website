document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       LOADING SCREEN
       ========================================= */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 1200);
    });

    /* =========================================
       STICKY NAVIGATION & MOBILE HAMBURGER
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Active navigation highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* =========================================
       ANIMATED STATISTICS COUNTER (About Section)
       ========================================= */
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            let count = 0;
            const speed = target / 50; // animation speed step

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    stat.innerText = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    /* =========================================
       SKILL PROGRESS BAR ANIMATION
       ========================================= */
    const progressFills = document.querySelectorAll('.progress-fill');
    let skillsAnimated = false;

    const animateSkills = () => {
        progressFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = `${width}%`;
        });
    };

    /* =========================================
       INTERSECTION OBSERVER FOR STATS & SKILLS
       ========================================= */
    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');

    const observerOptions = {
        threshold: 0.3
    };

    const aboutObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                startCounters();
                counted = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (aboutSection) aboutObserver.observe(aboutSection);

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                animateSkills();
                skillsAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (skillsSection) skillsObserver.observe(skillsSection);

    /* =========================================
       PROJECT FILTERING SYSTEM
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* =========================================
       PROJECT PREVIEW MODAL
       ========================================= */
    const modalOverlay = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    
    const modalImgText = document.getElementById('modalImgText');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTech = document.getElementById('modalTech');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const tech = card.getAttribute('data-tech');
            const category = card.getAttribute('data-category');

            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            modalTech.innerText = tech;
            modalCategory.innerText = category;
            modalImgText.innerText = title;

            modalOverlay.classList.add('active');
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    /* =========================================
       TESTIMONIAL SLIDER
       ========================================= */
    const testimonialTrack = document.getElementById('testimonialTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.getElementById('sliderDots');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create pagination dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const updateSlider = () => {
        testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateSlider();
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    // Auto-advance testimonial slider every 6 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }, 6000);

    /* =========================================
       CONTACT FORM VALIDATION
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        // Simple validation logic
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            const formGroup = input.parentElement;
            if (!input.value.trim()) {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.remove('error');
            }
        });

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            contactForm.reset();
            formSuccess.style.display = 'block';
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });

    /* =========================================
       BACK TO TOP BUTTON
       ========================================= */
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});