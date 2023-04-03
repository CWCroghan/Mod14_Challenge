// Mod14_Challenge Mapping Earthquake Data
// program name challenge_logic.js
// links to index.html
// Purpose: Map Earthquake data from the last 7 days
// Data source: usgs.gov for earthquake data, mapbox.com map backgrounds
// Using Leaflet mapping application, d3, and javascript


// Code provided in starter program.
// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the third tile layer that will be the background of our map.
// This section is Delivery 3: Add New Background data option.
let outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Outdoors": outdoors
};

// 1. Add a layer group for the earthquake data.
let allEarthquakes = new L.LayerGroup();

// Functions for Styling the Markers 
// These functions were moved out of the d3.json read of the data so that other functions could see it
// This function determines the color of the marker based on the magnitude of the earthquake.

function getColor(magnitude) {
  // adding major colors to the list
     if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }


// Retrieve the earthquake GeoJSON data.
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeData).then(function(data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    	// We turn each feature into a circleMarker on the map.
    	pointToLayer: function(feature, latlng) {
      		//console.log(data);
      		return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
     // We create a popup for each circleMarker to display the magnitude and location of the earthquake
     //  after the marker has been created and styled.
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(allEarthquakes);

  // Then we add the earthquake layer to our map.
  allEarthquakes.addTo(map);

  // Here we create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    //console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
};

// Finally, we our legend to the map.
legend.addTo(map);
});
// End of Starter Code.
//----------------------------------------------------------------------------\\

// Delivery 1: Add Tectonic Plate Data
console.log("Start Delivery 1");

// Creating a new Layer for the tectonic plate data
let tectonicPlates = new L.layerGroup();

/// Note: use raw.githubusercontent.com instead of  github.com \\\
let tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"; 

// Create a style for the lines 
let mystyle = {color: "#C70039", weight: 2 };

// Use d3.json to make a call to get our Tectonic Plate geoJSON data.
d3.json(tectonic).then (function(data) {
    console.log("tectonic plates fetched");
    L.geoJSON(data, {
      style: mystyle
  }).addTo(tectonicPlates);

  tectonicPlates.addTo(map);
});

// End Delivery 1.
//----------------------------------------------------------------------------\\
// Delivery 2: Add Major Earthquake Data

// Creating a new overlay for the Major earthquake data
let majorQuake = new L.layerGroup();

// Adding new overalys to the list of overlays for web option
let overlays = {
  "Tetconic Plates": tectonicPlates,
  "Earthquakes": allEarthquakes,
  "Major Earthquakes": majorQuake,
};

L.control.layers(baseMaps, overlays).addTo(map);

// Creating a new color function based on classification of the hight magnitude earthquakes
function getColor2(magnitude) {
  // adding major colors to the list
    if (magnitude > 6) {
      return "#a51111";
    }
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    return "#ee9c00";
  }

// Variable to hold pointer information for the major earthquake data
let majorQuakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Using d3.json to process the data.
d3.json(majorQuakeData).then(function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor2(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 3
    };
  }
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {

    	// We turn each feature into a circleMarker on the map. 
    	pointToLayer: function(feature, latlng) {
      		//console.log(data);
          	return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
     // We create a popup for each circleMarker to display the magnitude and location of the earthquake
     //  after the marker has been created and styled.
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(majorQuake);

  // Then we add the earthquake layer to our map.
  majorQuake.addTo(map);
});

// End Delivery 2

//----------------------------------------------------------------------------\\

// End Program.