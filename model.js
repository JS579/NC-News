const db = require("./db/connection")

function fetchAllTopics() {
    return db.query("SELECT * FROM topics").then(({ rows }) => {
        return rows
    })
}

function fetchArticleById(article_id) {
    return db.query("SELECT articles.*, CAST(COUNT(comments.comment_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {

            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return rows[0]
        }
    })
}

function fetchAllArticles(sortByColumn, order, topic, queries) {

    const queryValues = []

    let queryStr = "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id"
    const allowedSortInputs = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "comment_count"]
    const legitSortOrders = ["desc", "asc", "DESC", "ASC"]



    if (order && !legitSortOrders.includes(order)) {
        return Promise.reject({ status: 404, msg: "invalid input" })
    }

    if(topic){
        queryValues.push(topic)
        queryStr += ` WHERE articles.topic = $1`
    }

    if (sortByColumn) {
        if (!allowedSortInputs.includes(sortByColumn)) {
            return Promise.reject({ status: 404, msg: "invalid input" })
        } if (order) {
            queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sortByColumn} ${order}`
        }
        else {
            queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sortByColumn} DESC`
        }
    } else {
        if (order) {
            queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at ${order}`
        } else {
            queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC`
        }
    }

    return db.query(queryStr, queryValues).then(({ rows }) => {
            return rows
        }
    )}


function fetchCommentsByArticleId(article_id) {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {

            return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id]).then(({ rows }) => {

                return rows
            }
            )
        }
    })
} 


const insertNewComment = (username, body, article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return db.query("INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
                [username, body, article_id]).then(({ rows }) => {
                    return rows[0]
                })
        }
    })
}

function modifyArticleById(article_id, inc_votes) {
    if (!inc_votes) {
        return Promise.reject({ status: 400, msg: 'bad request' })
    } else {
        return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'not found' })
            } else {
                        if(inc_votes < 0 && rows[0].votes + inc_votes < 0){
                        return Promise.reject({ status: 400, msg: 'votes cannot be less than zero' })
                    } else {
                        return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [inc_votes, article_id])
                        .then(({ rows }) => {
                            return rows[0]
                    }) }
                }})
            }
        }


function removeCommentById(comment_id) {
    return db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
        }
    })
}

module.exports = { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, insertNewComment, modifyArticleById, removeCommentById }