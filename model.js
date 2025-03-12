const db = require("./db/connection")
const endpointsJson = require("./endpoints.json");

function fetchAllTopics() {
    return db.query("SELECT * FROM topics").then(({ rows }) => {
        return rows
    })
}

function fetchArticleById(article_id) {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {

            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return rows[0]
        }
    })
}

function fetchAllArticles() {
    return db.query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC").then(({ rows }) => {
        return rows
    })
}

function fetchCommentsByArticleId(article_id) {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {

    return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id]).then(({ rows }) => {

            return rows
        }
    )}
})}


const insertNewComment = (username, body, article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
    return db.query("INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
        [username, body, article_id]).then(({ rows}) =>{
            return rows[0]
        })}
    })
}

function modifyArticleById(article_id, inc_votes){
    if(!inc_votes){
        return Promise.reject({ status: 400, msg: 'bad request' })
    } else {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [inc_votes, article_id])
    .then(({rows}) => {
        if(rows[0].votes < 0){
            return Promise.reject({ status: 400, msg: 'votes cannot be less than zero' })
        } else {
      return rows[0];
        }
    });
}})}
}


module.exports = { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, insertNewComment, modifyArticleById }