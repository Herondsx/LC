/* =====================================================================
   LUIZ CHAVES — ADVOCACIA TRIBUTÁRIA · Interações
   JavaScript puro, sem dependências (compatível com GitHub Pages).
   ===================================================================== */
(function () {
    'use strict';

    /* Número que recebe as mensagens do formulário (somente dígitos, com DDI 55) */
    var WHATSAPP_NUMBER = '5511970007000';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var verticalTimeline = window.matchMedia('(max-width: 920px)');

    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
    function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
    function smooth(t) { return t * t * (3 - 2 * t); }
    function range(p, start, end) { return clamp((p - start) / (end - start), 0, 1); }

    /* ---------------------------------------------------------------
       Ano no rodapé
       --------------------------------------------------------------- */
    var yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------------------------------------------------------------
       Manifesto: quebra o texto em palavras para acender uma a uma
       --------------------------------------------------------------- */
    $$('[data-words]').forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.textContent = '';
        words.forEach(function (w, i) {
            var span = document.createElement('span');
            span.className = 'word';
            span.style.setProperty('--i', i);
            span.textContent = w;
            el.appendChild(span);
            if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
        el.style.setProperty('--n', words.length);
    });

    /* ---------------------------------------------------------------
       Menu (desktop + mobile)
       --------------------------------------------------------------- */
    var nav = $('#nav');
    var toggle = $('#navToggle');
    var menu = $('#navMenu');

    function setMenu(open) {
        nav.classList.toggle('is-open', open);
        root.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    if (nav && toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(!nav.classList.contains('is-open'));
        });
        $$('a', menu).forEach(function (a) {
            a.addEventListener('click', function () { setMenu(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });
        window.matchMedia('(min-width: 921px)').addEventListener('change', function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ---------------------------------------------------------------
       Revelação ao entrar na tela
       --------------------------------------------------------------- */
    var revealEls = $$('[data-reveal]');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* ---------------------------------------------------------------
       Motor de scroll: calcula o progresso (0 → 1) de cada cena e
       entrega ao CSS via variáveis (--p, --a, --b, --c).
       --------------------------------------------------------------- */
    var themed = $$('main [data-theme], footer[data-theme]');
    var navLinks = $$('.nav__link');
    var linkTargets = navLinks.map(function (a) { return $(a.getAttribute('href')); });
    var hero = $('#inicio');
    var contact = $('#contato');
    var waFloat = $('#waFloat');

    var scenes = $$('[data-scene]').map(function (el) {
        return { el: el, mode: el.getAttribute('data-scene'), last: -1 };
    });

    var timeline = $('.timeline');
    var tlItems = timeline ? $$('.tl-item', timeline) : [];
    var tlThresholds = [];

    var stackCards = $$('.stack__card');
    var stackTops = [];

    var vh = window.innerHeight;
    var navH = nav ? nav.offsetHeight : 52;

    function measure() {
        vh = window.innerHeight;
        navH = nav ? nav.offsetHeight : 52;

        // Ponto em que a linha do tempo "alcança" cada marco
        if (timeline) {
            var horizontal = !verticalTimeline.matches;
            var size = horizontal ? timeline.clientWidth : timeline.clientHeight;
            tlThresholds = tlItems.map(function (item) {
                var pos = horizontal ? item.offsetLeft : item.offsetTop + 12;
                return size ? pos / size : 0;
            });
        }
        // Posição "sticky" de cada card do método
        stackTops = stackCards.map(function (card) {
            return parseFloat(getComputedStyle(card).top) || 0;
        });
    }

    function progress(scene, rect) {
        switch (scene.mode) {
            case 'exit':   // conforme a seção sai pelo topo
                return clamp(-rect.top / rect.height, 0, 1);
            case 'sticky': // enquanto o conteúdo fica "preso" na tela
                var total = rect.height - vh;
                return total > 0 ? clamp(-rect.top / total, 0, 1) : 1;
            case 'view':   // enquanto o elemento atravessa a tela
                return clamp((vh * 0.8 - rect.top) / (rect.height + vh * 0.2), 0, 1);
        }
        return 0;
    }

    function applyScene(scene, p) {
        var el = scene.el;
        if (el.classList.contains('reform')) {
            var a = smooth(range(p, 0.1, 0.42));
            var b = smooth(range(p, 0.4, 0.7));
            var c = smooth(range(p, 0.66, 0.84));
            el.style.setProperty('--a', a.toFixed(4));
            el.style.setProperty('--b', b.toFixed(4));
            el.style.setProperty('--c', c.toFixed(4));
            return;
        }
        el.style.setProperty('--p', p.toFixed(4));
        if (el === timeline) {
            tlItems.forEach(function (item, i) {
                item.classList.toggle('is-active', p >= tlThresholds[i] - 0.005);
            });
        }
    }

    var ticking = false;
    function requestFrame() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(frame);
        }
    }

    function frame() {
        ticking = false;
        var y = window.pageYOffset;
        var i;

        /* ---- leituras (todas antes de qualquer escrita) ---- */
        var probe = navH / 2;
        var theme = null;
        for (i = 0; i < themed.length; i++) {
            var r = themed[i].getBoundingClientRect();
            if (r.top <= probe && r.bottom > probe) { theme = themed[i].getAttribute('data-theme'); break; }
        }

        var active = -1;
        for (i = 0; i < linkTargets.length; i++) {
            if (linkTargets[i] && linkTargets[i].getBoundingClientRect().top <= vh * 0.4) active = i;
        }
        // No fim da página, o último link fica ativo
        if (y + vh >= document.documentElement.scrollHeight - 4) active = linkTargets.length - 1;

        var sceneRects = reduceMotion ? [] : scenes.map(function (s) { return s.el.getBoundingClientRect(); });

        var stackRects = (!reduceMotion && stackCards.length)
            ? stackCards.map(function (c) { return c.getBoundingClientRect(); })
            : [];

        var heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        var contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
        // Dentro de uma cena "presa" na tela o botão flutuante sai de cena
        var inStickyScene = sceneRects.some(function (r, k) {
            return scenes[k].mode === 'sticky' && r.top <= 0 && r.bottom >= vh;
        });

        /* ---- escritas ---- */
        if (nav) {
            nav.classList.toggle('is-scrolled', y > 8);
            if (theme && nav.getAttribute('data-theme') !== theme) nav.setAttribute('data-theme', theme);
        }

        navLinks.forEach(function (link, k) { link.classList.toggle('is-active', k === active); });

        scenes.forEach(function (scene, k) {
            if (reduceMotion) return;
            var p = progress(scene, sceneRects[k]);
            var rounded = Math.round(p * 2000) / 2000;
            if (rounded === scene.last) return;
            scene.last = rounded;
            applyScene(scene, p);
        });

        // Cards do método: cada card encolhe e escurece quando o próximo o cobre
        if (stackRects.length) {
            var covered = stackRects.map(function (rect, k) {
                if (k === 0) return 0;
                var dist = rect.top - stackTops[k];
                return clamp(1 - dist / stackRects[k - 1].height, 0, 1);
            });
            stackCards.forEach(function (card, k) {
                var depth = 0;
                for (var j = k + 1; j < covered.length; j++) depth += covered[j];
                card.style.setProperty('--s', (1 - depth * 0.045).toFixed(4));
                card.style.setProperty('--dim', Math.min(depth, 1.6).toFixed(3));
            });
        }

        // Botão do WhatsApp: aparece depois do hero e some ao chegar no contato/rodapé
        if (waFloat) {
            waFloat.classList.toggle('is-visible', heroBottom < vh * 0.4 && contactTop > vh * 0.75 && !inStickyScene);
        }
    }

    if (reduceMotion) {
        // Mostra direto o estado final das cenas
        scenes.forEach(function (scene) {
            if (scene.el.classList.contains('reform')) {
                ['--a', '--b', '--c'].forEach(function (v) { scene.el.style.setProperty(v, 1); });
            } else if (scene.mode !== 'exit') {
                scene.el.style.setProperty('--p', 1);
            }
        });
        tlItems.forEach(function (item) { item.classList.add('is-active'); });
    }

    measure();
    frame();
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', function () { measure(); requestFrame(); });
    window.addEventListener('load', function () { measure(); requestFrame(); });

    /* ---------------------------------------------------------------
       Holofote nos cards e inclinação 3D (somente mouse)
       --------------------------------------------------------------- */
    if (finePointer) {
        $$('[data-spotlight]').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    }

    if (finePointer && !reduceMotion) {
        $$('[data-tilt]').forEach(function (el) {
            var max = el.classList.contains('portrait') ? 7 : 4;
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var yy = (e.clientY - r.top) / r.height - 0.5;
                el.classList.add('is-tilting');
                el.style.setProperty('--rx', (-yy * max).toFixed(2) + 'deg');
                el.style.setProperty('--ry', (x * max).toFixed(2) + 'deg');
            });
            el.addEventListener('pointerleave', function () {
                el.classList.remove('is-tilting');
                el.style.setProperty('--rx', '0deg');
                el.style.setProperty('--ry', '0deg');
            });
        });
    }

    /* ---------------------------------------------------------------
       FAQ: acordeão com altura animada (um aberto por vez)
       --------------------------------------------------------------- */
    var accItems = $$('.acc');
    var running = new WeakMap();
    var EASE = 'cubic-bezier(.22, 1, .36, 1)';

    function collapse(item) {
        var body = $('.acc__a', item);
        if (!item.open || reduceMotion || !body.animate) { item.open = false; return; }
        if (running.get(item)) running.get(item).cancel();
        item.classList.add('is-closing');
        var anim = body.animate(
            [{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
            { duration: 380, easing: EASE }
        );
        running.set(item, anim);
        anim.onfinish = function () {
            item.open = false;
            item.classList.remove('is-closing');
            running.delete(item);
        };
        anim.oncancel = function () { item.classList.remove('is-closing'); };
    }

    function expand(item) {
        var body = $('.acc__a', item);
        if (running.get(item)) running.get(item).cancel();
        item.open = true;
        if (reduceMotion || !body.animate) return;
        var anim = body.animate(
            [{ height: '0px', opacity: 0 }, { height: body.scrollHeight + 'px', opacity: 1 }],
            { duration: 520, easing: EASE }
        );
        running.set(item, anim);
        anim.onfinish = function () { running.delete(item); };
    }

    accItems.forEach(function (item) {
        $('summary', item).addEventListener('click', function (e) {
            e.preventDefault();
            if (item.open && !item.classList.contains('is-closing')) {
                collapse(item);
            } else {
                accItems.forEach(function (other) { if (other !== item) collapse(other); });
                expand(item);
            }
        });
    });

    /* ---------------------------------------------------------------
       Formulário → WhatsApp
       O GitHub Pages é estático (sem servidor de e-mail), então o envio
       monta a mensagem e abre o WhatsApp já preenchido. Para receber por
       e-mail, troque este bloco por um serviço como Formspree/Web3Forms.
       --------------------------------------------------------------- */
    var form = $('#contactForm');
    var success = $('#formSuccess');

    // Máscara de telefone: (11) 98765-4321
    var tel = form ? form.elements.telefone : null;
    if (tel) {
        tel.addEventListener('input', function () {
            var d = tel.value.replace(/\D/g, '').slice(0, 11);
            var out = d;
            if (d.length > 10) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
            else if (d.length > 6) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
            else if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
            else if (d.length) out = '(' + d;
            tel.value = out;
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var firstInvalid = null;
            $$('[required]', form).forEach(function (field) {
                var value = field.value.trim();
                var ok = value !== '';
                if (ok && field.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                field.classList.toggle('is-invalid', !ok);
                if (!ok && !firstInvalid) firstInvalid = field;
            });
            if (firstInvalid) { firstInvalid.focus(); return; }

            var get = function (name) { return form.elements[name].value.trim(); };
            var text =
                'Olá! Gostaria de solicitar um atendimento.\n\n' +
                '• Nome: ' + get('nome') + '\n' +
                '• E-mail: ' + get('email') + '\n' +
                (get('telefone') ? '• Telefone: ' + get('telefone') + '\n' : '') +
                '• Assunto: ' + get('assunto') + '\n' +
                '• Mensagem: ' + get('mensagem');

            window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');

            if (success) {
                success.textContent = '✓ Tudo certo! Abrimos o WhatsApp para você concluir o envio.';
                success.classList.add('is-visible');
                setTimeout(function () { success.classList.remove('is-visible'); }, 7000);
            }
            form.reset();
        });

        $$('.field__input', form).forEach(function (field) {
            var clear = function () { field.classList.remove('is-invalid'); };
            field.addEventListener('input', clear);
            field.addEventListener('change', clear);
        });
    }
})();
