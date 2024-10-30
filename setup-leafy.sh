#!/bin/bash

# Create index.html
cat > index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaflet Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="app.js"></script>
</body>
</html>
EOL

# Create style.css
cat > style.css << 'EOL'
body {
    margin: 0;
    padding: 0;
}

#map {
    height: 100vh;
    width: 100vw;
}
EOL

# Create app.js
cat > app.js << 'EOL'
// Initialize map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Example API call
async function fetchData() {
    try {
        const response = await fetch('YOUR_API_ENDPOINT');
        const data = await response.json();
        // Process your data here
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Uncomment to call the function
// fetchData();
EOL

# Make the script executable
chmod +x app.js

echo "Leaflet project files created! Open index.html in your browser to start."
codium .
