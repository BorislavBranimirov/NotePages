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
            }, process.env.AUTH_SECRET, { expiresIn: '15m' });

            return res.json({
                accessToken: accessToken
            });
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while trying to log in' });
        }
    });

module.exports = router;