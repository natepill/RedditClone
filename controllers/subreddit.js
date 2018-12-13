const Post = require('../models/post')


module.exports = function(app) {
    app.get('/n/:subreddit', function(req, res) {
        Post.find({subreddit: req.params.subreddit})
        .then((posts) => {
            res.render("posts-index.handlebars", {posts})
        })
        .catch((err) => {
            console.log(err.data)
        })
    });
}
