async function getJSON() {
    const response = await fetch('http://localhost:8000/ressources/planes3.geojson');
    var json = await response.json();
    return json
}

var plane_local2 = {"geometry": {"coordinates":[[1.9858492612838745,48.80726623535156], [1.9,48.0]],"type":"LineString"},
"id":"471f46",
"properties":
    {"":"callsign","37200":"altitude","479.4351 kt | Barometric : 0 ft/min | GS":"speed"},
"type":"Feature"};

var map = L.map('map',{center: [48.633333, 2.450000],zoom: 8},);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);


    //define style here ------------------------------------------------------
    var planeIcon = L.icon({
        iconUrl: 'ressources/plane.png',
    
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
    });

    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    let obj = getJSON();

    
    
    //handle geoJSON ------------------------------------------------------
    L.geoJSON(obj, {
        style: myStyle
    }).addTo(map);
    
    


    