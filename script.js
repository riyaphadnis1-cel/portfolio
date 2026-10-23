// Theme toggling with local storage persistence
const themeButton = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
}

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Mobile navigation menu
const menuButton = document.getElementById('menu-toggle');
const header = document.querySelector('.site-header');

if (menuButton && header) {
  menuButton.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });
}

// Nav link clicking & smooth navigation
const navLinks = document.querySelectorAll('nav a');
const navHome = document.getElementById('nav-home');
const navProjects = document.getElementById('nav-projects');

function setActiveNav(targetId) {
  navLinks.forEach(link => link.classList.remove('active'));
  if (targetId === '#home' && navHome) {
    navHome.classList.add('active');
  } else if (targetId === '#projects' && navProjects) {
    navProjects.classList.add('active');
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    if (header) {
      header.classList.remove('menu-open');
    }
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }

    const href = link.getAttribute('href');
    if (href === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', '#home');
      setActiveNav('#home');
    } else if (href === '#projects') {
      e.preventDefault();
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const headerHeight = header ? header.offsetHeight : 100;
        const targetTop = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        history.pushState(null, '', '#projects');
        setActiveNav('#projects');
      }
    }
  });
});

// Brand click to scroll top
const brandLink = document.getElementById('brand-link');
if (brandLink) {
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', '#home');
    setActiveNav('#home');
  });
}

// Update active navbar indicator on scroll
let isScrollingTimer;
function onScroll() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  const headerHeight = header ? header.offsetHeight : 100;
  const projectsRect = projectsSection.getBoundingClientRect();

  // If top of projects section is near or above header bottom
  if (projectsRect.top <= headerHeight + 50) {
    setActiveNav('#projects');
  } else {
    setActiveNav('#home');
  }
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(onScroll);
}, { passive: true });

// Custom Cursor Implementation
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Hero hover effects
const heroSection = document.getElementById('hero-section');
if (heroSection) {
  heroSection.addEventListener('mouseenter', () => {
    cursor.classList.add('visible', 'dot-mode');
    cursor.textContent = '';
  });
  heroSection.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible', 'dot-mode');
  });
}

const heroH1 = document.querySelector('.hero h1');
if (heroH1) {
  heroH1.addEventListener('mousemove', (e) => {
    const rect = heroH1.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroH1.style.setProperty('--mouseX', `${x}px`);
    heroH1.style.setProperty('--mouseY', `${y}px`);
  });
}

// Project cards cursor hover
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    cursor.classList.add('visible');
    cursor.classList.remove('dot-mode');
    cursor.textContent = card.dataset.cursor || 'View Project';
  });
  card.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });
});
