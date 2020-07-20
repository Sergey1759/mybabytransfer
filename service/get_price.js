let prices = {
    business: {
        call: 250,
        distance: 17,
        pause: 2
    },
    comfort: {
        call: 150,
        distance: 17,
        pause: 2
    },
    standard: {
        call: 70,
        distance: 14,
        pause: 2
    },
    bus: {
        call: 250,
        distance: 17,
        pause: 6
    }
};

function get_price(type, distance, round_trip) {
    let distance_local = get_distance(distance, round_trip);
    let price = prices[type].call + (distance_local * prices[type].distance);
    if (type == 'business' && price < 500) price = 500;
    return {
        price,
        distance_local
    };
}

function get_distance(distance, round_trip) {
    let round_trip_local = round_trip ? 2 : 1;
    return Math.round((distance * round_trip_local) / 1000);
}

module.exports = get_price;