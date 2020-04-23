const jwt = require('jsonwebtoken');

module.exports.createAccessToken = async (user) => {
    return await jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

module.exports.createRefreshToken = async (user) => {
    return await jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1w' });
};

module.exports.addRefreshCookie = async (req, res, refreshToken) => {
    // 604800000 - one week
    // req.baseUrl - currently /api/auth
    res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 604800000),
        path: req.baseUrl + '/refresh-token',
        httpOnly: true
    });
};

module.exports.clearRefreshCookie = (req, res) => {
    res.clearCookie('refreshToken', {
        path: req.baseUrl + '/refresh-token',
        httpOnly: true
    });
};