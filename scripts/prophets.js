const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {

    // Create elements
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let birthInfo = document.createElement('p');
    let placeInfo = document.createElement('p');
    let portrait = document.createElement('img');

    // Full name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Date of Birth
    birthInfo.textContent = `Date of Birth: ${prophet.birthdate}`;

    // Place of Birth
    placeInfo.textContent = `Place of Birth: ${prophet.birthplace}`;

    // Image
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '200');

    // Append items into card
    card.appendChild(fullName);
    card.appendChild(birthInfo);
    card.appendChild(placeInfo);
    card.appendChild(portrait);

    // Add card to container
    cards.appendChild(card);

  });
}

getProphetData();
