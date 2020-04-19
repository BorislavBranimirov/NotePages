const express = require('express');
const router = express.Router();

const { User } = require('../models');

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
        if(!req.body.username || !req.body.password) {
            return res.status(422).json({ err: 'No username or password provided' });
        }

        const userExists = await User.findOne({ username: req.body.username });
        if(userExists) {
            return res.status(500).json({ err: 'User already exists' });
        }

        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        })

        try {
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
        if(!req.body.password) {
            return res.status(422).json({ err: 'No password provided' });
        }

        try {
            const user = await User.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).send({ err: 'User not found' });
            }

            //? replace with compare pass function ones hashing is implemented
            if (req.body.password == user.password) {
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
            return res.json({ success: true });
        } catch (err) {
            return res.status(500).send({ err: 'An error occurred while deleting user' });
        }
    });

module.exports = router;