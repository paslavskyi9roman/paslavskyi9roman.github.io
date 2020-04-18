const header = document.querySelector('.header');
const hero = document.querySelector('welcome-section');
const tl = new TimelineMax();

tl.fromTo(
  header,
  1,
  { height: '0%' },
  { height: '80%', ease: Power2.easeInOut }
).fromTo(hero, 1, { height: '0%' }, { height: '80%', ease: Power2.easeInOut });
