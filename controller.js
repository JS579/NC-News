const { fetchAllTopics, fetchArticleById } = require("./model")
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
}


module.exports = {getEndpoints, getAllTopics, getArticleById, handlePsqlErrors, handleCustomErrors}