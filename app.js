const express = require("express")
const {getEndpoints, getAllTopics} = require("./controller")

const app = express()

app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)


app.all("*", (req, res, next) => {
    res.status(404).send({ msg: 'path not found' })
})

module.exports = app