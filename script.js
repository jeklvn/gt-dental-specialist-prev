 const services = [
        {
            image: 'assets/pediatrics.jpg',
            title: 'Pediatric Dentistry',
            feature: 'Kids Care',
            description: 'Gentle, family-friendly dental care for children with preventive exams and healthy smile guidance.'
        },
        {
            image: 'assets/cosmetic-dentistry-1.jpg',
            title: 'Cosmetic Dentistry',
            feature: 'Smile Design',
            description: 'Enhance your smile with whitening, veneers, and aesthetic treatments for a brighter appearance.'
        },
        {
            image: 'assets/oral-surgery.jpg',
            title: 'Oral Surgery',
            feature: 'Surgical Care',
            description: 'Professional surgical treatment for extractions, implants, and advanced oral procedures with comfort.'
        },
        {
            image: 'assets/orthodontics-braces.jpg',
            title: 'Orthodontics',
            feature: 'Braces & Aligners',
            description: 'Align teeth and improve bite with modern braces and clear aligners for lasting oral health.'
        },
        {
            image: 'assets/conservative-dentistry-replacement.jpg',
            title: 'Conservative Dentistry',
            feature: 'Tooth Preservation',
            description: 'Preserve natural teeth with precision fillings, root canal therapy, and minimally invasive care.'
        },
        {
            image: 'assets/restored-1.png',
            title: 'Teeth Restoration/Replacement',
            feature: 'Restoration',
            description: 'Restore damaged or missing teeth with durable, natural-looking crowns, bridges, and implants.'
        },
        {
            image: 'assets/periodontics.jpg',
            title: 'Periodontics',
            feature: 'Gum Health',
            description: 'Advanced gum care and treatment to prevent disease, reduce inflammation, and protect your teeth.'
        },
        {
            image: 'assets/general-dentistry-service-rep.jpg',
            title: 'general-Dentistry',
            feature: 'Routine Care',
            description: 'Comprehensive preventive care, cleanings, and exams to keep your smile healthy and strong.'
        }
    ];

    const sliderContainer = document.querySelector('.service-slider');

    const cardHtml = service => `
            <div class="service-card">
                <img src="${service.image}" alt="${service.title}">
                <div>
                    <h4>${service.title}</h4>
                    <p>${service.description}</p>
                    <a href="contact.html#booking" class="service-btn">Book Service</a>
                </div>
            </div>`;

    function renderServiceGrid() {
        if (!sliderContainer) return;
        sliderContainer.innerHTML = services.map(cardHtml).join('');
    }

    if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderServiceGrid);
} else {
    renderServiceGrid();
}

    const menuToggle = document.querySelector('.menu-toggle');
    const pageHeader = document.querySelector('header');
    const navLinks = document.querySelectorAll('.main-nav .link, .main-nav .dropdown-link');
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    const dropdowns = document.querySelectorAll('.dropdown');

    const closeAllDropdowns = () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
            const trigger = dropdown.querySelector('.dropdown-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    };

    menuToggle?.addEventListener('click', () => {
        pageHeader.classList.toggle('open');
        closeAllDropdowns();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (pageHeader.classList.contains('open')) {
                pageHeader.classList.remove('open');
            }
            closeAllDropdowns();
        });
    });

    dropdownTriggers.forEach(trigger => {
        const dropdown = trigger.closest('.dropdown');
        const menu = dropdown?.querySelector('.dropdown-menu');

        trigger.addEventListener('click', event => {
            event.preventDefault();
            if (!dropdown) return;

            const isMobile = window.matchMedia('(max-width: 880px)').matches;
            const currentlyOpen = dropdown.classList.contains('open');

            if (isMobile) {
                // Accordion-style: close others first, then toggle this one
                closeAllDropdowns();
                if (!currentlyOpen) {
                    dropdown.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                    const firstItem = menu?.querySelector('a');
                    firstItem?.focus();
                } else {
                    dropdown.classList.remove('open');
                    trigger.setAttribute('aria-expanded', 'false');
                }
                return;
            }

            // Desktop: preserve existing toggle behavior
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', String(isOpen));
            if (isOpen && menu) {
                const firstItem = menu.querySelector('a');
                firstItem?.focus();
            }
        });

        trigger.addEventListener('keydown', event => {
            if (!dropdown) return;
            if (event.key === 'Escape') {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }

            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                dropdown.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                const firstItem = dropdown.querySelector('.dropdown-menu a');
                firstItem?.focus();
            }
        });

        dropdown.addEventListener('focusout', event => {
            if (!dropdown.contains(event.relatedTarget)) {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    const accordionButtons = document.querySelectorAll('.accordion-trigger');

    const closeAllAccordions = () => {
        accordionButtons.forEach(button => {
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            button.setAttribute('aria-expanded', 'false');
            if (panel) {
                panel.classList.remove('active');
                panel.style.maxHeight = null;
            }
        });
    };

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isOpen = button.getAttribute('aria-expanded') === 'true';
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            closeAllAccordions();

            if (!isOpen && panel) {
                button.setAttribute('aria-expanded', 'true');
                panel.classList.add('active');
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
        });
    });

    // Handle hash-based accordion navigation and smooth scrolling
    const openAccordionById = (id) => {
        const accordionItem = document.getElementById(id);
        if (!accordionItem) return;

        const button = accordionItem.querySelector('.accordion-trigger');
        const panel = accordionItem.querySelector('.accordion-panel');
        
        if (!button || !panel) return;

        // Close all other accordions
        closeAllAccordions();

        // Open the target accordion
        button.setAttribute('aria-expanded', 'true');
        panel.classList.add('active');
        panel.style.maxHeight = `${panel.scrollHeight}px`;

        // Scroll the accordion into view with smooth behavior
        setTimeout(() => {
            accordionItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // Handle hash changes (when clicking navigation or directly visiting with hash)
    const handleHashNavigation = () => {
        const hash = window.location.hash.substring(1); // Remove the # character
        if (hash) {
            openAccordionById(hash);
        }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    // Handle hash on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleHashNavigation);
    } else {
        handleHashNavigation();
    }

    // Handle forms: API endpoint (Vercel/Node) or external endpoints (Formspree, Getform) or mailto fallback
    const allForms = document.querySelectorAll('form[action^="/api"], form[action="form-handler.php"], form[data-endpoint], form[data-email-recipient]');

    const humanize = key => key.replace(/[-_]/g, ' ').replace(/\b\w/g, s => s.toUpperCase());

    const formToObject = form => {
        const fd = new FormData(form);
        const obj = {};
        for (const [k, v] of fd.entries()) {
            obj[k] = v;
        }
        return obj;
    };

    allForms.forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            // Handle Vercel API or PHP form handler
            if (form.action.includes('/api/') || form.action.includes('form-handler.php')) {
                const formData = new FormData(form);

                try {
                    const res = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    const data = await res.json();

                    if (data.success) {
                        form.reset();
                        const msg = document.createElement('div');
                        msg.className = 'form-success';
                        msg.innerText = data.message || 'Thank you! Your message has been sent. We will contact you shortly.';
                        form.parentNode.replaceChild(msg, form);
                    } else {
                        alert('Error: ' + (data.message || 'Submission failed. Please try again.'));
                    }
                } catch (err) {
                    console.error(err);
                    alert('Network error while sending form. Please try again later.');
                }

                return;
            }

            const endpoint = form.dataset.endpoint;

            if (endpoint) {
                // Submit to external service (Formspree / Getform)
                const formData = new FormData(form);

                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (res.ok) {
                        form.reset();
                        const msg = document.createElement('div');
                        msg.className = 'form-success';
                        msg.innerText = 'Thanks — your request was sent. We will contact you shortly.';
                        form.parentNode.replaceChild(msg, form);
                    } else {
                        const data = await res.json().catch(() => ({}));
                        const error = data.error || (data.errors && data.errors.map(e => e.message).join(', ')) || 'Submission failed.';
                        alert('Error: ' + error);
                    }
                } catch (err) {
                    console.error(err);
                    alert('Network error while sending form. Please try again later.');
                }

                return;
            }

            // Fallback: open user's email client when no endpoint specified
            if (form.dataset.emailRecipient) {
                const recipient = form.dataset.emailRecipient;
                const subject = form.dataset.emailSubject || 'Website Booking Request';
                const data = formToObject(form);
                const lines = Object.keys(data).map(k => `${humanize(k)}: ${data[k]}`);
                lines.push('');
                lines.push(`Page: ${window.location.href}`);
                const body = encodeURIComponent(lines.join('\n'));
                window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -12% 0px'
    });

    // Hero slider
    const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let heroIndex = 0;
    let heroTimer;

    const showHero = idx => {
        heroSlides.forEach((s,i)=> s.classList.toggle('active', i===idx));
        heroIndex = idx;
    };

    const startHeroTimer = () => {
        heroTimer = setInterval(()=>{
            showHero((heroIndex+1) % heroSlides.length);
        }, 3000);
    };

    if (heroSlides.length) {
        startHeroTimer();
        prevBtn?.addEventListener('click', () => { clearInterval(heroTimer); showHero((heroIndex-1+heroSlides.length)%heroSlides.length); startHeroTimer(); });
        nextBtn?.addEventListener('click', () => { clearInterval(heroTimer); showHero((heroIndex+1)%heroSlides.length); startHeroTimer(); });
    }

    const revealTargets = [
        ...document.querySelectorAll('header, main section, .service-card, .choose-card, .mission-card, .intro-card, .team-card, .gallery-slide, .cta-panel, .contact-card, .branch-card, .social-card, .accordion-item, .info-card, .footer-grid > div, .hero-copy > *')
    ];

    revealTargets.forEach((element, index) => {
        if (!element.classList.contains('scroll-reveal')) {
            element.classList.add('scroll-reveal');
        }
        const delay = 1 + (index % 5);
        element.dataset.delay = delay.toString();
        revealObserver.observe(element);
    });

    const galleryTrack = document.querySelector('.gallery-track');
    const gallerySlides = Array.from(document.querySelectorAll('.gallery-slide'));
    const prevGallery = document.querySelector('.gallery-prev');
    const nextGallery = document.querySelector('.gallery-next');
    const galleryPagination = document.querySelector('.gallery-pagination');
    let galleryIndex = 0;
    let galleryTimer;

    const updateGalleryDots = () => {
        if (!galleryPagination) return;
        galleryPagination.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === galleryIndex);
        });
    };

    const updateGallery = () => {
        if (!galleryTrack || gallerySlides.length === 0) return;
        galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
        updateGalleryDots();
    };

    const createGalleryDots = () => {
        if (!galleryPagination || gallerySlides.length === 0) return;
        galleryPagination.innerHTML = gallerySlides.map((_, index) => `
            <button type="button" class="gallery-dot" aria-label="Show image ${index + 1}" data-index="${index}"></button>
        `).join('');

        galleryPagination.querySelectorAll('.gallery-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                galleryIndex = Number(dot.dataset.index);
                updateGallery();
                startGallery();
            });
        });
    };

    const startGallery = () => {
        if (galleryTimer) clearInterval(galleryTimer);
        galleryTimer = setInterval(() => {
            galleryIndex = (galleryIndex + 1) % gallerySlides.length;
            updateGallery();
        }, 7000);
    };

    if (gallerySlides.length > 0) {
        createGalleryDots();
        updateGallery();
        startGallery();
    }

    prevGallery?.addEventListener('click', () => {
        if (gallerySlides.length === 0) return;
        galleryIndex = (galleryIndex - 1 + gallerySlides.length) % gallerySlides.length;
        updateGallery();
        startGallery();
    });

    nextGallery?.addEventListener('click', () => {
        if (gallerySlides.length === 0) return;
        galleryIndex = (galleryIndex + 1) % gallerySlides.length;
        updateGallery();
        startGallery();
    });

    window.addEventListener('load', () => {
        document.querySelectorAll('.page-load-fade').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.08}s`;
            item.classList.add('reveal');
        });

        document.querySelectorAll('.hero-copy').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.08}s`;
            item.classList.add('reveal');
        });
    });


 const expectations = [{
    image: 'assets/book-appointment.png',
    title: 'Schedule Your Appointment',
    description: 'Book your visit online, by phone or through our contact form at a time that is convenient for you'
 },

 {
    image: 'assets/complete-reg.png',
    title: 'Complete Your Registration',
    description: 'Download and complete your patients forms before your visit, or arrive a little early to complete them at the clinic.'
 },

 {
    image: 'assets/work-images/team.jpg',
    title: 'Meet Your Dental Team',
    description: 'We willtake time to understand your concerns, answer your questions, and discuss your oral health goals.'
 },

  {
    image: 'assets/dental-exam.png',
    title: 'Comprehensive Examination',
    description: 'Your dentist will perform a thorough assessment of your teeth, gums, and overall oral health. X-rays may be taken if required.'
 },

  {
    image: 'assets/treatment-plan.jpeg',
    title: 'Personalized Treatment Plan',
    description: 'You will receive clear recommendations and have the opportunity to discuss treatment options, costs and next steps.'
 }

];

let expectationCard = ''

 expectations.forEach(expectation => {
    expectationCard+=`
       <div class="expectation-card">
            <img src="${expectation.image}" alt="dental appointment">
            <div class="expectation-texts">
                <h3>${expectation.title}</h3>
                <p>${expectation.description}</p>
            </div>
        </div>
    `
 })

 const _expectationGrid = document.querySelector('.expectation-grid');
if (_expectationGrid) {
    _expectationGrid.innerHTML = expectationCard;
}