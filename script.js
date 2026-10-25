// Theme toggling with local storage persistence
const themeButton = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.documentElement.classList.add('light');
  document.body.classList.add('light');
}

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    document.documentElement.classList.toggle('light', isLight);
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

// Vertical Roadmap Navigation & Case Study Back Button Logic
const roadmap = document.querySelector('.project-roadmap');
const caseStudyBackBtn = document.getElementById('project-back-btn');

let lastScrollY = window.pageYOffset;
let isNavigatingViaClick = false;

function setCaseStudyNavVisible(show) {
  if (roadmap) {
    roadmap.classList.toggle('visible', show);
  }
  if (caseStudyBackBtn) {
    caseStudyBackBtn.classList.toggle('visible', show);
  }
}

if (roadmap || caseStudyBackBtn) {
  // Only show vertical nav and Back button when user scrolls UP; hide when scrolling DOWN or at top
  function handleCaseStudyScrollDirection() {
    if (isNavigatingViaClick) return;

    const currentScrollY = window.pageYOffset;
    const diff = currentScrollY - lastScrollY;

    // At or near the top of the case study: always hide
    if (currentScrollY <= 60) {
      setCaseStudyNavVisible(false);
      lastScrollY = currentScrollY;
      return;
    }

    // Meaningful scroll threshold to avoid micro-jitter
    if (Math.abs(diff) > 4) {
      if (diff < 0) {
        // Scrolling UP -> SHOW
        setCaseStudyNavVisible(true);
      } else {
        // Scrolling DOWN -> HIDE
        setCaseStudyNavVisible(false);
      }
      lastScrollY = currentScrollY;
    }
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(handleCaseStudyScrollDirection);
  }, { passive: true });

  // Initial check on load
  handleCaseStudyScrollDirection();
}

if (roadmap) {
  const roadmapNodes = Array.from(roadmap.querySelectorAll('.roadmap-node'));
  const roadmapSections = roadmapNodes.map(node => {
    const id = node.getAttribute('data-target');
    return {
      node,
      id,
      elem: document.getElementById(id)
    };
  }).filter(item => item.elem !== null);

  // Smooth scroll on roadmap node click
  roadmapNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = node.getAttribute('data-target');
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        isNavigatingViaClick = true;
        setCaseStudyNavVisible(true);

        const headerElem = document.querySelector('.site-header');
        const headerHeight = headerElem ? headerElem.offsetHeight : 0;
        const targetTop = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });

        roadmapNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        // Reset click navigation flag once smooth scrolling completes
        setTimeout(() => {
          isNavigatingViaClick = false;
          lastScrollY = window.pageYOffset;
        }, 850);
      }
    });
  });

  // Scrollspy tracking
  function updateRoadmapScrollspy() {
    const headerElem = document.querySelector('.site-header');
    const headerHeight = headerElem ? headerElem.offsetHeight : 0;
    const triggerY = window.pageYOffset + headerHeight + 100;

    let currentSection = roadmapSections[0];
    for (let i = 0; i < roadmapSections.length; i++) {
      const top = roadmapSections[i].elem.offsetTop;
      if (triggerY >= top) {
        currentSection = roadmapSections[i];
      }
    }

    // If near bottom of the page, activate the last section
    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 150) {
      currentSection = roadmapSections[roadmapSections.length - 1];
    }

    if (currentSection) {
      roadmapSections.forEach(({ node }) => {
        if (node === currentSection.node) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateRoadmapScrollspy);
  }, { passive: true });

  window.addEventListener('resize', updateRoadmapScrollspy, { passive: true });
  updateRoadmapScrollspy();
}

