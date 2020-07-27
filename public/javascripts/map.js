function initMap() {
    let map_id = document.getElementById('map');

    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer({
        preserveViewport: true
    });

    map = new google.maps.Map(map_id, {
        zoom: 7,
        center: {
            lat: 49.5522381,
            lng: 25.5943475
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    directionsDisplay.setMap(map);

    let request = {
        origin: map_id.dataset.origin,
        destination: map_id.dataset.destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
    };


    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}