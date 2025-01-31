import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

projectsContainer.innerHTML = '';

for (let project of projects) {
    renderProjects(project, projectsContainer, 'h2');
}

const projectsTitle = document.querySelector('.projects-title');

projectsTitle.textContent = `Projects (${projects.length})`;