const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentcontroller = require('../controllers/commentcontroller');

router.post('/create', passport.checkAuthentication, commentcontroller.create);
router.get('/destroy/:id', passport.checkAuthentication, commentcontroller.destroy);

module.exports = router;