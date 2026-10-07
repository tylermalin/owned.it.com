'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reveals content as it scrolls into view. Opt-in elements use `data-reveal-target`;
 * sections inside <main> and their card grids are picked up automatically.
 * Anything already on screen at load is left alone, so there is no flash above the fold.
 */
export function Motion() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const root = document.getElementById('main');
        if (!root) return;

        const candidates = new Set<HTMLElement>();
        root.querySelectorAll<HTMLElement>('[data-reveal-target], section > div > h2, section > div > p, section .grid > *').forEach((el) =>
            candidates.add(el),
        );

        const fold = window.innerHeight;
        const targets: HTMLElement[] = [];
        candidates.forEach((el) => {
            if (el.closest('[data-no-reveal]')) return;
            if (el.getBoundingClientRect().top < fold * 0.9) return; // already visible
            // stagger siblings in the same grid
            const parent = el.parentElement;
            const index = parent && parent.classList.contains('grid') ? Array.from(parent.children).indexOf(el) : 0;
            el.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
            el.setAttribute('data-reveal', '');
            targets.push(el);
        });

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-revealed');
                        io.unobserve(e.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
        );
        targets.forEach((t) => io.observe(t));

        return () => {
            io.disconnect();
            targets.forEach((t) => {
                t.removeAttribute('data-reveal');
                t.classList.remove('is-revealed');
            });
        };
    }, [pathname]);

    return null;
}
