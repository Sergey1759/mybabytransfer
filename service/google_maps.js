const {
    Client,
    Status
} = require("@googlemaps/google-maps-services-js");

const client = new Client({});


async function get(from, to) {
    return await client
        .directions({
            params: {
                origin: from,
                destination: to,
                key: "AIzaSyBBf2vtMPr5P0Z3JrYOdvz1vugg4fN1-e8",
            }
        })
        .then((r) => {
            console.log(r.data.routes[0].legs);
            return r.data.routes[0].legs;
        })
        .catch((e) => {
            console.log(e.response.data.error_message);
        });
}

module.exports = {
    get
};