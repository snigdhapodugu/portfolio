import { fetchJSON, renderProjects } from '../global.js';
import { fetchGitHubData } from './global.js';

const projects = await fetchJSON('../lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

projectsContainer.innerHTML = '';

for (let project of latestProjects) {
    renderProjects(project, projectsContainer, 'h3');
}

const profileStats = document.querySelector('#profile-stats dl');

const githubData = await fetchGitHubData('snigdhapodugu');

if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
    `;
    console.log('hi');
}