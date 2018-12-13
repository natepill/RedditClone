const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],

})

CommentSchema.pre('find', function(next) {
    this.populate('replies');
    next();
  });

module.exports = mongoose.model("Comment", CommentSchema);