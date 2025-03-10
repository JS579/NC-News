const db = require("./db/connection")
const endpointsJson = require("./endpoints.json");

function fetchAllTopics(){
    return db.query("SELECT * FROM topics").then(({rows}) => { 
        return rows
        })
    }

function fetchArticleById(article_id){
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows}) => { 
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'not found'})
        } else{
        return rows[0]
        }
    })
}


module.exports = {fetchAllTopics, fetchArticleById}