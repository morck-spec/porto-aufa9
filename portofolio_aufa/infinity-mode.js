/* ==========================================================================
   INFINITY MODE — GOJO SATORU SYSTEM (CONTROLLER)
   --------------------------------------------------------------------------
   Satu sumber state: body.infinity-active
     Normal   : <body>
     Infinity : <body class="infinity-active">

   Alur toggle:
     klik tombol → halaman blur + glow cyan/purple menyebar dari tombol
     → (midpoint) class body ditukar, label UI ditukar, partikel disesuaikan
     → blur dilepas → overlay memudar  (± 950ms total)

   State disimpan di localStorage sehingga tetap aktif setelah refresh.
   Inline script di awal <body> sudah memasang class sebelum first paint.
   ========================================================================== */

(function () {
    'use strict';

    const CONFIG = {
        activeClass: 'infinity-active',
        transitioningClass: 'gs-transitioning',
        storageKey: 'aufa-infinity-mode',
        timing: {
            switchAt: 460,   // ms — tukar UI saat layar tertutup glow
            unblurAt: 600,   // ms — lepas blur halaman
            total: 950       // ms — akhir transisi
        },
        copy: {
            enter: { title: '無量空処', sub: 'DOMAIN EXPANSION · UNLIMITED VOID' },
            exit:  { title: '∞ RELEASE', sub: 'RETURNING TO NORMAL PORTFOLIO' }
        }
    };

    function init() {
        const body = document.body;
        const toggleBtn = document.getElementById('zero-g-toggle');
        const overlay = document.getElementById('gs-transition');
        const overlayTitle = document.getElementById('gs-transition-title');
        const overlaySub = document.getElementById('gs-transition-sub');

        if (!toggleBtn) {
            console.warn('[Infinity Mode] Tombol #zero-g-toggle tidak ditemukan.');
            return;
        }

        const reduceMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let isActive = body.classList.contains(CONFIG.activeClass);
        let isTransitioning = false;

        /* ---------- UI helpers ---------- */

        // Tukar label berbasis atribut data-normal / data-gojo (hanya label UI, bukan konten portfolio)
        function swapLabels(active) {
            document.querySelectorAll('[data-normal][data-gojo]').forEach((el) => {
                const next = el.getAttribute(active ? 'data-gojo' : 'data-normal');
                if (next !== null && el.textContent !== next) el.textContent = next;
            });
        }

        function syncButton(active) {
            const label = toggleBtn.querySelector('.btn-text');
            const icon = toggleBtn.querySelector('.btn-mode-icon');

            if (label) label.textContent = active ? 'Exit Infinity' : 'Infinity Mode';
            if (icon) icon.className = (active ? 'fa-solid fa-infinity' : 'fa-solid fa-eye') + ' btn-mode-icon';

            toggleBtn.classList.toggle('active-gojo-btn', active);
            toggleBtn.setAttribute('aria-pressed', String(active));
            toggleBtn.setAttribute('title', active
                ? 'Keluar dari Infinity Mode (kembali ke Normal Mode)'
                : 'Aktifkan Infinity Mode (Gojo Satoru System)');
        }

        function persist(active) {
            try { localStorage.setItem(CONFIG.storageKey, active ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
        }

        function syncParticles(active) {
            if (typeof window.toggleCanvasZeroG === 'function') window.toggleCanvasZeroG(active);
        }

        // Terapkan state secara langsung (tanpa animasi)
        function applyMode(active) {
            isActive = active;
            body.classList.toggle(CONFIG.activeClass, active);
            swapLabels(active);
            syncButton(active);
            syncParticles(active);
            persist(active);
            document.dispatchEvent(new CustomEvent('infinitymodechange', { detail: { active } }));
        }

        // Titik asal glow = tengah tombol
        function setOrigin() {
            const r = toggleBtn.getBoundingClientRect();
            overlay.style.setProperty('--gs-x', `${r.left + r.width / 2}px`);
            overlay.style.setProperty('--gs-y', `${r.top + r.height / 2}px`);
        }

        /* ---------- Toggle with Unlimited Void transition ---------- */

        function toggle() {
            if (isTransitioning) return;
            const target = !isActive;

            if (reduceMotion || !overlay) {
                applyMode(target);
                return;
            }

            isTransitioning = true;
            const copy = target ? CONFIG.copy.enter : CONFIG.copy.exit;
            if (overlayTitle) overlayTitle.textContent = copy.title;
            if (overlaySub) overlaySub.textContent = copy.sub;

            setOrigin();
            overlay.classList.remove('is-running', 'is-enter', 'is-exit');
            void overlay.offsetWidth; // restart CSS animation
            overlay.classList.add('is-running', target ? 'is-enter' : 'is-exit');
            body.classList.add(CONFIG.transitioningClass);

            setTimeout(() => applyMode(target), CONFIG.timing.switchAt);
            setTimeout(() => body.classList.remove(CONFIG.transitioningClass), CONFIG.timing.unblurAt);
            setTimeout(() => {
                overlay.classList.remove('is-running', 'is-enter', 'is-exit');
                isTransitioning = false;
            }, CONFIG.timing.total);
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggle();
        });

        /* ---------- Initial sync (state restored from localStorage) ---------- */
        if (isActive) {
            swapLabels(true);
            syncParticles(true);
        }
        syncButton(isActive);

        // Small public API (useful for testing / other scripts)
        window.InfinityMode = {
            toggle,
            isActive: () => isActive,
            set: (value) => { if (Boolean(value) !== isActive) toggle(); }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
