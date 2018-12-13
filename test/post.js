const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../server.js")
const Post = require("../models/post")

const samplePost = {
    title: "Test Post",
    url: "https://www.test.com",
    summary: "This is a test post"
}

describe("Posts", () => {
    it("should create with valid attributes at POST /posts", done => {
        Post.findOneAndRemove(samplePost, function()  {
            Post.find(function(err, posts) {
              var postCount = Object.keys(posts).length;
              console.log('This is the post count ' + postCount)
              chai
                .request(app)
                .post("/posts")
                .send(samplePost)
                .then(res => {
                  Post.find(function(err, posts) {
                    postCount.should.be.equal(posts.length - 1);
                    res.should.have.status(200);
                    return done();
                  });
                })
                .catch(err => {
                  return done(err);
                });
            });
        });
    });
});


// Post.find(function(err, posts) {
//   var postCount = posts.count;
//   chai
//     .request(app)
//     .post("/posts")
//     .send(samplePost)
//     .then(res => {
//       Post.find(function(err, posts) {
//         postCount.should.be.equal(posts.length - 1);
//         res.should.have.status(200);
//         return done();
//       });
//     })
//     .catch(err => {
//       return done(err);
//     });
// });
