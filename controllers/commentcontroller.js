const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailer/comment_mailer');
const Like = require('../models/like');

module.exports.create = async function (req, res) {

    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });


            comment = await comment.populate('user').execPopulate();
            // commentMailer.newComment(comment);
            console.log("YES0", comment.user.name);
            if (req.xhr) {
                // Similar for comments to fetch the user's id!

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }
            post.comment.push(comment);
            post.save();

            req.flash('success', 'Comment published!');

            res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }

}


module.exports.destroy = async function (req, res) {

    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            await Like.deleteMany({ likeable: comment._id, onModel: 'comment' });

            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            // req.flash('success', 'Comment deleted!');
            req.flash('success', 'Comment deleted!');


            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;

    }

}