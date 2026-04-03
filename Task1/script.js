// ── 1. CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .project-pill, .service-card, .contact-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// ── 2. NAV GLASS HOVER EFFECT ──
const navLinks = document.getElementById('navLinks');
const navHover = document.getElementById('navHover');
const links = navLinks.querySelectorAll('li a:not(.lets-talk-btn)');

function moveHover(el) {
    const navRect = navLinks.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    navHover.style.opacity = '1';
    navHover.style.left = (rect.left - navRect.left) + 'px';
    navHover.style.top = (rect.top - navRect.top) + 'px';
    navHover.style.width = rect.width + 'px';
    navHover.style.height = rect.height + 'px';
}

links.forEach(link => {
    link.addEventListener('mouseenter', () => moveHover(link));
});

navLinks.addEventListener('mouseleave', () => {
    navHover.style.opacity = '0';
});

// ── 3. MOBILE MENU ──
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ── 4. CAROUSEL LOGIC ──
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
let current = 0;
const cards = track.querySelectorAll('.service-card');
const total = cards.length;

function getCardWidth() {
    const card = cards[0];
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return card.offsetWidth + gap;
}

function goTo(idx) {
    current = (idx + total) % total;
    const offset = getCardWidth() * current;
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));

dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx)));
});

// Auto-advance
let autoplay = setInterval(() => goTo(current + 1), 4000);
track.addEventListener('mouseenter', () => clearInterval(autoplay));
track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 4000);
});

// ── 5. DRAGGABLE "LET'S TALK" MODAL ──
const overlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const modalHandle = document.getElementById('modalHandle');

function openModal() {
    overlay.classList.add('open');
    modalBox.style.left = '50%';
    modalBox.style.top = '50%';
    modalBox.style.transform = 'translate(-50%, -50%)';
}

document.getElementById('openModal').addEventListener('click', e => {
    e.preventDefault(); openModal();
});

if(document.getElementById('openModalMobile')) {
    document.getElementById('openModalMobile').addEventListener('click', e => {
        e.preventDefault(); openModal();
    });
}

document.getElementById('modalClose').addEventListener('click', () => {
    overlay.classList.remove('open');
});

overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
});

// Drag Logic
let isDragging = false, dragOffX = 0, dragOffY = 0;

modalHandle.addEventListener('mousedown', e => {
    isDragging = true;
    const rect = modalBox.getBoundingClientRect();
    modalBox.style.transform = 'none';
    modalBox.style.left = rect.left + 'px';
    modalBox.style.top = rect.top + 'px';
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;
    e.preventDefault();
});

document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    let nx = e.clientX - dragOffX;
    let ny = e.clientY - dragOffY;
    modalBox.style.left = nx + 'px';
    modalBox.style.top = ny + 'px';
});

document.addEventListener('mouseup', () => { isDragging = false; });

// ── 6. SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── 7. PDF MODAL LOGIC ──
const pdfOverlay = document.getElementById('pdfOverlay');
const pdfViewContainer = document.getElementById('pdfViewContainer');
const pdfCloseBtn = document.getElementById('pdfCloseBtn');

const pdfFiles = {
    cv: 'TheCV.pdf',
    antiCv: 'AntiCV.pdf'
};

function openPDF(fileType) {
    const filePath = pdfFiles[fileType];
    pdfViewContainer.innerHTML = `<iframe src="${filePath}" width="100%" height="100%" style="border:none;"></iframe>`;
    pdfOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.getElementById('viewCV').addEventListener('click', (e) => {
    e.preventDefault(); openPDF('cv');
});

document.getElementById('viewAntiCV').addEventListener('click', (e) => {
    e.preventDefault(); openPDF('antiCv');
});

function closePDF() {
    pdfOverlay.style.display = 'none';
    pdfViewContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
}

pdfCloseBtn.addEventListener('click', closePDF);
pdfOverlay.addEventListener('click', (e) => {
    if (e.target === pdfOverlay) closePDF();
});