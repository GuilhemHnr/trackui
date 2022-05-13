var map = L.map('map',{center: [48.633333, 2.450000],zoom: 8},);
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png').addTo(map);

//autre fond possible  : http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png

var plane;
var plane_table = document.getElementById("plane_table");

var myStyle = {
    stroke: true,
    color: "#14dbff",
    weight: 2,
    opacity: 0.5
};

var planeIcon = L.icon({
        iconUrl: './ressources/plane.png',
    
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
});

function onEachFeature(feature, layer) {
    // This is where it loop through your features

    var numPts = feature.geometry.coordinates.length;
    layer.setStyle(myStyle);
    if (numPts >= 1) {
        var end = feature.geometry.coordinates[numPts-1];

        let mark = new L.Marker([end[1],end[0]], {iconAngle: feature.properties.track});

        mark.bindPopup('<h1>'+feature.id+'</h1>');
        mark.setIcon(planeIcon);
        mark.addTo(layerGroup);
    }

    // table
    var row = plane_table.insertRow();
    // --- creation of cells
    var cell_id = row.insertCell();
    var cell_callsign = row.insertCell();
    var cell_altitude = row.insertCell();
    var cell_speed = row.insertCell();
    var cell_vt_spd = row.insertCell();

    // --- fill cells
    if (numPts >= 1) {
        cell_id.innerHTML = '<input id='+feature.id+'_button type="button" value='+feature.id+' onclick = />';
        var button = document.getElementById(feature.id+'_button');
        button.onclick = function () {map.flyTo([end[1],end[0]], 8)};
    } else {cell_id.innerHTML = feature.id;}

    cell_callsign.innerHTML = feature.properties.callsign;
    cell_altitude.innerHTML = feature.properties.altitude+' ft';
    cell_speed.innerHTML = Math.trunc(feature.properties.speed)+' kt';
    cell_vt_spd.innerHTML = feature.properties.sd_vt;

};

var layerGroup = new L.LayerGroup();
layerGroup.addTo(map);

function update_position() {
    var curTimeStamp = Math.floor(Date.now() / 1000);
    //http://157.159.195.63/planes.geojson?t=
    //http://127.0.0.1:3000/planes.geojson?t=
    $.getJSON("http://127.0.0.1:3000/planes.geojson?t="+curTimeStamp, function(data) {
        console.log(data);
        
        plane_table.innerHTML="";
        plane = L.geoJSON(data, {onEachFeature: onEachFeature} );
        layerGroup.clearLayers();
        layerGroup.addLayer(plane);

    });
}

setInterval(update_position, 1000);