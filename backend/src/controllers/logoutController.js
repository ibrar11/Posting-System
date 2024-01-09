const { users } = require('../models');

const handleLogout = async (req,res) => {
    // on Client, also delete the accessToken

    const cookie = req.cookies;
    if(!cookie?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookie.jwt;
    const user = await users.findOne({where : {refreshToken}});

    if(!user) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    user.refreshToken = '';
    await user.save();
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
};

module.exports = handleLogout ;