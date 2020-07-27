let count_arr = 0;
let arr_maps = [];
let carMarker;

function initMap() {
    let maps = document.getElementsByClassName('maps');
    // console.log(maps);


    for (const iterator of maps) {
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer({
            preserveViewport: true
        });

        arr_maps[count_arr] = new google.maps.Map(iterator, {
            // preserveViewport: true,
            zoom: 7,
            center: {
                lat: 49.5522381,
                lng: 25.5943475
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        directionsDisplay.setMap(arr_maps[count_arr]);

        let request = {
            // zoom: 10,
            origin: iterator.dataset.start,
            destination: iterator.dataset.end,

            travelMode: google.maps.DirectionsTravelMode.DRIVING,
        };
        let image = '../../images/car.png'
        carMarker = new google.maps.Marker({
            position: {
                lat: 49.5522381,
                lng: 25.5943475
            },
            map: arr_maps[count_arr],
            icon: image
        });

        // carMarker.setMap(null);

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
        count_arr++;
    }
    console.log(arr_maps);


}

// end_location: { lat: 49.5522381, lng: 25.5943475 },
// start_address: "Lubomyra Husara St, 49, Ivano-Frankivs'k, Ivano-Frankivs'ka oblast, Ukraine, 76000",
// start_location: { lat: 48.9249604, lng: 24.7084271 },