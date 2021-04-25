const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'like'
    }]
}, {
    timestamps: true
})
const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;