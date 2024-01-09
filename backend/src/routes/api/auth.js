const express = require('express');
const authController = require('../../controllers/authController');

const router = express();

router.route("/")
        .post(authController.handleAuth);

module.exports = router;