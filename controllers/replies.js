var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");
var ObjectId = require('mongodb').ObjectId


module.exports = app => {
    // NEW REPLY
    app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
        let post;
        Post.findById(req.params.postId)
            .then(p => {
                post = p;
                return Comment.findById(req.params.commentId);
            })
            .then(comment => {
                res.render("replies-new", {
                    post,
                    comment
                });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    // CREATE REPLY
    app.post("/posts/:postId/comments/:commentId/replies", (req, res, next) => {
        let newComment = new Comment(req.body);
        console.log('REQUEST BODY ' + JSON.stringify(newComment))

        //     Comment.findById(req.params.commentId)
        //     .then(comment => {
        //         console.log('This is a new comment ' + comment)
        //         comment.replies.unshift(req.body);
        //         return comment.save();
        //     }) 
        //     .then(comment => {
        //         res.redirect(`/posts/${ObjectId(req.params.postId)}`);
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        // });


        Comment.findById(req.params.commentId).then(comment => {
            comment.replies.push(newComment);
            newComment.save()
            console.log(">>>>>> " + comment)
            comment.save()
            res.redirect(`/posts/${req.params.postId}`);
        }).catch(error => {
            Promise.reject(new Error(error));
        });


    });
}