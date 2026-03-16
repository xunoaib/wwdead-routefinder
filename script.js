async function fetchLocations() {
  const response = await fetch('./locations.json');
  return await response.json();
}

function calculateRoute() {
  const start = document.getElementById('sourceInput').value;
  const end = document.getElementById('destInput').value;

  console.log(start);

  if (start && end) {
    alert(`Routing from: ${start}\nTo: ${end}`);
  } else {
    alert("Please select both locations.");
  }
}

async function onLoad() {

  const grid = await fetchLocations();
  const locations = grid.flatMap((row, r) => row.map((col, c) => ({
    name: col[1],
    y: r,
    x: c,
    type: col[0]
  })));

  function setupAutocomplete(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener('input', () => {
      const val = input.value.toLowerCase();
      dropdown.innerHTML = '';

      if (!val) { dropdown.style.display = 'none'; return; }

      // Check if input is likely a coordinate (e.g., "40, -70")
      const isCoord = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(val);

      const filtered = locations.filter(loc => 
        loc.name.toLowerCase().includes(val)
      );

      if (filtered.length > 0) {
        dropdown.style.display = 'block';
        filtered.forEach(loc => {
          const item = document.createElement('div');
          item.innerHTML = `${loc.name} <span>[${loc.x}, ${loc.y}]</span>`;
          item.onclick = () => {
            input.value = `${loc.name} [${loc.x}, ${loc.y}]`;
            dropdown.style.display = 'none';
          };
          dropdown.appendChild(item);
        });
      } else if (isCoord) {
        // If user types raw valid coords, give them an option to use it
        dropdown.style.display = 'block';
        const item = document.createElement('div');
        item.innerHTML = `Use coordinates: <span>${val}</span>`;
        item.onclick = () => {
          input.value = val;
          dropdown.style.display = 'none';
        };
        dropdown.appendChild(item);
      } else {
        dropdown.style.display = 'none';
      }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target !== input) dropdown.style.display = 'none';
    });
  }

  setupAutocomplete('sourceInput', 'sourceDropdown');
  setupAutocomplete('destInput', 'destDropdown');
}

document.addEventListener('DOMContentLoaded', () => {
  onLoad().catch(err => console.error("Initialization failed", err))
})
