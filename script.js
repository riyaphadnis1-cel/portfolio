const themeButton = document.querySelector('.theme-button');
const menuButton = document.querySelector('.menu-button');
const header = document.querySelector('.site-header');
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeButton.textContent = document.body.classList.contains('light') ? '◑' : '◔';
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
