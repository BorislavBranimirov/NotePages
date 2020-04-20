const express = require('express');
const router = express.Router();

const { User, Note } = require('../models');

router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while searching for users' });
        }
    })
    .post(async (req, res, next) => {
        // both username and password need to be provided
        if (!req.body.username || !req.body.password) {
            return res.status(422).json({ err: 'No username or password provided' });
        }

        try {
            const userExists = await User.findOne({ username: req.body.username });
            if (userExists) {
                return res.status(500).json({ err: 'User already exists' });
            }

            // construct new user record
            const newUser = new User({
                username: req.body.username,
                password: req.body.password
            })

            const user = await newUser.save();
            return res.json({
                success: true,
                id: user._id,
                username: user.username
            });
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while creating user' });
        }
    });

router.route('/:username')
    .get(async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.params.username });
            return res.json(user);
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while searching for user' });
        }
    })
    .patch(async (req, res, next) => {
        // password needs to be provided
        if (!req.body.password) {
            return res.status(422).json({ err: 'No password provided' });
        }

        try {
            const user = await User.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).send({ err: 'User not found' });
            }

            // use user's comparePassword method to check if new password matches the current one
            if (await user.comparePassword(req.body.password)) {
                return res.status(422).send({ err: 'This is already your current password' });
            }

            user.password = req.body.password;

            const patchedUser = await user.save();
            return res.json({
                success: true,
                id: patchedUser._id,
                username: patchedUser.username
            });
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while updating user' });
        }
    })
    .delete(async (req, res, next) => {
        try {
            const user = await User.findOneAndDelete({ username: req.params.username });
            if (!user) {
                return res.status(404).send({ err: 'User not found' });
            }

            // delete all note record with the author's id
            await Note.deleteMany({ authorId: user._id }).catch((err) => {
                return res.status(500).send({ err: 'An erroor occurred while deleting user notes' });
            });

            return res.json({ success: true });
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while deleting user' });
        }
    });

module.exports = router;