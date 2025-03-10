const { fetchAllTopics } = require("./model")
const endpointsJson = require("./endpoints.json");

function getEndpoints(request, response, next){
   return response.status(200).send({endpoints: endpointsJson})
}

function getAllTopics(request, response, next){
    fetchAllTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getEndpoints, getAllTopics}