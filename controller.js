const { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, insertNewComment, modifyArticleById, removeCommentById } = require("./model")
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

function getArticleById(request, response, next){

    const {article_id} = request.params
    fetchArticleById(article_id).then((article)=>{
        response.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

function getAllArticles(request, response, next){

    const {sort_by: sortByColumn, order, topic} = request.query
    const queries = Object.keys(request.query)

    fetchAllArticles(sortByColumn, order, topic, queries).then((articles) => {
        response.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

function getCommentsByArticleId(request, response, next){
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id).then((commentsByArticle)=>{
        response.status(200).send({commentsByArticle})
    })
    .catch((err)=>{
        next(err)
    })
} 

const createNewComment = async (request, response, next)=>{
    try{
    const { username, body } = request.body
    const {article_id} = request.params
 
    const newComment = await insertNewComment(username, body, article_id)

        response.status(201).send({newComment})
    }
    catch(err) {
        next(err)
    }
}

function updateArticleById(request, response, next){
    const {article_id} = request.params
    const {inc_votes} = request.body
    modifyArticleById(article_id, inc_votes).then((article)=>{
        response.status(200).send({article})
    })    .catch((err)=>{
        next(err)
    })
}


function deleteCommentById(request, response, next){
    const {comment_id} = request.params
    removeCommentById(comment_id).then((deleted)=>{
        response.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}




function handlePsqlErrors(err, req, res, next){
    
    if(err.code === '22P02'){
        res.status(400).send({msg: 'bad request'})
    } 
    next(err)
}

function handleCustomErrors(err, req, res, next){

    if(err.status && err.msg){
    res.status(err.status).send({ msg: err.msg})
    }
    next(err)
}

function handleInternalServerError(err, req, res, next){
    res.status(500).send({msg: 'internal server error'})

}



module.exports = {getEndpoints, getAllTopics, getArticleById, getAllArticles, getCommentsByArticleId, createNewComment, updateArticleById, deleteCommentById, handlePsqlErrors, handleCustomErrors, handleInternalServerError}