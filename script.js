const themeButton = document.querySelector('.theme-button');
const menuButton = document.querySelector('.menu-button');
const header = document.querySelector('.site-header');

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

menuButton.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '×' : '☰';
});

document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));

// Custom Cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('.project-art').forEach(art => {
    art.addEventListener('mouseenter', (e) => {
        cursor.classList.add('visible');
        cursor.textContent = art.classList.contains('art-unibridge') ? 'Coming soon!' : 'View Project';
    });
    art.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
    });
});
