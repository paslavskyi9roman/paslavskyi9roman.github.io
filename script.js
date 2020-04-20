const toggle = document.getElementById('open-button');
const projects = document.getElementsByClassName('projects');

toggle.addEventListener('click', () => {
  projects.classList.add('expand');
});
