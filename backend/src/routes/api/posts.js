const express = require('express');
const postController = require('../../controllers/postController');


const router = express();

router.route('/')
        .get(postController.getPosts)
        .post(postController.createPost)

router.route('/:id')
        .get(postController.getPost)
        .put(postController.updatePost)
        .delete(postController.deletePost)

router.route('/all/user')
        .get(postController.getUserPosts)

module.exports = router;