const express = require('express');
const router = express.Router();

const { User } = require('../models');
const jwt = require('jsonwebtoken');

router.route('/login')
    .post(async (req, res, next) => {
        // both username and password need to be provided
        if (!req.body.username || !req.body.password) {
            return res.status(422).json({ err: 'No username or password provided' });
        }

        const usernamePattern = /^[a-zA-Z0-9]{6,25}$/;
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}$/;
        if (!usernamePattern.test(req.body.username) || !passwordPattern.test(req.body.password)) {
            return res.status(422).json({err: 'Invalid username or password'});
        }

        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(422).json({ err: 'Wrong username or password' });
            }

            const isMatch = await user.comparePassword(req.body.password);
            if (!isMatch) {
                return res.status(422).json({ err: 'Wrong username or password' });
            }

            const accessToken = await jwt.sign({
                id: user._id,
                username: user.username
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            const refreshToken = await jwt.sign({
                id: user._id,
                username: user.username
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1w' });

            // 604800000 - one week
            // req.baseUrl - currently /api/auth
            res.cookie('refreshToken', refreshToken, {
                expires: new Date(Date.now() + 604800000),
                path: req.baseUrl + '/refresh-token',
                httpOnly: true
            });

            return res.json({
                accessToken: accessToken
            });
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while trying to log in' });
        }
    });

router.route('/refresh-token')
    .post(async (req, res, next) => {
        // refresh token should be supplied in a cookie
        if (req.cookies.refreshToken === undefined) {
            return res.status(401).json({ err: "No refresh token provided" });
        }

        const refreshToken = req.cookies.refreshToken;

        try {
            // keep in mind that verify isn't asynchronous
            // https://github.com/auth0/node-jsonwebtoken/issues/111
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            const user = await User.findOne({ username: payload.username });
            if (!user) {
                return res.status(422).json({ err: 'User doesn\'t exist' });
            }

            const newAccessToken = await jwt.sign({
                id: user._id,
                username: user.username
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            const newRefreshToken = await jwt.sign({
                id: user._id,
                username: user.username
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1w' });

            // 604800000 - one week
            // req.baseUrl - currently /api/auth
            res.cookie('refreshToken', newRefreshToken, {
                expires: new Date(Date.now() + 604800000),
                path: req.baseUrl + '/refresh-token',
                httpOnly: true
            });

            return res.json({
                accessToken: newAccessToken
            });
        } catch (err) {
            // if refresh token is expired send a 401, the user should log in again to receive a new one
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ err: "Unauthorized" });
            }
            return res.status(500).json({ err: "An error occurred while refreshing token" });
        }
    });

module.exports = router;