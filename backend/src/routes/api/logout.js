const express = require('express');
const handleLogout = require('../../controllers/logoutController');

const router = express();

router.route("/")
        .get(handleLogout);

module.exports = router;