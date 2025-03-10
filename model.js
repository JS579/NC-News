const db = require("./db/connection")
const endpointsJson = require("./endpoints.json");

function fetchEndpoints(){
    return {endpoints: endpointsJson}
}

module.exports = {fetchEndpoints}