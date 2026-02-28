/**
 * Portfolio Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- DOM Elements --- */
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const closeBtn = document.querySelector('.close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-pill-indicator');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.reveal-up');
    const projectCards = document.querySelectorAll('.project-card');

    /* --- Navbar Scroll Effect --- */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    /* --- Active Section Highlighting & Pill Indicator --- */

    // Update pill position
    const updateNavPill = (activeElement) => {
        if (!activeElement || !navIndicator) return;

        // Only show indicator if an element is active
        if (activeElement) {
            navIndicator.style.opacity = '1';
            const rect = activeElement.getBoundingClientRect();
            const parentRect = activeElement.parentElement.parentElement.getBoundingClientRect();

            navIndicator.style.width = `${rect.width}px`;
            navIndicator.style.left = `${activeElement.parentElement.offsetLeft}px`;
        } else {
            navIndicator.style.opacity = '0';
        }
    };

    const sectionObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        let activeSectionId = '';

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeSectionId = entry.target.id;
            }
        });

        if (activeSectionId) {
            // Update desktop nav
            let currentActiveNav = null;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active');
                    currentActiveNav = link;
                }
            });
            updateNavPill(currentActiveNav);

            // Update mobile nav
            mobileLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Init pill position on load
    setTimeout(() => {
        const activeNav = document.querySelector('.nav-link.active');
        if (activeNav) updateNavPill(activeNav);
    }, 100);

    // Update pill on resize
    window.addEventListener('resize', () => {
        const activeNav = document.querySelector('.nav-link.active');
        if (activeNav) updateNavPill(activeNav);
    });

    // Hover effect on desktop nav
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            updateNavPill(e.target);
        });

        link.parentElement.parentElement.addEventListener('mouseleave', () => {
            const activeNav = document.querySelector('.nav-link.active');
            if (activeNav) updateNavPill(activeNav);
        });
    });


    /* --- Mobile Menu Drawer --- */
    const toggleMenu = () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
            mobileDrawer.classList.remove('open');
            drawerOverlay.classList.remove('open');
            document.body.style.overflow = '';
        } else {
            mobileDrawer.classList.add('open');
            drawerOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    drawerOverlay.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });


    /* --- Scroll Reveal Animations (Intersection Observer) --- */
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* --- Card Hover Glow Effect (Mouse Move) --- */
    // Attaches a radial gradient to the mouse cursor on the cards
    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    projectCards.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
    });

    // Smooth scrolling for anchor links to prevent layout jump with fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 70; // Var nav scroll height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    /* --- Project Carousel Logic --- */
    const projectTrack = document.getElementById('projectTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (projectTrack && prevBtn && nextBtn) {
        // The container holding the overflow is the parent of the flex track
        const scrollContainer = projectTrack.parentNode;

        prevBtn.addEventListener('click', () => {
            // Scroll amount is exactly the width of the container
            const scrollAmount = scrollContainer.clientWidth;
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const scrollAmount = scrollContainer.clientWidth;
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    /* --- Dynamic Sticky Image Observer --- */
    const dynamicImage = document.getElementById('dynamicImage');
    const carouselContainer = document.querySelector('.carousel-container'); // Need this for horizontal observer root

    const imageMap = {
        'hero': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop', // Placeholder for User Portrait
        'project1': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop', // Placeholder for Project 1
        'project2': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop', // Placeholder for Project 2
        'project3': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', // Placeholder for Project 3
        'project4': 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=800&auto=format&fit=crop', // Placeholder for Project 4
        'project5': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'  // Placeholder for Project 5
    };

    // We need TWO observers now:
    // 1. One for the Hero section (Vertical scrolling)
    // 2. One for the Project Cards inside the carousel (Horizontal scrolling)

    let currentImageKey = '';

    const swapImage = (newKey) => {
        if (newKey && newKey !== currentImageKey && dynamicImage) {
            currentImageKey = newKey;

            dynamicImage.classList.remove('fade-in');
            dynamicImage.classList.add('fade-out');

            setTimeout(() => {
                dynamicImage.src = imageMap[newKey] || imageMap['hero'];
                dynamicImage.onload = () => {
                    dynamicImage.classList.remove('fade-out');
                    dynamicImage.classList.add('fade-in');
                };
            }, 400);
        }
    };

    // Observer 1: Vertical Observer to handle Hero / Projects overall layout sections
    const verticalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If we enter the projects section, grab the FIRST project Card's image key
                if (entry.target.id === 'projects') {
                    const firstProject = document.querySelector('.project-card[data-image]');
                    if (firstProject) {
                        swapImage(firstProject.getAttribute('data-image'));
                    }
                } else {
                    // Otherwise just use the data-image on the section itself (e.g. hero)
                    swapImage(entry.target.getAttribute('data-image'));
                }
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    const heroSection = document.getElementById('hero');
    const projectsSection = document.getElementById('projects');
    if (heroSection) verticalObserver.observe(heroSection);
    if (projectsSection) verticalObserver.observe(projectsSection);


    // Observer 2: Horizontal Observer for Project Carousel
    const horizontalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // To ensure it only swaps when we are ACTUALLY looking at the projects section
                // we can check if the carousel container itself is somewhat in the vertical viewport
                const containerRect = carouselContainer.getBoundingClientRect();
                const isContainerVisible = (containerRect.top < window.innerHeight && containerRect.bottom > 0);

                if (isContainerVisible) {
                    swapImage(entry.target.getAttribute('data-image'));
                }
            }
        });
    }, {
        root: carouselContainer, // Observe relative to the scrolling carousel container
        rootMargin: '0px -40% 0px -40%', // Trigger when card hits horizontal middle
        threshold: 0
    });

    const projectCardsObserver = document.querySelectorAll('.project-card[data-image]');
    projectCardsObserver.forEach(trigger => {
        horizontalObserver.observe(trigger);
    });

});
