const projects = document.getElementById('projects');
const toggle = document.getElementById('open-button');

toggle.addEventListener('click', () =>
  projects.classList.add('expand-projects')
);
