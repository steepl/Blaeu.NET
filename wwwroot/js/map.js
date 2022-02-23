let openStreetMap = L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: 'Map data: OpenStreetMap, Map tiles: OpenStreetMap' }),
    carto = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png", { attribution: "Data: © OpenStreetMap, Tiles: © Carto" });

let baseLayers = {
    "OSM": openStreetMap,
    "Carto": carto
};

/** create new map and set starting position */
let map = L.map('map', { layers: [openStreetMap], zoomControl: true, fullscreenControl: true })
    .setView([52.3700000, 4.9000000], 14);

let scaleControl = L.control.scale()
    .setPosition("bottomright")
    .addTo(map);

/************************ [ leaflet.draw plugin ] *********************************/

/** create feature groups for stored and drawn items  */
let drawnItems = new L.FeatureGroup(),
    storedItems = new L.FeatureGroup();

map.addLayer(drawnItems);
map.addLayer(storedItems);

let greyIcon = L.Icon.extend({
    options: {
        iconUrl: "/img/marker-icon-2x-grey.png",
        shadowUrl: "/img/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    }
});

/** create new draw controller and add to map */
let drawControl = new L.Control.Draw({
    draw: {
        marker: {
            icon: new greyIcon()
        },
        polygon: {
            drawError: {
                color: "#f44242",
                timeout: 1000
            },
            shapeOptions: {
                color: "#FF0000"
            },
            showArea: true
        },
        polyline: {
            metric: true,
            shapeOptions: {
                color: "#150BEB"
            }
        },
        circle: false,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems
    }
}).setPosition("topright");

let saveControl = new L.Control.Draw.Save({
    save: {
        featureGroup: drawnItems
    }
}).setPosition("topleft");

map.addControl(drawControl);
map.addControl(saveControl);

/** create event handler to trigger on drawn item */
map.on('draw:created', function (e) {
    // get layer and layer type of drawn item
    let layer = e.layer, type = e.layerType;

    // print layer values to console
    console.log("layer: ", layer);
    console.log("type: ", type);

    // add layer to layer group (this makes it visible on the map)
    drawnItems.addLayer(layer);
});

/************************ [ leaflet.markercluster plugin ] *********************************/

// create layer groups to use with markercluster plugin
let willem = new L.FeatureGroup([]),
    joan = new L.FeatureGroup([]);

let dataLayers = {
    "Drawings": {
        "Local": drawnItems,
        "Stored": storedItems
    },
    "Blaeus": {
        "Willem": willem,
        "Joan": joan
    }
};

// create main layer control (used for toggling base/tile and data layers)
let layerControl = L.control.groupedLayers(baseLayers, dataLayers, ({ collapsed: false }))
    .setPosition("bottomleft")
    .addTo(map);

// create marker cluster group with layer support (layer support means using existing layers), and check in data layers
let markerClusterGroup = L.markerClusterGroup
    .layerSupport({ maxClusterRadius: 35 })
    .checkIn([willem, joan])
    .addTo(map);

// add data layers to map to enable them by default (must be done after marker cluster check-in)
willem.addTo(map);
joan.addTo(map);

/************************ [ database requests ] *********************************/

/** create custom bootstrap alert based on type  */
function _alert(message, type) {

    var placeholder = $(".alert-placeholder");

    var wrapper = document.createElement('div')
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`

    placeholder.append(wrapper);
}

/** add each feature layer in feature collection to map  */
function _onEachFeature(feature, layer) {

    var owner = storedItems;

    if (Object.keys(feature.properties).length > 0) {

        // create deep copy of feature properties
        var properties = { ...feature.properties };

        // set custom icon if copy contains owner
        if (Object.hasOwn(properties, "Layer")) {

            if (properties.Layer == "Willem") {
                owner = willem;
                layer.setIcon(new L.DivIcon({ className: 'leaflet-marker-point leaflet-marker-point-orange' }));
            }
            else if (properties.Layer == "Joan") {
                owner = joan;
                layer.setIcon(new L.DivIcon({ className: 'leaflet-marker-point leaflet-marker-point-green' }));
            }

            // remove property from copy
            delete properties.Layer;
        }

        // if copy has other properties left, create pop-up with properties
        if (Object.keys(properties).length > 0) {

            var table = L.DomUtil.create('table', 'pop-up-table');

            var content = '<tbody>';
            for (var p in properties) {
                content += `<tr><td><label for="${properties[p]}">${properties[p]}</label></td></tr>`;
            }
            content += "</tbody>";

            table.innerHTML = content;
            layer.bindPopup(table);
        }
        else {
            layer.setIcon(new L.DivIcon({ className: 'leaflet-marker-point leaflet-marker-point-gold' }));
        }
    }

    layer.addTo(owner);
}

function getAllFeaturesFromSqlDatabase() {

    $.ajax({
        type: "GET",
        url: window.location.origin + "/SqlFeature/GetAllFeaturesFromDatabase",
        contentType: "application/json ; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != "") {
                var featureCollection = JSON.parse(data);
                L.geoJSON(featureCollection, { onEachFeature: _onEachFeature });
            }
            else {
                _alert('Application was unable to load data from the database', 'danger');
            }
        },
        error: function () {
            _alert('Application was unable to load data from the database', 'danger');
        }
    });
}

/** save features to SQL database  */
function saveFeaturesToSqlDatabase(data) {

    $.ajax({
        type: "POST",
        traditional: true,
        url: window.location.origin + "/SqlFeature/SaveFeaturesToDatabase",
        data: { data: data },
        beforeSend: function () {
            $(document.documentElement)
                .css({ "filter": "blur(2px)" })
                .css({ "transition": "filter 1s" });
            $("#map-spinner")
                .fadeIn("fast");
        },
        success: function (message) {
            _alert("Success, reloading page to view changes", "success");
            setTimeout(function () { window.location.reload(); }, 1000);
        },
        error: function () {
            _alert("Oops, it looks like something went wrong trying to save the data to the database.", "warning");
            // stop spinner
            $(document.documentElement)
                .css({ "filter": "" })
                .css({ "transition": "filter 1s" });
            $("#map-spinner")
                .fadeOut("fast");
        }
    });
}

/** retrieve data to show on map */
getAllFeaturesFromSqlDatabase();