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
            image: 'assets/oral surgery.jpg',
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
                <span class="feature">${service.feature}</span>
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

    renderServiceGrid();

    const menuToggle = document.querySelector('.menu-toggle');
    const pageHeader = document.querySelector('header');
    const navLinks = document.querySelectorAll('.main-nav .link');

    menuToggle?.addEventListener('click', () => {
        pageHeader.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (pageHeader.classList.contains('open')) {
                pageHeader.classList.remove('open');
            }
        });
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