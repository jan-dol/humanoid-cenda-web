document.documentElement.classList.add('js');

/* ---------- Reveal on scroll ---------- */
let io = null;
function observeReveal(root = document) {
    const items = root.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    if (!io) {
        io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    items.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 70}ms`;
        io.observe(el);
    });
}

/* ---------- Team (loaded from team.json, edited via admin.html) ---------- */
function initials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function memberCard(m) {
    const card = document.createElement('article');
    card.className = 'member reveal' + (m.role ? ' lead-member' : '');

    if (m.photo) {
        const img = document.createElement('img');
        img.src = m.photo;
        img.alt = m.name;
        img.loading = 'lazy';
        card.appendChild(img);
    } else {
        const av = document.createElement('div');
        av.className = 'avatar';
        av.setAttribute('aria-hidden', 'true');
        av.textContent = initials(m.name);
        card.appendChild(av);
    }

    const info = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = m.name;
    info.appendChild(h);
    if (m.role) {
        const r = document.createElement('p');
        r.className = 'role';
        r.textContent = m.role;
        info.appendChild(r);
    }
    if (m.school) {
        const sc = document.createElement('p');
        sc.className = 'school';
        sc.textContent = m.school;
        info.appendChild(sc);
    }
    card.appendChild(info);
    return card;
}

async function loadTeam() {
    const list = document.getElementById('team-list');
    if (!list) return;
    try {
        const res = await fetch('team.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        list.replaceChildren(...(data.members || []).map(memberCard));
        observeReveal(list);
    } catch (e) {
        list.innerHTML = '<p class="team-status">Tým se nepodařilo načíst.</p>';
    }
}

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

    observeReveal();
    loadTeam();
});
