const express = require('express');
const  commentController  = require('../../controllers/commentController');


const router = express();

router.route('/')
        .post(commentController.generateComment)
        .get(commentController.getComments)

router.route('/:id')
        .get(commentController.getComment)
        .put(commentController.updateComment)
        .delete(commentController.deleteComment)

router.route('/post/:id')
        .get(commentController.getPostComments)

router.route('/all/user')
        .get(commentController.getUserComments)

module.exports = router;