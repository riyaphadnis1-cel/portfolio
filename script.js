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

const cursorSquare = document.createElement('span');
cursorSquare.className = 'cursor-square';

const cursorLabel = document.createElement('span');
cursorLabel.className = 'cursor-label';

cursor.appendChild(cursorSquare);
cursor.appendChild(cursorLabel);
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursor.classList.add('visible');
});

document.addEventListener('mouseleave', () => {
  cursor.classList.remove('visible');
});

// Hero hover spotlight effects
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

// Project cards cursor hover: smaller square + label in #F15013 (no pill)
document.addEventListener('mouseover', (e) => {
  const card = e.target.closest('.project-card');
  if (card) {
    cursor.classList.add('project-hover');
    cursorLabel.textContent = card.dataset.cursor || 'View Project';
  } else if (e.target.closest('a, button')) {
    cursor.classList.add('link-hover');
  }
});

document.addEventListener('mouseout', (e) => {
  const card = e.target.closest('.project-card');
  if (card && !card.contains(e.relatedTarget)) {
    cursor.classList.remove('project-hover');
    cursorLabel.textContent = '';
  }
  if (e.target.closest('a, button') && !e.target.closest('a, button').contains(e.relatedTarget)) {
    cursor.classList.remove('link-hover');
  }
});
