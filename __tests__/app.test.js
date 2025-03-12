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

test("404: Responds with an empty array if no comments exist with the requested article ID", () => {
  return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.commentsByArticle).toEqual([])
    })
})
test("404: Responds with an error if no comments exist with the requested article ID", () => {
  return request(app)
    .get("/api/articles/999/comments")
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


describe("POST: /api/articles/:article_id/comments", () => {
  test("Returns newly created comment for the given article id", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .expect(201)
      .send({username: "lurker", body: "great article, enjoyed reading it"})
      .then(({ body:responseBody }) => {
        const { comment_id, author, body, article_id, votes, created_at} = responseBody.newComment;
        expect(comment_id).toBe(19)
        expect(author).toBe("lurker")
        expect(body).toBe("great article, enjoyed reading it")
        expect(article_id).toBe(2)
        expect(votes).toBe(0)
        expect(typeof created_at).toBe("string")
      });
  });

  test("Returns an error when an article id in the wrong format is requested", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .expect(400)
      .send({username: "lurker", body: "great article, enjoyed reading it"})
      .then(({ body }) => {
        expect(body).toMatchObject({ msg: 'bad request' })
      });
  });

  test("400; Returns an error when a non existent user is passed in the request", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .expect(400)
      .send({username: "John", body: "great article, enjoyed reading it"})
      .then(({ body }) => {
        expect(body).toMatchObject({ msg: 'bad request' })
      });
  });

  test("400: Returns an error when the request object is not complete", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .expect(400)
      .send({username: "lurker"})
      .then(({ body }) => {
        expect(body).toMatchObject({ msg: 'bad request' })
      });
  });

  test("Returns an error when passed an article id for an article that does not exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .expect(404)
      .send({username: "lurker", body: "great article, enjoyed reading it"})
      .then(({ body }) => {
        expect(body.msg).toBe("not found")
      });
  });
})


describe("PATCH: /api/articles/:article_id", () => {
  test("Returns requested owner updated with new information", () => {
    return request(app).patch("/api/articles/4").expect(200).send(
      {inc_votes: 34}
    ).then(({body}) => {
      const {article_id, title, author, votes} = body.article;
      expect(article_id).toBe(4)
      expect(title).toBe("Student SUES Mitch!")
      expect(author).toBe("rogersop")
      expect(votes).toBe(34)
    }
    )
  });
  test("Returns requested owner updated with new information (minus votes)", () => {
    return request(app).patch("/api/articles/1").expect(200).send(
      {inc_votes: -34}
    ).then(({body}) => {
      const {article_id, title, author, votes} = body.article;
      expect(article_id).toBe(1)
      expect(title).toBe("Living in the shadow of a great man")
      expect(author).toBe("butter_bridge")
      expect(votes).toBe(66)
    }
    )
  });
  test("400: Returns an error when an article id in the wrong format is requested", () => {
    return request(app).patch("/api/articles/one").expect(400).send(
      {inc_votes: -34})
      .then(({ body }) => {
        expect(body).toMatchObject({ msg: 'bad request' })
    }
    )
});
test("404: Returns an error when passed an article id for an article that does not exist", () => {
  return request(app)
    .patch("/api/articles/999/")
    .expect(404).send(
      {inc_votes: -34})
      .then(({ body }) => {
      expect(body.msg).toBe("not found")
    });
});

test("Returns requested owner updated with new information (minus votes)", () => {
  return request(app).patch("/api/articles/2").expect(400).send(
    {inc_votes: -10}
  ).then(({body}) => {
    expect(body.msg).toBe('votes cannot be less than zero')
  }
  )
});
test("400: Returns an error when the request body is invalid", () => {
  return request(app).patch("/api/articles/4").expect(400).send(
    {inc_votes: "three"}).then(({ body }) => {
    expect(body).toMatchObject({ msg: 'bad request' })
  }
  )
})

test("400: Returns an error when the request body is invalid", () => {
  return request(app).patch("/api/articles/4").expect(400).send(
    {votes: 3}).then(({ body }) => {
    expect(body).toMatchObject({ msg: 'bad request' })
  }
  )
});
})

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: Deletes the comment with the requested comment id", () => {
   return request(app).delete("/api/comments/5").expect(204)
   })

   test("404: Returns an error when comment with requested id does not exist", () => {
    return request(app).delete("/api/comments/999").expect(404).then(({ body }) => {
      expect(body.msg).toBe("not found")
    })
  })
  test("400: Returns an error when an invalid comment_id is requested", () => {
    return request(app).delete("/api/comments/five").expect(400).then(({ body }) => {
      expect(body.msg).toBe("bad request")
    })
  })
  })

  describe("GET /api/users", () => {
    test("200: Responds with an array of all the users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4)
          body.users.forEach((user) => {
            expect(typeof user.username).toBe('string')
            expect(typeof user.name).toBe('string')
            expect(typeof user.avatar_url).toBe('string')
          })
        })
    })

    test("Responds with an error message when given a non-existent end point", () => {
      return request(app)
        .get("/api/user")
        .expect(404).then(({ body }) =>
          expect(body.msg).toEqual('path not found'));
  
    })
  })