let map;

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

    let image = '../../images/car.png'

    let count = 1 / 200;
    let position = {
        lat: 49.5522381,
        lng: 25.5943475
    };
    setInterval(() => {
        let carMarker = new google.maps.Marker({
            position,
            map: map,
            icon: image
        });
        position.lat += count;
        position.lng += count;
        setTimeout(() => {
            carMarker.setMap(null);
        }, 990);
    }, 1000);


    directionsDisplay.setMap(map);

    // let request = {
    //     origin: map_id.dataset.origin,
    //     destination: map_id.dataset.destination,
    //     travelMode: google.maps.DirectionsTravelMode.DRIVING,
    // };


    // directionsService.route(request, function (response, status) {
    //     if (status == google.maps.DirectionsStatus.OK) {
    //         directionsDisplay.setDirections(response);
    //     }
    // });
}