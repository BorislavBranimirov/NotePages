const jwt = require('jsonwebtoken');

exports.verifyAccessToken = (req, res, next) => {
    // access token should be supplied in an Authorization header with a Bearer schema
    if (req.headers['authorization'] === undefined ||
        req.headers['authorization'].split(' ')[0] !== 'Bearer') {
        return res.status(401).json({ err: 'Unauthorized' });
    }

    const accessToken = req.headers['authorization'].split(' ')[1];

    try {
        // keep in mind that verify isn't asynchronous
        // https://github.com/auth0/node-jsonwebtoken/issues/111
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // attach the user info to the response object for use in further middleware
        res.locals.user = {
            id: payload.id,
            username: payload.username
        };

        next();
    } catch (err) {
        return res.status(401).json({ err: 'Unauthorized' });
    }
};