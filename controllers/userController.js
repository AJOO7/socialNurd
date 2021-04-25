const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const { v4: uuidV4 } = require('uuid');
// module.exports.create = function (req, res) {
//     if (req.body.password != req.body.confirm_password) {
//         req.flash('error', 'incorrect password');
//         return res.redirect('back');

//     }

//     User.findOne({ email: req.body.email }, function (err, user) {
//         if (err) { console.log('error in finding user in signing up'); return }

//         if (!user) {
//             User.create(req.body, function (err, user) {
//                 if (err) { console.log('error in creating user while signing up'); return }
//                 req.flash('success', 'User created Successfully!');
//                 return res.redirect('back');
//             })
//         } else {
//             req.flash('error', 'invalid user');
//             return res.redirect('back');
//         }

//     });
// }

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { req.flash('error', err); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { req.flash('error', err); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('error', 'already signedIn');
        return res.render('profile', {
            title: 'User Profile'
        });
    }


    return res.render('user-signup', {
        title: "Codeial | Sign Up"
    })
}
// render the sign in page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        req.flash('error', 'already signedIn');
        return res.render('profile', {
            title: 'User Profile'
        });
    }
    return res.render('user-signin', {
        title: 'signin'
    });
}
module.exports.profile = function (req, res) {
    return res.render('profile', {
        title: 'User Profile'
    })
}
module.exports.friend_profile = async function (req, res) {
    let user = await User.findById(req.params.id);
    let currentUser = await User.findById(req.user.id);
    user = await user.populate('friends').execPopulate();
    let present = 0;
    currentUser.friends.forEach(function (value, index, array) {
        // console.log("testing", value._id);
        if (value._id == req.params.id) {
            present = 1;
            // console.log("found", value._id);

        }
    })

    return res.render('profile_friend', {
        title: 'Friend Profile',
        profile_user: user,
        Present: present,
    });

}
module.exports.friend_follow = async function (req, res) {
    // console.log("main", req.user.id);
    // console.log("friend", req.params.id);
    // User.findById(req.params.id, function (err, user) {
    //     return res.render('profile_friend', {
    //         title: 'Friend Profile',
    //         profile_user: user
    //     });
    // });

    try {
        let user = await User.findById(req.user.id);

        user.friends.push(req.params.id);

        // user.populate('friends', 'name').execPopulate();
        user.save();


        return res.redirect(`/users/profile/${req.params.id}`);
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}
module.exports.friend_unfollow = async function (req, res) {
    // console.log("main", req.user.id);
    // console.log("friend", req.params.id);
    // User.findById(req.params.id, function (err, user) {
    //     return res.render('profile_friend', {
    //         title: 'Friend Profile',
    //         profile_user: user
    //     });
    // });

    try {
        let user = await User.findById(req.user.id);
        user.friends.pull(req.params.id);
        user.save();
        // console.log("unfollow friend", friend._id);

        // user.friends.pop(req.params.id);

        // // user.populate('friends', 'name').execPopulate();
        // user.save();


        return res.redirect(`/users/profile/${req.params.id}`);
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}
module.exports.createSession = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'loggedIn successfully!');
        // return res.redirect('/users/profile');
        return res.redirect('/users');

    }
    return res.render('user-signin', {
        title: 'signin'
    });
}
module.exports.signOut = function (req, res) {
    req.logout();
    req.flash('success', 'logOut successful!');
    return res.redirect('/');

}
module.exports.createPost = function (req, res) {
    if (req.isAuthenticated()) {
        return res.render('user-post', {
            title: "user post"
        });
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}





module.exports.userPage = async function (req, res) {
    if (req.isAuthenticated()) {
        try {
            let posts = await Post.find({})
                .sort('-createdAt')
                .populate('user')
                .populate({
                    path: 'comment',
                    populate: {
                        path: 'user',
                    },
                    // populate: {
                    //     path: 'likes',
                    // }
                })
                .populate('likes');

            let users = await User.find({});
            return res.render('user-home', {
                title: "user Home",
                posts: posts,
                all_users: users,
            });
        } catch (err) {
            console.log('Error', err);
            return;
        }

    }
    return res.render('user-signin', {
        title: 'signin'
    });

}






module.exports.myPost = async function (req, res) {
    if (req.isAuthenticated()) {
        try {
            let posts = await Post.find({})
                .sort('-createdAt')
                .populate('user')
                .populate({
                    path: 'comment',
                    populate: {
                        path: 'user',
                    },
                })
                .populate('likes');
            let users = await User.find({});
            return res.render('self-home', {
                title: "user Home",
                posts: posts,
                all_users: users,
                postId: req.params.id,
            });
        } catch (err) {
            console.log('Error', err);
            return;
        }
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}






module.exports.allusers = async function (req, res) {
    if (req.isAuthenticated()) {
        let users = await User.find({}).sort({ name: 1 });
        return res.render('all-users', {
            title: "all users",
            all_users: users,
        });
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}
// module.exports.friends = async function (req, res) {
//     if (req.isAuthenticated()) {
//         let user = await User.findById(req.params.id);
//         user = await user.populate('friends').execPopulate();
//         let friends = await user.friends.find({}).sort({ name: 1 }).toArray();
//         // let paramsId = req.params.id;
//         // let user = await User.find({ paramsId }).sort({ name: 1 });
//         return res.render('friend', {
//             title: "friend",
//             all_users: friends,
//         });
//     }
//     return res.render('user-signin', {
//         title: 'signin'
//     });

// }
module.exports.userMessage = function (req, res) {
    if (req.isAuthenticated()) {
        return res.render('user-message', {
            title: "user Message"
        });
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}
module.exports.userEditorCreate = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect(`/users/editor/${uuidV4()}`);
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}
module.exports.userEditor = function (req, res) {
    if (req.isAuthenticated()) {
        return res.render('user-editor', {
            title: "user editor",
            roomId: req.params.room,
        });
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}
module.exports.userSearch = function (req, res) {
    if (req.isAuthenticated()) {
        return res.render('user-search', {
            title: "user Search"
        });
    }
    return res.render('user-signin', {
        title: 'signin'
    });

}
module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('error!');
                }
                user.name = req.body.name;
                // user.email = req.body.email;
                user.dob = req.body.dob;
                user.country = req.body.country;
                user.bio = req.body.bio;


                if (req.file) {

                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }


    } else {
        req.flash('error', 'update failed');
        res.redirect('back');
    }
}