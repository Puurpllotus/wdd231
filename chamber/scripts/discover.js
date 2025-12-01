import { places } from '../data/places.mjs';

const hamburger = document.getElementById("ham-btn");
const navUL = document.querySelector("#nav-bar ul");

if (hamburger && navUL) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navUL.classList.toggle("open");
    });
}

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

const container = document.getElementById('places-container');

places.forEach((place, index) => {
    const card = document.createElement('div');
    card.classList.add('place-card');
    card.classList.add(`area-${index + 1}`); 

    const title = document.createElement('h2');
    title.textContent = place.name;

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = place.image;
    img.alt = place.name;
    img.loading = "lazy";
    img.width = 300;
    img.height = 200;
    figure.appendChild(img);

    const address = document.createElement('address');
    address.textContent = place.address;

    const desc = document.createElement('p');
    desc.textContent = place.description;

    const btn = document.createElement('button');
    btn.textContent = "Learn More";
    btn.addEventListener('click', () => alert(`You clicked on ${place.name}`));

    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(desc);
    card.appendChild(btn);

    container.appendChild(card);
});

const messageDisplay = document.getElementById('visitor-message');
const lastVisit = localStorage.getItem('lastVisit');
const now = Date.now();

if (!lastVisit) {
    messageDisplay.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const diffTime = now - parseInt(lastVisit);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        messageDisplay.textContent = "Back so soon! Awesome!";
    } else {
        const dayString = diffDays === 1 ? "day" : "days";
        messageDisplay.textContent = `You last visited ${diffDays} ${dayString} ago.`;
    }
}

// Store current date for next time
localStorage.setItem('lastVisit', now);