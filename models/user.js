const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatar')
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
    },
    links: [{
        type: String,
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    dob: {
        type: String,
    },
    country: {
        type: String,
    },
    postlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]

}, {
    timestamps: true
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
UserSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
UserSchema.statics.avatarPath = AVATAR_PATH;
const User = mongoose.model('user', UserSchema);
module.exports = User;