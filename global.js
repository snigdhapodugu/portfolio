console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a")
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add('current');

let pages = [
    { url: '', title: 'Home' },
    { url: 'resume/', title: 'Resume' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/snigdhapodugu', title: 'Github' },
];

let nav = document.createElement('nav');

document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle('current',
        a.host === location.host && a.pathname === location.pathname
    );
    if (a.host && a.host !== location.host) {
        a.target = '_blank';
    }
    nav.append(a);
}

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

const automaticLabel = isDarkMode ? "Automatic (Dark)" : "Automatic (Light)";

document.body.insertAdjacentHTML(
  "afterbegin",
  `
    <label class="color-scheme-theme">
        Theme: 
        <select class="color-scheme-select" id="theme-selector">
            <option value="light dark">${automaticLabel}</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
  `
);

const select = document.querySelector('#theme-selector');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  select.value = colorScheme;
  localStorage.colorScheme = colorScheme;
}

select.addEventListener('input', function(event) {
  setColorScheme(event.target.value);
  console.log('color scheme changed to', event.target.value);
});

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

const form = document.querySelector('form[action="mailto:spodugu@ucsd.edu"]');

form?.addEventListener('submit', function(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  let url = form.action + '?';
  
  for (let [name, value] of data) {
    url += `${name}=${encodeURIComponent(value)}` + '&';
    console.log(name, value);
  }

  location.href = url;
});