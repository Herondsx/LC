/* =====================================================
   LUIZ CHAVES ADVOCACIA — Interações
   ===================================================== */
(function () {
    'use strict';

    /* ---------- PRELOADER ---------- */
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function () { preloader.classList.add('is-hidden'); }, 500);
        }
    });

    document.addEventListener('DOMContentLoaded', function () {

        /* ---------- ANO NO RODAPÉ ---------- */
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        /* ---------- HEADER: scroll + progress ---------- */
        var header = document.getElementById('header');
        var progress = document.getElementById('scrollProgress');
        var toTop = document.getElementById('toTop');

        function onScroll() {
            var y = window.pageYOffset || document.documentElement.scrollTop;

            if (header) header.classList.toggle('is-scrolled', y > 40);
            if (toTop) toTop.classList.toggle('is-visible', y > 600);

            if (progress) {
                var docH = document.documentElement.scrollHeight - window.innerHeight;
                var pct = docH > 0 ? (y / docH) * 100 : 0;
                progress.style.width = pct + '%';
            }

            updateActiveLink(y);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        /* ---------- BACK TO TOP ---------- */
        if (toTop) {
            toTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        /* ---------- MENU MOBILE ---------- */
        var navToggle = document.getElementById('navToggle');
        var nav = document.getElementById('nav');

        // backdrop dinâmico
        var backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);

        function closeMenu() {
            if (!nav) return;
            nav.classList.remove('is-open');
            navToggle.classList.remove('is-open');
            backdrop.classList.remove('is-open');
            document.body.classList.remove('menu-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        function openMenu() {
            nav.classList.add('is-open');
            navToggle.classList.add('is-open');
            backdrop.classList.add('is-open');
            document.body.classList.add('menu-open');
            navToggle.setAttribute('aria-expanded', 'true');
        }
        if (navToggle && nav) {
            navToggle.addEventListener('click', function () {
                nav.classList.contains('is-open') ? closeMenu() : openMenu();
            });
            backdrop.addEventListener('click', closeMenu);
            nav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', closeMenu);
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeMenu();
            });
        }

        /* ---------- SMOOTH SCROLL (com offset do header) ---------- */
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#' || id.length < 2) return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                var headerH = header ? header.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 1;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });

        /* ---------- LINK ATIVO ---------- */
        var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
        var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

        function updateActiveLink(y) {
            if (!sections || !navLinks) return; // evita erro na 1ª chamada (antes das variáveis existirem)
            var headerH = header ? header.offsetHeight : 0;
            var current = '';
            sections.forEach(function (sec) {
                if (y + headerH + 80 >= sec.offsetTop) current = sec.id;
            });
            navLinks.forEach(function (link) {
                link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
            });
        }

        /* ---------- REVEAL ON SCROLL ---------- */
        var revealEls = document.querySelectorAll('[data-reveal]');
        revealEls.forEach(function (el) {
            var d = el.getAttribute('data-reveal-delay');
            if (d) el.style.setProperty('--reveal-delay', d);
        });

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }

        /* ---------- CONTADORES ---------- */
        var counters = document.querySelectorAll('.counter');
        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-target'), 10) || 0;
            var dur = 1800;
            var start = null;
            function tick(ts) {
                if (!start) start = ts;
                var progress = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target.toLocaleString('pt-BR');
            }
            requestAnimationFrame(tick);
        }
        if ('IntersectionObserver' in window && counters.length) {
            var cio = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });
            counters.forEach(function (c) { cio.observe(c); });
        } else {
            counters.forEach(function (c) { c.textContent = c.getAttribute('data-target'); });
        }

        /* ---------- DEPOIMENTOS SLIDER ---------- */
        var track = document.getElementById('depoTrack');
        var dotsWrap = document.getElementById('depoDots');
        if (track && dotsWrap) {
            var slides = track.children;
            var total = slides.length;
            var index = 0;
            var timer = null;

            for (var i = 0; i < total; i++) {
                var dot = document.createElement('button');
                dot.className = 'depo-dot' + (i === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
                (function (n) {
                    dot.addEventListener('click', function () { goTo(n); resetTimer(); });
                })(i);
                dotsWrap.appendChild(dot);
            }
            var dots = dotsWrap.children;

            function goTo(n) {
                index = (n + total) % total;
                track.style.transform = 'translateX(' + (-index * 100) + '%)';
                for (var k = 0; k < dots.length; k++) dots[k].classList.toggle('is-active', k === index);
            }
            function next() { goTo(index + 1); }
            function startTimer() { timer = setInterval(next, 6000); }
            function resetTimer() { clearInterval(timer); startTimer(); }
            startTimer();

            // pausa ao passar o mouse
            var viewport = track.parentElement;
            viewport.addEventListener('mouseenter', function () { clearInterval(timer); });
            viewport.addEventListener('mouseleave', startTimer);

            // suporte a swipe (touch)
            var startX = 0, deltaX = 0, dragging = false;
            track.addEventListener('touchstart', function (e) {
                startX = e.touches[0].clientX; dragging = true; clearInterval(timer);
            }, { passive: true });
            track.addEventListener('touchmove', function (e) {
                if (dragging) deltaX = e.touches[0].clientX - startX;
            }, { passive: true });
            track.addEventListener('touchend', function () {
                if (Math.abs(deltaX) > 50) { deltaX < 0 ? next() : goTo(index - 1); }
                deltaX = 0; dragging = false; startTimer();
            });
        }

        /* ---------- FAQ (acordeão: abre um, fecha os outros) ---------- */
        var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
        faqItems.forEach(function (item) {
            item.addEventListener('toggle', function () {
                if (item.open) {
                    faqItems.forEach(function (other) {
                        if (other !== item) other.open = false;
                    });
                }
            });
        });

        /* ---------- PARALLAX SUAVE NO HERO ---------- */
        var hero = document.getElementById('inicio');
        var heroBg = document.querySelector('.hero__bg');
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var finePointer = window.matchMedia('(pointer: fine)').matches;
        if (hero && heroBg && !reduceMotion && finePointer) {
            var raf = null;
            hero.addEventListener('mousemove', function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    var r = hero.getBoundingClientRect();
                    var x = (e.clientX - r.left) / r.width - 0.5;
                    var y = (e.clientY - r.top) / r.height - 0.5;
                    heroBg.style.transform = 'translate(' + (x * -26).toFixed(1) + 'px,' + (y * -26).toFixed(1) + 'px)';
                    raf = null;
                });
            });
            hero.addEventListener('mouseleave', function () {
                heroBg.style.transition = 'transform 0.6s ease';
                heroBg.style.transform = '';
                setTimeout(function () { heroBg.style.transition = ''; }, 600);
            });
        }

        /* ---------- FORMULÁRIO → WHATSAPP ---------- */
        /* Como o GitHub Pages é estático (sem servidor de e-mail), o envio
           monta a mensagem e abre o WhatsApp já preenchido. Para receber por
           e-mail, troque este bloco por um serviço como Formspree/Web3Forms. */
        var WHATSAPP_NUMBER = '5511970007000';
        var form = document.getElementById('contactForm');
        var success = document.getElementById('formSuccess');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var valid = true;
                var required = form.querySelectorAll('[required]');
                required.forEach(function (field) {
                    var ok = field.value.trim() !== '';
                    if (field.type === 'email') {
                        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
                    }
                    field.classList.toggle('is-invalid', !ok);
                    if (!ok) valid = false;
                });
                if (!valid) {
                    var firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) firstInvalid.focus();
                    return;
                }

                var get = function (name) {
                    var el = form.elements[name];
                    return el ? el.value.trim() : '';
                };
                var texto =
                    'Olá! Gostaria de solicitar um atendimento jurídico.\n\n' +
                    '• Nome: ' + get('nome') + '\n' +
                    '• E-mail: ' + get('email') + '\n' +
                    (get('telefone') ? '• Telefone: ' + get('telefone') + '\n' : '') +
                    '• Assunto: ' + get('assunto') + '\n' +
                    '• Mensagem: ' + get('mensagem');

                var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);
                window.open(url, '_blank', 'noopener');

                if (success) {
                    success.classList.add('is-visible');
                }
                form.reset();
                setTimeout(function () {
                    if (success) success.classList.remove('is-visible');
                }, 6000);
            });

            // remove o estado de erro ao digitar
            form.querySelectorAll('.field__input').forEach(function (field) {
                field.addEventListener('input', function () {
                    field.classList.remove('is-invalid');
                });
            });
        }

    });
})();
