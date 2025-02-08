import { fetchJSON, renderProjects } from '../global.js';

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');

projectsTitle.textContent = `Projects (${projects.length})`;

let selectedIndex = -1;
let colors = d3.scaleOrdinal().range(d3.schemeBlues[6]);

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcGenerator = d3.arc().innerRadius(30).outerRadius(50);
    let newArcs = newArcData.map((d) => newArcGenerator(d));
 
    let newSVG = d3.select('#projects-plot'); 
    newSVG.selectAll('path').remove();
    let newLegend = d3.select('.legend'); 
    newLegend.selectAll('li').remove();

    newArcs.forEach((arc, idx) => {
        newSVG.append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
            
                newSVG
                    .selectAll('path')
                    .attr('class', (_, aIdx) => (
                        aIdx === selectedIndex ? 'selected' : ''
                    ));
                newLegend
                    .selectAll('li')
                    .attr('class', (_, lIdx) => (lIdx === selectedIndex ? 'selected' : ''));

                let currentQuery = searchInput.value.toLowerCase();
                let filteredProjects = projects;
                
                if (currentQuery) {
                    filteredProjects = filteredProjects.filter(project => {
                        let values = Object.values(project).join('\n').toLowerCase();
                        return values.includes(currentQuery);
                    });
                }
                
                if (selectedIndex !== -1) {
                    let selectedYear = newData[selectedIndex].label;
                    filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
                }
                
                renderProjects(filteredProjects, projectsContainer, 'h2');
            });
    });

    newData.forEach((d, idx) => {
        newLegend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;

                newSVG
                    .selectAll('path')
                    .attr('class', (_, aIdx) => (
                        aIdx === selectedIndex ? 'selected' : ''
                    ));
                newLegend
                    .selectAll('li')
                    .attr('class', (_, lIdx) => (lIdx === selectedIndex ? 'selected' : ''));

                // if (selectedIndex === -1) {
                //     renderProjects(projects, projectsContainer, 'h2');
                // } else {
                //     let selectedYear = newData[selectedIndex].label;
                //     let filteredProjects = projects.filter((project) => project.year === selectedYear);
                //     renderProjects(filteredProjects, projectsContainer, 'h2');
                // }

                let currentQuery = searchInput.value.toLowerCase();
                let filteredProjects = projects;
                
                if (currentQuery) {
                    filteredProjects = filteredProjects.filter(project => {
                        let values = Object.values(project).join('\n').toLowerCase();
                        return values.includes(currentQuery);
                    });
                }
                
                if (selectedIndex !== -1) {
                    let selectedYear = newData[selectedIndex].label;
                    filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
                }
                
                renderProjects(filteredProjects, projectsContainer, 'h2');
            });
    });
}
renderPieChart(projects);

const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('change', (event) => {
    let query = event.target.value.toLowerCase();
  
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    console.log(filteredProjects)

    renderProjects(filteredProjects, projectsContainer, 'h2');

    renderPieChart(filteredProjects);
});

