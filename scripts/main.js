/* PART 1: GLOBAL NAVIGATION & FOOTER (Runs on every page) */
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('nav ul');

  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      navUl.classList.toggle('open');
      const isOpen = navUl.classList.contains('open');
      hamburger.textContent = isOpen ? '✖' : '☰';
      hamburger.setAttribute('aria-expanded', isOpen); // Accessibility improvement
    });
  }

  // Update Footer Dates
  const yearSpan = document.getElementById('currentyear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const modSpan = document.getElementById('lastModified');
  if (modSpan) modSpan.textContent = document.lastModified;

  // Check Local Storage for user preference/history
  checkLocalStorage();
});

/* PART 2: DATA FETCHING & DISPLAY (Runs on Services Page) */
if (document.getElementById('cruise-container') ||
    document.getElementById('servicename')) {
  getCruiseData();
}
/*video note: This function is where we fetch our data and handle errors gracefully*/
async function getCruiseData() {
  try {
    const response = await fetch('./data/cruises.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (document.getElementById('cruise-container')) {
      displayCruises(data);
      setupFilters(data);
    }

    if (document.getElementById('servicename')) {
      populateFormOptions(data);
    }

  } catch (error) {
    console.error('Error fetching data:', error);

    const container = document.getElementById('cruise-container');
    if (container) {
      container.innerHTML =
        '<p>Sorry, we could not load the cruises at this time.</p>';
    }
  }
}
/*video note: This function takes the cruise data and creates HTML cards for each cruise, then adds event listeners to the buttons to open the modal with details*/
function displayCruises(cruises) {
  const cruiseContainer = document.getElementById('cruise-container');
  if (!cruiseContainer) return;

  cruiseContainer.innerHTML = '';

  cruises.forEach(cruise => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      <img src="${cruise.image}" alt="${cruise.name}" loading="lazy">
      <h3>${cruise.name}</h3>
      <p class="price">${cruise.price}</p>
      <p>${cruise.description.substring(0, 80)}...</p>
      <button class="cta-button open-modal-btn" data-id="${cruise.id}">
        View Details
      </button>
    `;
    cruiseContainer.appendChild(card);
  });

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cruiseId = e.target.dataset.id;
      const cruiseDetails = cruises.find(c => c.id === cruiseId);
      openModal(cruiseDetails);
    });
  });
}
/* PART 3: ARRAY METHODS & FILTERING */
function setupFilters(allCruises) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;
      if (category === 'all') {
        displayCruises(allCruises);
      } else {
        const filtered = allCruises.filter(cruise => cruise.type === category);
        displayCruises(filtered);
      }
    });
  });
}

/* PART 4: MODAL DIALOG INTERACTION */
const modal = document.getElementById('cruise-modal');
const closeModalBtn = document.getElementById('close-modal');

function openModal(cruise) {
  if (!modal) return;
  document.getElementById('modal-title').textContent = cruise.name;
  document.getElementById('modal-desc').textContent = cruise.description;
  document.getElementById('modal-duration').textContent = cruise.duration;
  document.getElementById('modal-price').textContent = cruise.price;
  modal.showModal();
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    modal.close();
  });
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });
}

/* PART 5: LOCAL STORAGE & FORM POPULATION */
function populateFormOptions(cruises) {
  const select = document.getElementById('servicename');
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>Choose a Service ...</option>';
  cruises.forEach(cruise => {
    const option = document.createElement('option');
    option.value = cruise.name;
    option.textContent = `${cruise.name} (${cruise.price})`;
    select.appendChild(option);
  });
}

function checkLocalStorage() {
  const now = new Date();
  localStorage.setItem('lastVisit', now.toISOString());
  console.log("Visit logged to Local Storage");
}

/* PART 6: BOOKING CONFIRMATION PAGE*/
const currentUrl = window.location.href;
if (currentUrl.includes('?')) {
  const queryString = currentUrl.split('?')[1];
  const formData = queryString.split('&');
  const display = document.getElementById('booking-details');

  if (display) {
    formData.forEach(element => {
      const [key, value] = element.split('=');
      if (value) {
        const cleanKey = decodeURIComponent(key);
        const cleanVal = decodeURIComponent(value.replace(/\+/g, ' '));
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = cleanKey + ': ';
        p.appendChild(strong);
        p.appendChild(document.createTextNode(cleanVal));
        display.appendChild(p);
      }
    });
  }
}