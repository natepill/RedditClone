const Comment = require("../models/comment")
const Post = require("../models/post")
const ObjectId = require('mongodb').ObjectId
const JSON = require('circular-json')

module.exports = function(app) {
    app.post("/posts/:postId/comments", (req, res) => {
        const comment = new Comment(req.body);
        comment.author = req.params.postId
        comment
        .save()
        .then((comment) => {
            return Post.findById(ObjectId(req.params.postId))
        })
        .then((post) => {
            // Keeping the parents ordered collection through the relationship in reverse order
            post.comments.unshift(comment) // Prepends to array of comments reverse chronological order
            return post.save() // Save the post with the newly added comments
         })
         .then((post) => {
             res.redirect(`/posts/${ObjectId(req.params.postId)}`)
         })
        .catch((err) => {
            console.log(err)
        })
    });

    app.get('/posts/:postId/comments/:commentId', (req, res) => {
        Comment.findById(ObjectId(req.params.commentId), function(err, comment) {
            if (!err) {
                console.log('This is the comment ' + comment)
                return res.render('./comment-show', {comment})
            }
            else {
                res.send(JSON.stringify(err))
            }
        })
    });
}
