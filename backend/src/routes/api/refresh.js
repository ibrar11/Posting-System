const express = require('express');
const handleRefreshToken = require('../../controllers/refreshTokenController');

const router = express();

router.route("/")
        .get(handleRefreshToken);

module.exports = router;