/* =========================================================
   Hikma Hasan — Portfolio scripts
   Plain JavaScript, no libraries. Every feature checks that
   its elements exist, so one missing piece never breaks the rest.
   ========================================================= */
(function () {
    'use strict';

    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- 1. Loader with percentage ---------- */
    var loader = $('#loader');
    var bar = $('#loaderBar');
    var count = $('#loaderCount');
    var heroTitle = $('#heroTitle');
    var introDone = false;

    function finishIntro() {
        if (introDone) return;
        introDone = true;
        if (bar) bar.style.width = '100%';
        if (count) count.textContent = '100';
        setTimeout(function () {
            if (loader) loader.classList.add('done');
            if (heroTitle) heroTitle.classList.add('intro-ready');
            setTimeout(function () { if (loader) loader.style.display = 'none'; }, 1050);
        }, reduce ? 0 : 250);
    }

    if (loader && !reduce) {
        var pct = 0;
        var timer = setInterval(function () {
            pct = Math.min(pct + Math.random() * 12, 92);
            if (bar) bar.style.width = pct + '%';
            if (count) count.textContent = Math.round(pct);
        }, 90);
        var stop = function () { clearInterval(timer); setTimeout(finishIntro, 300); };
        if (document.readyState === 'complete') stop(); else window.addEventListener('load', stop);
        setTimeout(function () { clearInterval(timer); finishIntro(); }, 4000); // never hang on slow images
    } else {
        finishIntro();
    }

    /* ---------- 2. Typewriter ---------- */
    var typed = $('#typed');
    if (typed && !reduce) {
        var words = ['websites', 'brand logos', 'social media posters', 'website content', 'landing pages', 'UI / UX'];
        var w = 0, c = words[0].length, deleting = true;
        var type = function () {
            var word = words[w];
            typed.textContent = word.slice(0, c);
            var delay = deleting ? 45 : 95;
            if (!deleting && c === word.length) { deleting = true; delay = 1600; }
            else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
            else c += deleting ? -1 : 1;
            setTimeout(type, delay);
        };
        setTimeout(type, 2600);
    }

    /* ---------- 3. Scroll reveal, counters, skill bars ---------- */
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (reduce) { el.textContent = target; return; }
        var start = null;
        var step = function (t) {
            if (!start) start = t;
            var p = Math.min((t - start) / 1500, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                el.classList.add('in');
                $$('.bar-fill', el).forEach(function (b) { b.classList.add('in'); });
                $$('[data-count]', el).forEach(countUp);
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    } else {
        $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
        $$('.bar-fill').forEach(function (b) { b.classList.add('in'); });
    }

    /* ---------- 4. Scroll effects: progress, nav, parallax, walking text, back-to-top ---------- */
    var progress = $('#progress');
    var nav = $('#nav');
    var toTop = $('#toTop');
    var ring = toTop ? $('circle.ring', toTop) : null;
    var mobileMenu = $('#mobile-menu');
    var parallax = $$('[data-parallax]');
    var walkers = $$('[data-scroll-x]');
    var lastY = window.scrollY, ticking = false;

    function onScroll() {
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? y / max : 0;
        if (progress) progress.style.transform = 'scaleX(' + p + ')';
        if (ring) ring.style.strokeDashoffset = 138.2 * (1 - p);

        if (nav) {
            nav.classList.toggle('scrolled', y > 10);
        }
        if (toTop) toTop.classList.toggle('show', y > 700);

        if (!reduce) {
            parallax.forEach(function (el) {
                el.style.translate = '0 ' + (y * parseFloat(el.getAttribute('data-parallax'))) + 'px';
            });
            walkers.forEach(function (el) {
                var r = el.parentElement.getBoundingClientRect();
                var offset = (window.innerHeight - r.top) * parseFloat(el.getAttribute('data-scroll-x'));
                el.style.transform = 'translateX(' + offset + 'px)';
            });
        }
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    /* ---------- 5. Desktop-only: 3D tilt, magnetic buttons, custom cursor ---------- */
    if (finePointer && !reduce) {
        $$('[data-tilt]').forEach(function (card) {
            card.addEventListener('mousemove', function (ev) {
                var r = card.getBoundingClientRect();
                var x = (ev.clientX - r.left) / r.width - 0.5;
                var y = (ev.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(1000px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });

        $$('[data-magnetic]').forEach(function (btn) {
            btn.addEventListener('mousemove', function (ev) {
                var r = btn.getBoundingClientRect();
                btn.style.transform = 'translate(' + ((ev.clientX - r.left - r.width / 2) * 0.25) + 'px,' + ((ev.clientY - r.top - r.height / 2) * 0.35) + 'px)';
            });
            btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
        });

        var dot = $('.cursor-dot'), cring = $('.cursor-ring');
        if (dot && cring) {
            var tx = 0, ty = 0, rx = 0, ry = 0;
            document.addEventListener('mousemove', function (e) {
                tx = e.clientX; ty = e.clientY;
                dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
                document.body.classList.add('has-cursor');
            });
            document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); });
            document.addEventListener('mouseover', function (e) {
                cring.classList.toggle('hover', !!e.target.closest('a, button, [data-tilt]'));
            });
            (function follow() {
                rx += (tx - rx) * 0.15; ry += (ty - ry) * 0.15;
                cring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
                requestAnimationFrame(follow);
            })();
        }
    }

    /* ---------- 6. Poster filters ---------- */
    var posterGrid = $('#posterGrid');
    $$('[data-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var f = btn.getAttribute('data-filter');
            $$('[data-filter]').forEach(function (b) { b.classList.toggle('active', b === btn); });
            $$('.poster-card').forEach(function (card, i) {
                var show = f === 'all' || card.getAttribute('data-cat') === f;
                card.classList.toggle('is-hidden', !show);
                if (show && !reduce && card.animate) {
                    card.animate([{ opacity: 0, transform: 'translateY(24px) scale(.97)' }, { opacity: 1, transform: 'none' }],
                        { duration: 600, delay: (i % 3) * 70, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
                }
            });
        });
    });

    /* ---------- 7. Poster lightbox (click, arrows, keyboard, swipe) ---------- */
    var lb = $('#lightbox'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbCount = $('#lbCount');
    var current = 0;
    function visiblePosters() { return $$('.poster-card').filter(function (c) { return !c.classList.contains('is-hidden'); }); }
    function show(i, animate) {
        var list = visiblePosters();
        if (!list.length) return;
        current = (i + list.length) % list.length;
        var card = list[current];
        var set = function () {
            lbImg.src = card.getAttribute('data-src');
            lbImg.alt = card.getAttribute('data-title');
            lbTitle.innerHTML = card.getAttribute('data-title');
            lbCount.textContent = (current + 1) + ' / ' + list.length;
            lbImg.classList.remove('swap');
        };
        if (animate) { lbImg.classList.add('swap'); setTimeout(set, 220); } else set();
    }
    function openLb(card) {
        show(visiblePosters().indexOf(card), false);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        $('#lbClose').focus();
    }
    function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

    if (lb && posterGrid) {
        posterGrid.addEventListener('click', function (e) {
            var card = e.target.closest('.poster-card');
            if (card) openLb(card);
        });
        $('#lbClose').addEventListener('click', closeLb);
        $('#lbPrev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1, true); });
        $('#lbNext').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1, true); });
        lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') closeLb();
            if (e.key === 'ArrowRight') show(current + 1, true);
            if (e.key === 'ArrowLeft') show(current - 1, true);
        });
        var sx = null;
        lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (sx === null) return;
            var dx = e.changedTouches[0].clientX - sx;
            if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1), true);
            sx = null;
        });
    }

    /* ---------- 8. Desktop "Projects" dropdown ---------- */
    var wrap = $('#projectsWrap'), pBtn = $('#projectsBtn'), dd = $('#projectsDropdown'), pIcon = $('#projectsIcon');
    if (wrap && pBtn && dd) {
        var t;
        var openDd = function () { dd.classList.add('open'); pBtn.setAttribute('aria-expanded', 'true'); if (pIcon) pIcon.classList.add('rotate-180'); };
        var closeDd = function () { dd.classList.remove('open'); pBtn.setAttribute('aria-expanded', 'false'); if (pIcon) pIcon.classList.remove('rotate-180'); };
        wrap.addEventListener('mouseenter', function () { clearTimeout(t); openDd(); });
        wrap.addEventListener('mouseleave', function () { t = setTimeout(closeDd, 150); });
        pBtn.addEventListener('click', function (e) { e.stopPropagation(); dd.classList.contains('open') ? closeDd() : openDd(); });
        document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) closeDd(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDd(); });
        $$('a', dd).forEach(function (a) { a.addEventListener('click', closeDd); });
    }

    /* ---------- 9. Mobile menu ---------- */
    var mBtn = $('#mobile-menu-button'), mpBtn = $('#mobileProjectsBtn'), mpPanel = $('#mobileProjectsPanel');
    if (mBtn && mobileMenu) {
        var closeMobile = function () {
            mobileMenu.classList.remove('open');
            mBtn.setAttribute('aria-expanded', 'false');
            mBtn.innerHTML = '<i class="fa-solid fa-bars text-lg"></i>';
        };
        mBtn.addEventListener('click', function () {
            var opening = !mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('open', opening);
            mBtn.setAttribute('aria-expanded', String(opening));
            mBtn.innerHTML = '<i class="fa-solid ' + (opening ? 'fa-xmark' : 'fa-bars') + ' text-lg"></i>';
        });
        $$('a[href^="#"]', mobileMenu).forEach(function (a) { a.addEventListener('click', closeMobile); });
        window.addEventListener('resize', function () { if (window.innerWidth >= 1024) closeMobile(); });
    }
    if (mpBtn && mpPanel) {
        mpBtn.addEventListener('click', function () {
            var opening = mpPanel.classList.contains('hidden');
            mpPanel.classList.toggle('hidden');
            mpBtn.setAttribute('aria-expanded', String(opening));
            var i = $('i', mpBtn); if (i) i.classList.toggle('rotate-180', opening);
        });
    }

    /* ---------- 10. Theme toggle (navy/ivory swap, accent stays) ---------- */
    function setTheme(mode) {
        root.classList.toggle('dark', mode === 'dark');
        $$('.theme-icon').forEach(function (i) {
            i.classList.toggle('fa-moon', mode !== 'dark');
            i.classList.toggle('fa-sun', mode === 'dark');
        });
        try { localStorage.setItem('theme', mode); } catch (e) { }
    }
    setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    $$('#theme-toggle, #theme-toggle-mobile').forEach(function (b) {
        b.addEventListener('click', function () { setTheme(root.classList.contains('dark') ? 'light' : 'dark'); });
    });

    /* ---------- 11. Active nav link ---------- */
    if ('IntersectionObserver' in window) {
        var links = $$('a.navlink');
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                links.forEach(function (l) {
                    if (l.getAttribute('href') === '#' + e.target.id) l.setAttribute('aria-current', 'page');
                    else l.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        ['home', 'about', 'services', 'packages', 'projects', 'contact'].forEach(function (id) {
            var s = document.getElementById(id); if (s) spy.observe(s);
        });
    }

    /* ---------- 12. WhatsApp enquiry form ---------- */
    var waForm = $('#waForm');
    if (waForm) {
        waForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var get = function (n) { var el = waForm.elements[n]; return el ? String(el.value || '').trim() : ''; };
            var err = $('#formError');
            if (!get('name')) { if (err) err.textContent = 'Please enter your name.'; waForm.elements.name.focus(); return; }
            if (err) err.textContent = '';
            var lines = ['Hi Hikma, my name is ' + get('name') + '.', "I'm interested in: " + get('service')];
            if (get('budget')) lines.push('Budget: ' + get('budget'));
            if (get('date')) lines.push('Deadline: ' + get('date'));
            if (get('message')) lines.push('', get('message'));
            window.open('https://wa.me/94743890704?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
        });
    }

    /* ---------- 13. Package prices count up when they scroll into view ---------- */
    var prices = $$('[data-price]');
    if (prices.length && 'IntersectionObserver' in window && !reduce) {
        var fmt = function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
        var pio = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target, target = parseInt(el.getAttribute('data-price'), 10), start = null;
                el.classList.add('counting');
                var step = function (t) {
                    if (!start) start = t;
                    var p = Math.min((t - start) / 1400, 1);
                    el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) requestAnimationFrame(step); else setTimeout(function () { el.classList.remove('counting'); }, 400);
                };
                requestAnimationFrame(step);
                pio.unobserve(el);
            });
        }, { threshold: 0.6 });
        prices.forEach(function (el) { pio.observe(el); });
    }
})();
