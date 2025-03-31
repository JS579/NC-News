 const { fetchAllUsers, fetchUserByUsername } = require("../models/users.model")

function getAllUsers(request, response, next){
    fetchAllUsers().then((users) => {
        response.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

function getUserByUsername(request, response, next){
    const {username} = request.params
    fetchUserByUsername(username).then((user)=>{
        response.status(200).send({user})
    })
}


module.exports = { getAllUsers, getUserByUsername }