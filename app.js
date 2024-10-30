// Initialize map
// const mapDiv = document.querySelector(".map");

// Add OpenStreetMap tiles
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
});

const osmHOT = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
  }
);
const map = L.map("map", { zoomSnap: 0.5, layers: [osm, osmHOT] }).setView(
  [51.1, 4.44],
  9
);

var baseMaps = {
  OpenStreetMap: osm,
  "<span style='color: red'>OpenStreetMap.HOT</span>": osmHOT,
};

var overlayMaps = {
  // varianten: ["waterpeil", "debiet"],
};
L.control.layers(baseMaps, overlayMaps).addTo(map);
L.control.scale().addTo(map);

const countUrl =
  "https://www.visuris.be/visuris/api/Hydrometeo_V2/GetHydrometeoItems?$format=json&$count=true&$filter=definedParameterCode eq 'WAL'&$top=0";
const apiUrl =
  "https://www.visuris.be/visuris/api/Hydrometeo_V2/GetHydrometeoItems?$format=json&$filter=definedParameterCode eq 'WAL'&$count=true&$orderby=locationName&$top=20";
// Example API call
let aantalMarkers = 0;
const markers = [];

(async () => {
  const aantalItems = await fetchCount();
  for (let i = 0; i < aantalItems; i += 20) {
    await fetchData(i);
  }
})();

async function fetchCount() {
  try {
    const response = await fetch(countUrl);
    const data = await response.json();

    return data.count;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function fetchData(skip = 0) {
  try {
    const response = await fetch(apiUrl + `&$skip=${skip}`);
    const data = await response.json();

    for (let item of data.items) {
      const location = item.locationName.split("/");
      const data = {
        lat: item.lat,
        lon: item.lon,
        location: location[0],
        river: location[1],
        value: item.value,
      };
      drawMarker(data);
      aantalMarkers++;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function drawMarker(data) {
  const { lat, lon, location, river, value } = data;
  const popupText = `${value}m TAW<br>${location}<br>${river}`;
  const color = `rgb(${value * 11}, 100, 100)`;

  L.circle([lat, lon], {
    color: color,
    fillColor: color,
    fillOpacity: 0.5,
    radius: 690,
  })
    .addTo(map)
    .bindPopup(popupText);

  // markers.push(L.marker([lat, lon]).addTo(map).bindPopup(popupText));
}
