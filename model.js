const db = require("./db/connection")
const endpointsJson = require("./endpoints.json");

function fetchAllTopics(){
    return db.query("SELECT * FROM topics").then(({rows}) => { 
        return rows
        })
    }



module.exports = {fetchAllTopics}