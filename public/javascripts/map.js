function initMap() {
    var mapDiv = document.getElementById("map");
    var map = new google.maps.Map(mapDiv, {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
    });
    
}