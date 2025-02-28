const db = require("../connection")
const { topicData, userData, articleData, commentData } = require("../data/development-data/index")
const {insertTopicData, insertUserData, insertArticleData, insertCommentData, createLookupObj } = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;")
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;")
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics;")
  })
  .then(()=>{
    return createTopics()
  })
  .then(()=>{
    return createUsers()
  })
  .then(()=>{
    return createArticles()
  })
  .then(()=>{
    return createComments()
  })
  .then(()=> {
    return insertTopicData(topicData)
  })
  .then(()=> {
    return insertUserData(userData)
  })
  .then(()=> {
    return insertArticleData(articleData)
  })
  .then(({rows})=> {
    return createLookupObj(rows,'title','article_id')
})
  .then((lookupObj)=> {
    return insertCommentData(commentData, lookupObj)
  })
}

function createTopics() {

  return db.query(`CREATE TABLE topics (
    slug VARCHAR(1000) PRIMARY KEY NOT NULL,
    description VARCHAR(100) NOT NULL,
    img_url VARCHAR(1000) NOT NULL)`)
}
function createUsers() {

  return db.query(`CREATE TABLE users (
    username VARCHAR(100) PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL)`)
}
function createArticles() {

  return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    topic VARCHAR(1000) REFERENCES topics(slug),
    author VARCHAR(100) REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP, 
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL)`)
}
function createComments() {

  return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(100) REFERENCES users(username),
    created_at TIMESTAMP)`)
}


module.exports = seed;
