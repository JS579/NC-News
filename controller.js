const { fetchEndpoints } = require("./model")
const endpointsJson = require("./endpoints.json");

function getEndpoints(request, response, next){

   return response.status(200).send({endpoints: endpointsJson})

}

module.exports = {getEndpoints}