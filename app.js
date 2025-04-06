const express = require("express")
const {getEndpoints, getAllTopics, getArticleById, getAllArticles, getCommentsByArticleId, createNewComment, updateArticleById, deleteCommentById, handlePsqlErrors, handleCustomErrors, handleInternalServerError, updateCommentById} = require("./controller")
const {getAllUsers, getUserByUsername}  = require("./controllers/users.controller")
const cors = require('cors');

const app = express()

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", createNewComment)

app.patch("/api/articles/:article_id", updateArticleById)

app.patch("/api/comments/:comment_id", updateCommentById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getAllUsers)

app.get("/api/users/:username", getUserByUsername)

app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'path not found' })})
app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleInternalServerError)

module.exports = app