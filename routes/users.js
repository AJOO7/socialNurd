const userController = require('../controllers/userController');
const postcontroller = require('../controllers/postcontroller')
const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get('/', userController.userPage);
router.get('/mypost/:id', userController.myPost);
// router.get('/friends/:id', userController.friends);
router.get('/createPost', userController.createPost);
router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);
router.post('/create', userController.create);
router.get('/profile', passport.checkAuthentication, userController.profile);
router.get('/profile/:id', passport.checkAuthentication, userController.friend_profile);
router.get('/profile/follow/:id', passport.checkAuthentication, userController.friend_follow);
router.get('/profile/unfollow/:id', passport.checkAuthentication, userController.friend_unfollow);

router.get('/sign-out', userController.signOut);
router.get('/allusers', userController.allusers);
router.get('/message', userController.userMessage);


router.get('/editor', passport.checkAuthentication, userController.userEditorCreate);
router.get('/editor/:room', passport.checkAuthentication, userController.userEditor);



router.get('/search', userController.userSearch);
router.post('/update/:id', passport.checkAuthentication, userController.update);
// sending on signing up or in with google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// call back where it must see what to do
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/sign-in' }), userController.createSession);

router.post('/create-session', passport.authenticate(
    'local', { failureRedirect: '/users/sign-in' },
), userController.createSession);
module.exports = router;