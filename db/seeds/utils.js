const db = require("../../db/connection");
const format = require("pg-format")
const { topicData, articleData, userData, commentData } = require("../data/development-data/index")

function convertTimestampToDate({ created_at, ...otherProperties }){
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


function insertTopicData(topicData) {
  const formattedTopics = topicData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url]
  })
  const sqlString = format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`,
    formattedTopics)
  return db.query(sqlString)
}

function insertUserData(userData) {
  const formattedUsers = userData.map((user) => {
    return [user.username, user.name, user.avatar_url]
  })
  const sqlString = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`,
    formattedUsers)
  return db.query(sqlString)
}

function insertArticleData(articleData) {
  const formattedArticles = articleData.map((article) => {
    return [article.title, article.topic, article.author, article.body, new Date(article.created_at), article.votes, article.article_img_url]
  })
  const sqlString = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
    formattedArticles)
  return db.query(sqlString)
}

function insertCommentData(commentData) {
  const formattedComments = commentData.map((comment) => {
    const articleLookup = lookupObj(articleData, 'title', 'article_id')
    return [articleLookup[comment.article_title], comment.body, comment.votes, comment.author, new Date(comment.created_at)]
  })
  const sqlString = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
    formattedComments)
  return db.query(sqlString)
}


function lookupObj(data,key,value){

  const lookupObj = {}
  
  data.forEach((item) => {
  lookupObj[item[key]] = item[value]
  })
  
  return lookupObj
  }


module.exports = { convertTimestampToDate, insertTopicData, insertUserData, insertArticleData, insertCommentData }