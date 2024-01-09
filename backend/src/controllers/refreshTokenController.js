const { users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookie.jwt;
    const user = await users.findOne( { where: {refreshToken} } );
    if (!user) {
        res.sendStatus(403);
    }
    jwt.verify (
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user.name !== decoded.username ) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign (
                {"username": user.name},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            );
            res.json( {accessToken} );
        }
    );
}

module.exports = handleRefreshToken ;
