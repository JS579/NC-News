const express = require("express")

const {getEndpoints, getAllTopics, getArticleById, handlePsqlErrors, handleCustomErrors} = require("./controller")

const app = express()

app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles/:article_id", getArticleById)


app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'path not found' })
})
app.use(handlePsqlErrors)
app.use(handleCustomErrors)

module.exports = app