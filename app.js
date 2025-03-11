const express = require("express")
const {getEndpoints, getAllTopics, getArticleById, getAllArticles, getCommentsByArticleID, handlePsqlErrors, handleCustomErrors, handleInternalServerError} = require("./controller")

const app = express()

app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'path not found' })
}    
)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleInternalServerError)

module.exports = app