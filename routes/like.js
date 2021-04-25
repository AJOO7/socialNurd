const express = require('express');

const router = express.Router();
const likesController = require('../controllers/likecontroller');


router.post('/toggle', likesController.toggleLike);


module.exports = router;