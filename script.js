const open = document.getElementById('open');
const expandCards = document.getElementById('expand-cards');
const close = document.getElementById('close');

// Expand cards-section
open.addEventListener('click', () => {
  expandCards.classList.add('show-cards');
  open.classList.add('hide');
  close.classList.remove('hide');
});

// Hide cards-section
close.addEventListener('click', () => {
  expandCards.classList.remove('show-cards');
  close.classList.add('hide');
  open.classList.remove('hide');
});
