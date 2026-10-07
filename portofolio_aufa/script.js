/* ==========================================================================
   ANTIGRAVITY CREATIVE PORTFOLIO - JAVASCRIPT ENGINE
   Fitur: Space Particle Canvas, Mouse Parallax, 3D Card Tilt, 
          Scroll Reveal (Falling Up), Zero-G Mode Toggle, Project Modal
   Penulis: Aufa
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. INITIALIZATION & UTILITIES
    // --------------------------------------------------------------------------
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    // Update copyright year automatically
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --------------------------------------------------------------------------
    // 2. ANTIGRAVITY SPACE CANVAS (PARTIKEL BINTANG / DEBU ZERO-GRAVITY)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('space-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        let numParticles = isMobile ? 40 : 90;
        let mouseX = width / 2;
        let mouseY = height / 2;
        let isZeroGExtra = false;

        // Particle Constructor with Mode Support
        class ZeroGParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.2 + 0.5;
                this.speedY = -(Math.random() * 0.4 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.alpha = Math.random() * 0.7 + 0.2;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.assignColor();
            }

            assignColor() {
                if (isZeroGExtra) {
                    // Gojo System palette: Six Eyes cyan, Hollow Purple, soft white
                    const colors = ['#00E5FF', '#00D9FF', '#8B5CF6', '#A855F7', '#F5F7FF'];
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.size = Math.random() * 1.4 + 0.4;
                } else {
                    // Normal Mode Clean Tech Palette: Blue, Cyan, Slate White
                    const colors = ['#3b82f6', '#06b6d4', '#60a5fa', '#ffffff', '#94a3b8'];
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }
            }

            update() {
                const currentSpeedY = isZeroGExtra ? this.speedY * 0.55 : this.speedY;
                this.y += currentSpeedY;
                this.x += this.speedX;

                this.alpha += this.twinkleSpeed;
                if (this.alpha > 0.9 || this.alpha < 0.2) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }

                if (!isMobile) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }

                if (this.y < -10) this.y = height + 10;
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = isZeroGExtra ? this.alpha * 0.55 : this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.size * 3;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new ZeroGParticle());
            }
        }

        // Render loop
        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < (isZeroGExtra ? 120 : 85)) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / (isZeroGExtra ? 120 : 85)) * (isZeroGExtra ? 0.09 : 0.12);
                        ctx.strokeStyle = isZeroGExtra ? '#00E5FF' : '#3b82f6';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.toggleCanvasZeroG = function(active) {
            isZeroGExtra = active;
            numParticles = active ? (isMobile ? 30 : 70) : (isMobile ? 40 : 90);
            initParticles();
        };
    }


    // --------------------------------------------------------------------------
    // 3. MOUSE PARALLAX EFFECT (DILAKUKAN HANYA PADA DESKTOP)
    // --------------------------------------------------------------------------
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!isMobile && parallaxElements.length > 0) {
        let currentMouseX = 0;
        let currentMouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        function updateParallax() {
            currentMouseX += (targetMouseX - currentMouseX) * 0.08;
            currentMouseY += (targetMouseY - currentMouseY) * 0.08;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.03;
                const moveX = currentMouseX * speed * 250;
                const moveY = currentMouseY * speed * 250;
                el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });

            requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }


    // --------------------------------------------------------------------------
    // 4. 3D TILT EFFECT UNTUK KARTU PROYEK (PROJECT CARDS) & AVATAR
    // --------------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card, .3d-tilt-target');

    if (!isMobile) {
        tiltCards.forEach(card => {
            const glare = card.querySelector('.card-glare');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

                if (glare) {
                    const glareX = (x / rect.width) * 100;
                    const glareY = (y / rect.height) * 100;
                    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            });
        });
    }


    // --------------------------------------------------------------------------
    // 5. SCROLL REVEAL & "FALLING UP" OBSERVER
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-up, .fall-up-item');

    document.body.classList.add('js-loaded');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: '100px 0px 100px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
            el.classList.add('revealed');
        }
    });

    window.addEventListener('hashchange', () => {
        revealElements.forEach(el => el.classList.add('revealed'));
    });
    window.addEventListener('scroll', () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 150) {
                el.classList.add('revealed');
            }
        });
    });


    // --------------------------------------------------------------------------
    // 6. NAVIGASI STICKY & MOBILE MENU TOGGLE
    // --------------------------------------------------------------------------
    const header = document.querySelector('.glass-nav-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        let currentSection = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
            });
        });
    }


    // --------------------------------------------------------------------------
    // 7. GOJO SATORU INFINITY MODE (DELEGATED TO INFINITY-MODE.JS)
    // --------------------------------------------------------------------------
    // Toggle handling is now cleanly managed by infinity-mode.js


    // --------------------------------------------------------------------------
    // 8. PROJECT CATEGORY FILTER & MODAL SYSTEM
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Project Details Data
    const projectDetails = {
        '1': {
            title: 'Orbit Analytics Dashboard',
            category: 'Web Application',
            image: 'assets/images/project-1.jpg',
            description: 'Platform analitik data futuristik bertema ruang angkasa dengan chart visualisasi interaktif real-time, skema warna dark-space, dan pemantauan statistik performa web.',
            tech: ['HTML5', 'CSS3 Grid', 'Vanilla JavaScript', 'Chart.js', 'GitHub Pages'],
            demoLink: '#',
            repoLink: 'https://github.com'
        },
        '2': {
            title: 'Cosmic AI Holographic UI',
            category: 'Creative & Animation',
            image: 'assets/images/project-2.jpg',
            description: 'Eksperimen antarmuka asisten AI holografis dengan efek gelombang suara berbasis canvas HTML5, animasi transisi GSAP, dan interaksi responsif tanpa bobot.',
            tech: ['GSAP 3', 'Canvas API', 'CSS Variables', 'Web Audio API'],
            demoLink: '#',
            repoLink: 'https://github.com'
        },
        '3': {
            title: 'Nebula Mobile Experience',
            category: 'UI/UX Redesign',
            image: 'assets/images/project-3.jpg',
            description: 'Konsep desain antarmuka aplikasi seluler dengan estetika glassmorphism modern, navigasi gesture melayang, serta kontras warna yang nyaman di mata.',
            tech: ['Figma', 'UI/UX Prototyping', 'Glassmorphism Design System'],
            demoLink: '#',
            repoLink: 'https://github.com'
        }
    };

    // Modal Handling
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body-content');
    const modalTriggers = document.querySelectorAll('.btn-modal-trigger');

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data || !modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-body-wrapper">
                <img src="${data.image}" alt="${data.title}">
                <span class="project-badge" style="position:static; display:inline-block; margin-bottom:0.8rem;">${data.category}</span>
                <h2 style="font-family:var(--font-heading); font-size:2rem; margin-bottom:1rem;">${data.title}</h2>
                <p style="color:var(--color-text-muted); margin-bottom:1.5rem; line-height:1.7;">${data.description}</p>
                
                <h4 style="font-size:0.95rem; margin-bottom:0.8rem; color:var(--color-accent-cyan-glow);">Teknologi Yang Digunakan:</h4>
                <div class="project-tech" style="flex-wrap:wrap; margin-bottom:2rem;">
                    ${data.tech.map(t => `<span style="background:rgba(139,92,246,0.2); padding:0.4rem 0.9rem; border-radius:20px; border:1px solid rgba(139,92,246,0.3); color:#fff;">${t}</span>`).join('')}
                </div>

                <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                    <a href="${data.demoLink}" target="_blank" class="btn btn-primary">
                        <span>Buka Live Demo</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <a href="${data.repoLink}" target="_blank" class="btn btn-secondary glass-btn">
                        <span>Source Code (GitHub)</span>
                        <i class="fa-brands fa-github"></i>
                    </a>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-project');
            openModal(id);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }


    // --------------------------------------------------------------------------
    // 9. FORM KONTAK INTERAKTIF
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('antigravity-contact-form');
    const formToast = document.getElementById('form-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show toast message
            if (formToast) {
                formToast.classList.remove('hidden');
                
                setTimeout(() => {
                    formToast.classList.add('hidden');
                }, 5000);
            }

            contactForm.reset();
        });
    }

    // --------------------------------------------------------------------------
    // 10. SERTIV LIGHTBOX MODAL
    // --------------------------------------------------------------------------
    const sertivModal   = document.getElementById('sertiv-modal');
    const sertivClose   = document.getElementById('sertiv-modal-close');
    const sertivChips   = document.querySelectorAll('.sertiv-chip');

    function openSertivModal(chip) {
        if (!sertivModal) return;

        const title   = chip.dataset.title   || 'Nama Sertifikat';
        const issuer  = chip.dataset.issuer  || '-';
        const date    = chip.dataset.date    || '-';
        const imgSrc  = chip.dataset.img     || '';
        const badge   = chip.querySelector('.sertiv-chip-badge')?.textContent || '';

        // Set info
        document.getElementById('sertiv-modal-title').textContent  = title;
        document.getElementById('sertiv-modal-badge').textContent  = badge;
        document.getElementById('sertiv-modal-issuer').querySelector('span').textContent = issuer;
        document.getElementById('sertiv-modal-date').querySelector('span').textContent   = date;

        // Set image or placeholder
        const imgArea = document.getElementById('sertiv-modal-img-area');
        if (imgSrc) {
            imgArea.innerHTML = `<img src="${imgSrc}" alt="${title}">`;
        } else {
            imgArea.innerHTML = `
                <div class="sertiv-modal-placeholder">
                    <i class="fa-solid fa-certificate"></i>
                    <span>Sertifikat belum diupload</span>
                </div>`;
        }

        sertivModal.classList.remove('hidden', 'fade-out');
        sertivModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSertivModal() {
        if (!sertivModal) return;
        sertivModal.classList.add('fade-out');
        setTimeout(() => {
            sertivModal.classList.add('hidden');
            sertivModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }, 300);
    }

    sertivChips.forEach(chip => {
        chip.addEventListener('click', () => openSertivModal(chip));
    });

    if (sertivClose) sertivClose.addEventListener('click', closeSertivModal);

    if (sertivModal) {
        sertivModal.addEventListener('click', (e) => {
            if (e.target === sertivModal) closeSertivModal();
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sertivModal && !sertivModal.classList.contains('hidden')) {
            closeSertivModal();
        }
    });

});

