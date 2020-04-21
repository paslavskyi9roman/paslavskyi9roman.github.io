const toggle = document.getElementById('toggle');
const expandCards = document.getElementById('expand-cards');
const close = document.getElementById('close');

// Expand cards-section
toggle.addEventListener('click', () => {
  expandCards.classList.add('show-cards');
  toggle.classList.add('hide');
});

// Hide cards-section
close.addEventListener('click', () => {
  expandCards.classList.remove('show-cards');
  toggle.classList.remove('hide');
});
