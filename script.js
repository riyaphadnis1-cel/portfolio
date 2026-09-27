const themeButton = document.querySelector('.theme-button');
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeButton.textContent = document.body.classList.contains('light') ? '◑' : '◔';
});
