document.addEventListener('DOMContentLoaded', () => {
    console.log('MTC Premium Loaded');

    // --- INICIALIZAR SUPABASE ---
    let supabase = null;
    
    if (typeof window.supabase !== 'undefined') {
        const SUPABASE_URL = 'https://acfcilnkegtvbuxkyxvk.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZmNpbG5rZWd0dmJ1eGt5eHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDE2MjksImV4cCI6MjA3OTUxNzYyOX0.iXI4i3tRXe9qgHeq5kZdrJHn62eEnD47dWOIfiVn3H8';
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase inicializado com sucesso');
    } else {
        console.error('❌ Supabase SDK não foi carregado. Verifique a conexão com a internet.');
    }

    // --- BARRA DE PROGRESSO DE SCROLL ---
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrollPercentage + '%';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Inicializar

    // --- LOADER ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800); // Show loader for 0.8s (snappier)
        
        // Force Hero Reveal immediately after loader
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-premium .reveal');
            heroElements.forEach(el => el.classList.add('active'));
        }, 900);
    }

    // --- ROTATING WORD ANIMATION ---
    const rotatingWord = document.getElementById('rotating-word');
    if (rotatingWord) {
        const words = ['organizar', 'prosperar', 'crescer', 'escalar', 'automatizar', 'transformar'];
        let currentIndex = 0;
        
        const updateWord = () => {
            rotatingWord.style.opacity = '0';
            rotatingWord.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                rotatingWord.textContent = words[currentIndex];
                rotatingWord.style.opacity = '1';
                rotatingWord.style.transform = 'translateY(0)';
                currentIndex = (currentIndex + 1) % words.length;
            }, 300);
        };
        
        // Initial word
        updateWord();
        
        // Change word every 2.5 seconds
        setInterval(updateWord, 2500);
    }

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- HEADER SCROLL ---
    const header = document.querySelector('.premium-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- EFFECT 1: BREATHING SCALES ---
    const scalesContainer = document.getElementById('scales-container');
    if (scalesContainer) {
        const cols = Math.floor(window.innerWidth / 50);
        const rows = Math.floor(window.innerHeight / 50);
        const totalScales = cols * rows;

        for (let i = 0; i < totalScales; i++) {
            const scale = document.createElement('div');
            scale.classList.add('scale-item');
            scalesContainer.appendChild(scale);
        }
    }

    // --- EFFECT 2: DATA MAP ---
    const dataMapContainer = document.getElementById('data-map-bg');
    if (dataMapContainer) {
        const canvas = document.createElement('canvas');
        dataMapContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let particles = [];
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }
        
        function initParticles() {
            particles = [];
            const particleCount = Math.floor(width * height / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3, // Slower for premium feel
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 1.5 + 0.5 // Smaller, more subtle
                });
            }
        }
        
        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(179, 136, 235, 0.3)';
            ctx.strokeStyle = 'rgba(179, 136, 235, 0.05)'; // Very subtle lines
            
            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            
            requestAnimationFrame(draw);
        }
        
        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    // --- CASINO COUNT UP ANIMATION ---
    const statsSection = document.querySelector('#results');
    const stats = document.querySelectorAll('.stat-number');
    let started = false;

    const startCount = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        
        let count = 0;
        const duration = 2000; // 2s
        const increment = target / (duration / 16); // 60fps

        const updateCount = () => {
            count += increment;
            if (count < target) {
                el.innerText = prefix + Math.ceil(count) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = prefix + target + suffix;
            }
        };
        updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            stats.forEach(startCount);
            started = true;
        }
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- CONTACT MODAL LOGIC ---
    const modal = document.getElementById('contact-modal');
    const openModalBtns = document.querySelectorAll('a[href="#contact"]'); // Target all contact links
    const closeModalBtn = document.querySelector('.modal-close');
    const modalForm = document.querySelector('.modal-form');

    if (modal) {
        const openModal = (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        openModalBtns.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Handle Form Submit (Visual only)
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = modalForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                
                btn.innerText = 'Enviando...';
                btn.style.opacity = '0.7';
                
                setTimeout(() => {
                    btn.innerText = 'Solicitação Enviada! ✓';
                    btn.style.background = 'rgba(72, 187, 120, 0.2)';
                    btn.style.borderColor = '#48bb78';
                    
                    setTimeout(() => {
                        closeModal();
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                        btn.style.opacity = '1';
                        modalForm.reset();
                    }, 2000);
                }, 1500);
            });
        }
    }

    // --- TESTIMONIALS CAROUSEL ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track?.children || []);
    const nextButton = document.querySelector('.carousel-button--right');
    const prevButton = document.querySelector('.carousel-button--left');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav?.children || []);

    if (track && slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Arrange slides next to each other
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        // Next button
        if (nextButton) {
            nextButton.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide');
                const nextSlide = currentSlide.nextElementSibling || slides[0];
                const currentDot = dotsNav.querySelector('.current-slide');
                const nextIndex = slides.findIndex(slide => slide === nextSlide);
                const nextDot = dots[nextIndex];

                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            });
        }

        // Previous button
        if (prevButton) {
            prevButton.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide');
                const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
                const currentDot = dotsNav.querySelector('.current-slide');
                const prevIndex = slides.findIndex(slide => slide === prevSlide);
                const prevDot = dots[prevIndex];

                moveToSlide(track, currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            });
        }

        // Dot navigation
        if (dotsNav) {
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;

                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.current-slide');
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                const targetSlide = slides[targetIndex];

                moveToSlide(track, currentSlide, targetSlide);
                updateDots(currentDot, targetDot);
            });
        }

        // Auto-play (optional)
        setInterval(() => {
            if (nextButton) {
                nextButton.click();
            }
        }, 5000); // Change slide every 5 seconds
    }

    // --- SUPABASE FORM INTEGRATION ---
    const leadForm = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submit-btn');
    const contactModal = document.getElementById('contact-modal');

    console.log('🔍 Procurando formulário...');
    console.log('leadForm:', leadForm);
    console.log('submitBtn:', submitBtn);
    console.log('contactModal:', contactModal);

    if (leadForm && submitBtn) {
        console.log('✅ Formulário encontrado! Adicionando event listener...');
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Capturar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                empresa: document.getElementById('empresa').value.trim(),
                porte: document.getElementById('porte').value,
                telefone: document.getElementById('telefone').value.trim(),
                email: document.getElementById('email').value.trim()
            };

            // Validação básica
            if (!formData.nome || !formData.empresa || !formData.porte || !formData.telefone || !formData.email) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Feedback visual - Loading
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            try {
                // Verificar se Supabase está inicializado
                if (!supabase) {
                    throw new Error('Supabase não está inicializado. Verifique sua conexão com a internet.');
                }

                // Enviar para Supabase
                const { data, error } = await supabase
                    .from('leads')
                    .insert([formData]);

                if (error) {
                    throw error;
                }

                // Sucesso!
                submitBtn.innerText = 'Enviado com Sucesso! ✓';
                submitBtn.style.background = 'rgba(72, 187, 120, 0.2)';
                submitBtn.style.borderColor = '#48bb78';

                // Resetar formulário
                leadForm.reset();

                // Fechar modal após 2 segundos
                setTimeout(() => {
                    if (contactModal) {
                        contactModal.classList.remove('active');
                        document.body.style.overflow = '';
                    }

                    // Restaurar botão
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    submitBtn.disabled = false;
                }, 2000);

                // Log de sucesso (opcional - remover em produção)
                console.log('Lead cadastrado com sucesso:', data);

            } catch (error) {
                // Erro
                console.error('Erro ao enviar lead:', error);

                submitBtn.innerText = 'Erro ao Enviar ✗';
                submitBtn.style.background = 'rgba(239, 68, 68, 0.2)';
                submitBtn.style.borderColor = '#ef4444';

                alert('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');

                // Restaurar botão após 3 segundos
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});
