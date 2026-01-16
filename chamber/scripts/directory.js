// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navUL = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navUL.classList.toggle('open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    navUL.classList.remove('open');
    hamburger.classList.remove('active');
  }
});

// Grid/List toggle
const gridBtn = document.getElementById('gridView');
const listBtn = document.getElementById('listView');
const membersSection = document.getElementById('members');

gridBtn.addEventListener('click', () => {
  membersSection.classList.add('grid');
  membersSection.classList.remove('list');
});
listBtn.addEventListener('click', () => {
  membersSection.classList.add('list');
  membersSection.classList.remove('grid');
});

gridBtn.addEventListener('click', () => {
  membersSection.classList.add('grid');
  membersSection.classList.remove('list');
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
  membersSection.classList.add('list');
  membersSection.classList.remove('grid');
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
});


// Footer Date
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Fetch and display members
async function loadMembers() {
  const response = await fetch('data/members.json');
  const members = await response.json();
  displayMembers(members);
}

function displayMembers(members) {
  const container = document.getElementById('members');
  container.innerHTML = '';

  members.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name}">
      <h2>${member.name}</h2>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Membership Level:</strong> ${member.membership}</p>
      <p>${member.description}</p>
    `;
    container.appendChild(card);
  });
}

loadMembers();
