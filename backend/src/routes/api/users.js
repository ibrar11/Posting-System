const express = require('express');
const userController = require('../../controllers/userController')

const router = express();

router.route('/')
        .post(userController.handleRegister)
        .get(userController.getUsers)

router.route('/:id')
        .get(userController.getUser)
        .delete(userController.deleteUser)
        .put(userController.updateUser)

module.exports = router;