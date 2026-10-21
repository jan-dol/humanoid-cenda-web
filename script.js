document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('nav');
    if (toggle && nav) {
        const setOpen = (open) => {
            nav.classList.toggle('active', open);
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
        };
        toggle.addEventListener('click', () => setOpen(!nav.classList.contains('active')));
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    }

    // Reveal on scroll
    const items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach((el, i) => {
            el.style.transitionDelay = `${(i % 4) * 70}ms`;
            io.observe(el);
        });
    } else {
        items.forEach(el => el.classList.add('in'));
    }
});
