const hamburger = document.querySelector('.hamburger');
const navUL = document.querySelector('nav ul');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navUL.classList.toggle('open');
  });
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => {
      navUL.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// -------------------- DOM targets --------------------
const weatherTempEl = document.querySelector('#weather-temp');
const weatherDescEl = document.querySelector('#weather-desc');
const weatherHighEl = document.querySelector('#weather-high');
const weatherLowEl = document.querySelector('#weather-low');
const weatherHumidityEl = document.querySelector('#weather-humidity');
const forecastContainer = document.querySelector('#forecast');

const spotlightContainer = document.querySelector('#spotlight-container');
const membersContainer = document.querySelector('#members');

// -------------------- OpenWeatherMap config --------------------
const API_KEY = '21e78c8088229c08e9f4d0ab67881c3f';
const CITY = 'Lagos';
const COUNTRY = 'NG';

// Helper: convert Kelvin if needed (we request metric explicitly)
function formatTemp(t) {
  return `${Math.round(t)}°C`;
}

// -------------------- Weather fetch + render --------------------
async function fetchWeather() {
  try {
    // Current weather (metric units)
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`;
    const resCur = await fetch(currentURL);
    if (!resCur.ok) throw new Error('Current weather fetch failed');
    const curData = await resCur.json();

    // Render current
    if (weatherTempEl) weatherTempEl.textContent = `${Math.round(curData.main.temp)}°C`;
    if (weatherDescEl) weatherDescEl.textContent = curData.weather[0].description;
    if (weatherHighEl) weatherHighEl.textContent = Math.round(curData.main.temp_max);
    if (weatherLowEl) weatherLowEl.textContent = Math.round(curData.main.temp_min);
    if (weatherHumidityEl) weatherHumidityEl.textContent = curData.main.humidity;

    // 5-day forecast (3-hour steps)
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`;
    const resFor = await fetch(forecastURL);
    if (!resFor.ok) throw new Error('Forecast fetch failed');
    const forData = await resFor.json();

    // We want the next 3 *calendar* days (not including today)
    // Build a map of date -> array of readings
    const dailyMap = {};
    forData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) dailyMap[date] = [];
      dailyMap[date].push(item);
    });

    const dates = Object.keys(dailyMap).sort();
    // find today's date key and take the next three dates
    const today = new Date().toISOString().split('T')[0];
    const futureDates = dates.filter(d => d > today).slice(0, 3);

    // Clear forecast container
    if (forecastContainer) forecastContainer.innerHTML = '';

    futureDates.forEach(dateKey => {
      const readings = dailyMap[dateKey];
      // pick mid-day reading if exists (12:00) otherwise pick first reading
      const midday = readings.find(r => r.dt_txt.includes('12:00:00')) || readings[0];
      const temp = Math.round(midday.main.temp);

      const dateObj = new Date(dateKey);
      const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });

      const block = document.createElement('div');
      block.className = 'forecast-day';
      block.innerHTML = `<strong>${dayName}</strong><div>${temp}°C</div>`;
      forecastContainer.appendChild(block);
    });

  } catch (err) {
    console.error('Weather error:', err);
    if (weatherDescEl) weatherDescEl.textContent = 'Weather unavailable';
    if (forecastContainer) forecastContainer.textContent = '';
  }
}

// -------------------- Spotlights: fetch members.json and show 2-3 gold/silver --------------------
async function loadSpotlights() {
  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error('members.json fetch failed');
    const members = await res.json();

    // filter for gold/silver
    const candidates = members.filter(m => {
      const level = (m.membership || '').toLowerCase();
      return level === 'gold' || level === 'silver';
    });

    if (candidates.length === 0) {
      spotlightContainer.innerHTML = '<p>No featured members at this time.</p>';
      return;
    }

    // shuffle
    const shuffled = candidates.sort(() => 0.5 - Math.random());

    const count = shuffled.length >= 3 ? (Math.random() < 0.5 ? 2 : 3) : shuffled.length;
    const selected = shuffled.slice(0, count);

    // render
    spotlightContainer.innerHTML = '';
    selected.forEach(member => {
      const card = document.createElement('div');
      card.className = 'spot-card';
      card.innerHTML = `
          <img src="images/${member.image}" 
          alt="Logo of ${member.name}, a ${member.membership} member"
          loading="lazy">
        <div class="spot-info">
          <h3>${member.name}</h3>
          <p><strong>${(member.membership || '').toUpperCase()} Member</strong></p>
          <p>${member.address}</p>
          <p>Tel: ${member.phone}</p>
          <p><a href="${member.website}" target="_blank" rel="noopener">${stripProtocol(member.website)}</a></p>
        </div>
      `;
      spotlightContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Spotlights error:', err);
    if (spotlightContainer) spotlightContainer.innerHTML = '<p>Unable to load spotlights.</p>';
  }
}

function stripProtocol(url) {
  return url.replace(/^https?:\/\//, '');
}

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

fetchWeatherAndSpotlights();

async function fetchWeatherAndSpotlights() {
  await fetchWeather();
  await loadSpotlights();
}
