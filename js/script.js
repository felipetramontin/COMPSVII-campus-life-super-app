/* ======================================================
   DOM READY
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initWeatherFeature();   // IMPROVEMENT APPLIED: modularized/weather
  initEventsFeature();    // IMPROVEMENT APPLIED: modularized/events
  initMapFeature();       // IMPROVEMENT APPLIED: modularized/map
});


/* ======================================================
   WEATHER — Open-Meteo integration
====================================================== */
function initWeatherFeature() {
  const wBtn = document.getElementById("getWeatherBtn");
  if (!wBtn) return;

  wBtn.addEventListener("click", async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser.");
      return;
    }

    wBtn.disabled = true;
    wBtn.textContent = "Locating...";

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);

        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();

          document.getElementById("weatherCard").classList.remove("visually-hidden");
          document.getElementById("weatherLocation").textContent = `Location: ${lat}, ${lon}`;

          if (data.current_weather) {
            const cw = data.current_weather;
            document.getElementById("weatherInfo").textContent =
              `Temperature: ${cw.temperature}°C — Wind: ${cw.windspeed} km/h — Weather code: ${cw.weathercode}`;
          } else {
            document.getElementById("weatherInfo").textContent = "Weather data not available.";
          }

        } catch (err) {
          document.getElementById("weatherInfo").textContent = "Error fetching weather: " + err;
        } finally {
          wBtn.disabled = false;
          wBtn.textContent = "Get Weather";
        }
      },

      (err) => {
        alert("Unable to retrieve location: " + err.message);
        wBtn.disabled = false;
        wBtn.textContent = "Get Weather";
      },

      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}


/* ======================================================
   EVENTS — simple placeholder + filter demo
====================================================== */
function initEventsFeature() {
  const eventsList = document.getElementById("eventsList");
  const filter = document.getElementById("filterTime");
  if (!eventsList) return;

  // Sample data (MVP placeholder)
  const now = Date.now();
  const sample = [
    { id: 1, title: "Student Org Fair", time: now - 2 * 60 * 60 * 1000 },
    { id: 2, title: "Basketball: Home vs State", time: now + 24 * 60 * 60 * 1000 },
    { id: 3, title: "Career Workshop", time: now - 3 * 24 * 60 * 60 * 1000 }
  ];

  function renderEvents(windowHours) {
    eventsList.innerHTML = "";
    const cutoff = windowHours > 0 ? Date.now() - windowHours * 60 * 60 * 1000 : 0;

    const filtered = sample.filter(ev => windowHours === 0 || ev.time >= cutoff);

    if (filtered.length === 0) {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = "No events found for this timeframe.";
      eventsList.appendChild(li);
      return;
    }

    filtered.forEach(ev => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <strong>${ev.title}</strong>
        <div class="small text-muted">${new Date(ev.time).toLocaleString()}</div>`;
      eventsList.appendChild(li);
    });
  }

  // Default: show last 24 hours
  renderEvents(24);

  if (filter) {
    filter.addEventListener("change", () => {
      renderEvents(parseInt(filter.value, 10));
    });
  }
}


/* ======================================================
   MAP — Nominatim Search + Leaflet Integration
====================================================== */
function initMapFeature() {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("searchResults");
  const mapDiv = document.getElementById("map");
  let map;

  if (mapDiv) {
    map = L.map("map").setView([41.7098, -83.7059], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
  }

  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener("click", async () => {
    const q = searchInput.value.trim();
    if (!q) return;

    resultsDiv.innerHTML = "Searching...";

    const params = new URLSearchParams({
      q,
      format: "json",
      addressdetails: 1,
      limit: 5,
      polygon_geojson: 0,
    });

    try {
      const res = await fetch(
        "https://nominatim.openstreetmap.org/search?" + params.toString(),
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();

      resultsDiv.innerHTML = "";

      if (data.length === 0) {
        resultsDiv.textContent = "No results found.";
        return;
      }

      data.forEach((item) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-secondary m-1";
        btn.textContent = item.display_name;

        btn.addEventListener("click", () => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);

          map.setView([lat, lon], 18);
          L.marker([lat, lon]).addTo(map).bindPopup(item.display_name).openPopup();
        });

        resultsDiv.appendChild(btn);
      });

    } catch (err) {
      resultsDiv.textContent = "Search error: " + err;
    }
  });
}
