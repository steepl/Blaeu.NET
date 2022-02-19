/** create new tile (base) layer */
let openStreetMap = L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: 'Map data: OpenStreetMap, Map tiles: OpenStreetMap' });

/** create new map and set starting position */
let map = L.map('map', { layers: [openStreetMap], zoomControl: true, fullscreenControl: true })
    .setView([52.3700000, 4.9000000], 14);

let scaleControl = L.control.scale()
    .setPosition("bottomright")
    .addTo(map);

/************************ [ leaflet.draw plugin ] *********************************/

/** create feature group to store drawn items  */
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

/** create new draw controller and add to map */
let drawControl = new L.Control.Draw({
    draw: {
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

    layer.addTo(map);
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
            $(document.body)
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
            $(document.body)
                .css({ "filter": "" })
                .css({ "transition": "filter 1s" });
            $("#map-spinner")
                .fadeOut("fast");
        }
    });
}

/** retrieve data to show on map */
getAllFeaturesFromSqlDatabase();