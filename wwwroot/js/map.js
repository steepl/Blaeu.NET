/** create new tile (base) layer */
let openStreetMap = L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: 'Map data: OpenStreetMap, Map tiles: OpenStreetMap' });

/** create new map and set starting position */
let map = L.map('map', { layers: [openStreetMap], zoomControl: true })
    .setView([52.3700000, 4.9000000], 14);

let scaleControl = L.control.scale()
    .setPosition("bottomright")
    .addTo(map);