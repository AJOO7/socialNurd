const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    subject: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    heading: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'like'
    }]
}, {
    timestamps: true
})
const Post = mongoose.model('post', PostSchema);
module.exports = Post;