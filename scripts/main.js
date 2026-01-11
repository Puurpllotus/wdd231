// VIDEO NOTE: This is an ES Module, allowing us to organize code effectively.
// We are using 'strict' mode implicitly with modules.

/* -------------------------------------------------------------------------- */
/* PART 1: GLOBAL NAVIGATION & FOOTER (Runs on every page)                    */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // VIDEO NOTE: DOM Manipulation - Selecting elements using querySelector
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');

    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            // VIDEO NOTE: Toggling classes to animate the mobile menu
            navUl.classList.toggle('open');
            const isOpen = navUl.classList.contains('open');
            hamburger.textContent = isOpen ? '✖' : '☰';
        });
    }

    // Update Footer Dates
    // VIDEO NOTE: Using the Date object to dynamically set the copyright year
    const yearSpan = document.getElementById('currentyear');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    const modSpan = document.getElementById('lastModified');
    if(modSpan) modSpan.textContent = document.lastModified;

    // Check Local Storage for user preference/history
    checkLocalStorage();
});

/* -------------------------------------------------------------------------- */
/* PART 2: DATA FETCHING & DISPLAY (Runs on Services Page)                    */
/* -------------------------------------------------------------------------- */

// Select the container where cards will go
const cruiseContainer = document.getElementById('cruise-container');

// Only run this code if the container exists (i.e., we are on the Services page)
if (cruiseContainer) {
    getCruiseData();
}

// VIDEO NOTE: Asynchronous Function to fetch JSON data
async function getCruiseData() {
    try {
        // VIDEO NOTE: Using fetch() to retrieve data from 'cruises.json'
        // This simulates getting data from an external API.
        const response = await fetch('data/cruises.json');
        
        // VIDEO NOTE: Error handling - checking if the network response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // VIDEO NOTE: Await the JSON parsing
        const data = await response.json();
        
        // VIDEO NOTE: Call function to render HTML based on the data
        displayCruises(data);
        
        // Setup filter buttons
        setupFilters(data);

        // Populate the form dropdown (if it exists on this page)
        populateFormOptions(data);

    } catch (error) {
        // VIDEO NOTE: The 'Catch' block handles errors gracefully
        console.error('Error fetching data:', error);
        cruiseContainer.innerHTML = '<p>Sorry, we could not load the cruises at this time. Please try again later.</p>';
    }
}

// VIDEO NOTE: Function to generate HTML dynamically
function displayCruises(cruises) {
    cruiseContainer.innerHTML = ''; // Clear existing content
    
    // VIDEO NOTE: Using the .forEach() Array method to loop through data
    cruises.forEach(cruise => {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        // VIDEO NOTE: Using Template Literals (backticks) to insert variables
        card.innerHTML = `
            <img src="${cruise.image}" alt="${cruise.name}" loading="lazy">
            <h3>${cruise.name}</h3>
            <p class="price">${cruise.price}</p>
            <p>${cruise.description.substring(0, 80)}...</p>
            <button class="cta-button open-modal-btn" data-id="${cruise.id}">View Details</button>
        `;
        cruiseContainer.appendChild(card);
    });

    // Attach event listeners to the new buttons for the Modal
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cruiseId = e.target.dataset.id;
            // VIDEO NOTE: Using .find() Array method to locate the specific object
            const cruiseDetails = cruises.find(c => c.id === cruiseId);
            openModal(cruiseDetails);
        });
    });
}

/* -------------------------------------------------------------------------- */
/* PART 3: ARRAY METHODS & FILTERING                                          */
/* -------------------------------------------------------------------------- */

function setupFilters(allCruises) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all, add to clicked
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;

            if (category === 'all') {
                displayCruises(allCruises);
            } else {
                // VIDEO NOTE: Using .filter() Array method to create a new array based on criteria
                const filtered = allCruises.filter(cruise => cruise.type === category);
                displayCruises(filtered);
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* PART 4: MODAL DIALOG INTERACTION                                           */
/* -------------------------------------------------------------------------- */

const modal = document.getElementById('cruise-modal');
const closeModalBtn = document.getElementById('close-modal');

function openModal(cruise) {
    if(!modal) return;
    
    // Inject data into modal elements
    document.getElementById('modal-title').textContent = cruise.name;
    document.getElementById('modal-desc').textContent = cruise.description;
    document.getElementById('modal-duration').textContent = cruise.duration;
    document.getElementById('modal-price').textContent = cruise.price;
    
    // VIDEO NOTE: Using the native <dialog> API .showModal()
    modal.showModal(); 
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.close();
    });
}

// Close modal if clicking outside the box
if(modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
}

/* -------------------------------------------------------------------------- */
/* PART 5: LOCAL STORAGE & FORM POPULATION                                    */
/* -------------------------------------------------------------------------- */

function populateFormOptions(cruises) {
    const select = document.getElementById('servicename');
    if (!select) return; // Exit if form dropdown is not on this page

    // Clear loading option
    select.innerHTML = '<option value="" disabled selected>Choose a Service ...</option>';

    cruises.forEach(cruise => {
        const option = document.createElement('option');
        option.value = cruise.name;
        option.textContent = `${cruise.name} (${cruise.price})`;
        select.appendChild(option);
    });
}

// VIDEO NOTE: Local Storage Example
function checkLocalStorage() {
    // We store a simple "Last Visit" timestamp
    const now = new Date();
    localStorage.setItem('lastVisit', now.toISOString());
    console.log("Visit logged to Local Storage");
}
