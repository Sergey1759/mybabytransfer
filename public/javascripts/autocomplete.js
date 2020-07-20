console.log(1);
var autocomplete;
var options = {
    // types: ['address'],
    componentRestrictions: {
        country: "ua"
    }
};

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
        options
    });
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        Filing_Address = place;
    });

    autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('autocomplete2'), {
        options
    });
    autocomplete2.addListener('place_changed', function () {
        var place = autocomplete2.getPlace();
        Shipping_Address = place;
    });
}

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(geolocation);
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}