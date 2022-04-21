
async function getJSON() {
    var response = await fetch('http://localhost:3000/planes4.geojson');

    var json = await response.json();
    console.log("new data");
    return json
}

async function get_data(livelayergroup){
    let obj = await getJSON();
    livelayergroup.clearLayers();
    //handle geoJSON ------------------------------------------------------
    let live_layer = L.geoJSON(obj, {
        style: myStyle
    });
    livelayergroup.addLayer(live_layer);
    //localtion.reload();
    //delete(obj);
}

var map = L.map('map',{center: [48.633333, 2.450000],zoom: 8},);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);


    //define style here ------------------------------------------------------
    var planeIcon = L.icon({
        iconUrl: 'ressources/plane3.png',
    
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
    });

    var myStyle = {
        stroke: true,
        color: "#ff7800",
        weight: 5,
        opacity: 0.65
    };

    var layerGroup = new L.LayerGroup();
    layerGroup.addTo(map);

    setInterval(() => {
        get_data(layerGroup);
    }, 1000);


    
    


    