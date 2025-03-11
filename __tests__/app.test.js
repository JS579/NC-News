const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3)
        body.topics.forEach(topic => {
          expect(typeof topic.slug).toBe('string')
          expect(typeof topic.description).toBe('string')
        })
      })
  })
})

describe("catch all error for non-existent end point", () => {
  test("Responds with an error message when given a non-existent end point", () => {
    return request(app)
      .get("/api/topiks")
      .expect(404).then(({ body }) =>
        expect(body.msg).toEqual('path not found'));

  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the requested article", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.author).toBe("rogersop")
        expect(body.article.title).toBe("Student SUES Mitch!")
        expect(body.article.article_id).toBe(4)
        expect(body.article.body).toBe("We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages")
        expect(body.article.topic).toBe("mitch")
        expect(body.article.created_at).toBe("2020-05-06T01:14:00.000Z")
        expect(body.article.votes).toBe(0)
        expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
      })

      test("Responds with an error when an article id that does not exist is requested", ()=>{
        return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found")
      })
  })

  test("Responds with an error when an article id in the wrong format is requested", ()=>{
    return request(app)
    .get("/api/articles/four")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("bad request")
  })
})
})


describe("GET /api/articles", () => {
  test("200: Responds with an array of all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13)
        body.articles.forEach(article => {
          expect(typeof article.author).toBe('string')
          expect(typeof article.title).toBe('string')
          expect(typeof article.article_id).toBe('number')
          expect(typeof article.topic).toBe('string')
          expect(typeof article.created_at).toBe('string')
          expect(typeof article.votes).toBe('number')
          expect(typeof article.body).toBe("undefined")
          expect(typeof article.article_img_url).toBe('string')
          expect(typeof article.comment_count).toBe('number')
        })
      })
  })

  test("The articles in the array are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', {descending: true })

      })
  })
})


describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all the comments with the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {

        expect(body.commentsByArticle).toHaveLength(11)
        body.commentsByArticle.forEach(comment => {
          expect(typeof comment.comment_id).toBe('number')
          expect(typeof comment.votes).toBe('number')
          expect(typeof comment.created_at).toBe('string')
          expect(typeof comment.author).toBe('string')
          expect(typeof comment.body).toBe('string')
          expect(typeof comment.article_id).toBe('number')
      })
  })
})
test("The comments in the array are sorted by date in descending order", () => {
  return request(app)
    .get("/api/articles/1/comments")
    .then(({ body }) => {
      expect(body.commentsByArticle).toBeSortedBy('created_at', {descending: true })

    })
})
test("404: Responds with an error if no comments exist with the requested article ID", () => {
  return request(app)
    .get("/api/articles/2/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("not found")
    })
})
test("400: Responds with an error when an article id in the wrong format is requested ", () => {
  return request(app)
  .get("/api/articles/two/comments")
  .expect(400)
  .then(({ body }) => {
    expect(body.msg).toBe("bad request")
})
})
})
