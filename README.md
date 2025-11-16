# Campus Life Super App — MVP

This is a minimal MVP for the Campus Life Super App final project.

## What is included
- 3 semantic HTML pages: `index.html`, `events.html`, `map.html`
- `css/style.css` and `js/script.js`
- Bootstrap for responsive layout (CDN)
- Two external API integrations:
  - **Open-Meteo** (no API key needed) for current weather.
  - **Nominatim / OpenStreetMap** (no API key needed for light use) for place search.
- Leaflet.js for interactive maps.
- Accessibility considerations (ARIA attributes, semantic structure, focus outlines).

## How to use locally
1. Clone or download this folder.
2. Open `index.html` in a browser (for full functionality it's best to run from a local server).
   - To run a quick local server with Python 3:
     ```
     python3 -m http.server 8000
     ```
     Then open `http://localhost:8000` and click `index.html`.

## Project structure
```
|- css/
  |- style.css
|- images/
|- js/
  |- script.js
|- index.html
|- events.html
|- map.html
|- README.md
```

## Suggested commit history (you should make these commits locally so GitHub shows progress)
1. Initial project scaffold: index, events, map pages
2. Add Bootstrap + basic layout
3. Add style.css
4. Add script.js with placeholder functions
5. Implement weather (Open-Meteo) integration
6. Implement events placeholder + filters
7. Implement map and Nominatim search integration
8. Add accessibility attributes and focus states
9. Write README and instructions
10. Final MVP polish and deploy setup

## Notes & next steps (stretch)
- Replace the events placeholder with a real campus events API (Google Calendar API or internal campus feed).
- Add user authentication and favorites (localStorage).
- Improve map UI, clustering, and persistent markers.
- Add unit tests and CI.

## References
- Open-Meteo API docs: https://open-meteo.com/
- Nominatim / OpenStreetMap: https://nominatim.org/

