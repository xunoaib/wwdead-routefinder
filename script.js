let selectedSource = null;
let selectedDest = null;
let location_list = null;

function calculateRoute() {
  const display = document.getElementById('routeDisplay');
  
  if (selectedSource && selectedDest) {
    const dx = selectedDest.x - selectedSource.x;
    const dy = selectedDest.y - selectedSource.y;

    let movements = [];

    if (dy !== 0) {
      movements.push(`${Math.abs(dy)} units ${dy > 0 ? 'South' : 'North'}`);
    }
    
    if (dx !== 0) {
      movements.push(`${Math.abs(dx)} units ${dx > 0 ? 'East' : 'West'}`);
    }

    const result = movements.length > 0 ? movements.join(' and ') : "Already at destination";
    display.innerHTML = `<strong>Route:</strong> ${result}`;
  } else {
    display.innerHTML = "";
  }
}

function setupAutocomplete(inputId, dropdownId, selectionKey) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  input.addEventListener('input', () => {
    const val = input.value.toLowerCase();
    dropdown.innerHTML = '';

    if (selectionKey === 'source') selectedSource = null;
    else selectedDest = null;
    
    calculateRoute();

    if (!val) { dropdown.style.display = 'none'; return; }

    const filtered = location_list.filter(loc => 
      loc.name.toLowerCase().includes(val)
    );

    if (filtered.length > 0) {
      dropdown.style.display = 'block';
      filtered.forEach(loc => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `${loc.name} <small>[${loc.x}, ${loc.y}]</small>`;

        item.onclick = () => {
          input.value = `${loc.name} [${loc.x}, ${loc.y}]`;
          
          if (selectionKey === 'source') selectedSource = loc;
          else selectedDest = loc;

          dropdown.style.display = 'none';
          
          calculateRoute();
        };
        dropdown.appendChild(item);
      });
    } else {
      dropdown.style.display = 'none';
    }
  });
}

async function onLoad() {

  let locations = (await (await fetch('locations.json')).json());
  let suburbs = (await (await fetch('suburbs.json')).json());

  location_list = locations.flatMap((row, r) => row.map((col, c) => ({
    name: col[1],
    y: r,
    x: c,
    type: col[0]
  })));

  setupAutocomplete('sourceInput', 'sourceDropdown', 'source');
  setupAutocomplete('destInput', 'destDropdown', 'dest');
}

document.addEventListener('DOMContentLoaded', () => {
  onLoad().catch(err => console.error("Initialization failed", err));
});
