const express = require('express');
const router = express.Router();

const { User, Note } = require('../models');
const userUtils = require('../utils/userUtils');
const { verifyAccessToken } = require('../controllers/authController');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 });
      return res.json(users);
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while searching for users' });
    }
  })
  .post(async (req, res) => {
    if (!req.body.username || !req.body.password) {
      return res.status(422).json({ err: 'No username or password provided' });
    }

    if (!userUtils.usernamePatternTest(req.body.username)) {
      return res.status(422).json({ err: 'Invalid username' });
    }
    if (!userUtils.passwordPatternTest(req.body.password)) {
      return res.status(422).json({ err: 'Invalid password' });
    }

    try {
      const userExists = await User.findOne({ username: req.body.username });
      if (userExists) {
        return res.status(500).json({ err: 'User already exists' });
      }

      // construct new user record
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });

      const user = await newUser.save();
      return res.json({
        success: true,
        id: user._id,
        username: user.username,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while creating user' });
    }
  });

router
  .route('/:username')
  .get(async (req, res) => {
    try {
      const user = await User.findOne(
        { username: req.params.username },
        { password: 0 }
      );
      return res.json(user);
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while searching for user' });
    }
  })
  .patch(verifyAccessToken, async (req, res) => {
    if (!req.body.password) {
      return res.status(422).json({ err: 'No password provided' });
    }

    if (!userUtils.passwordPatternTest(req.body.password)) {
      return res.status(422).json({ err: 'Invalid password' });
    }

    if (req.params.username !== res.locals.user.username) {
      return res.status(401).json({ err: 'Unauthorized to edit this user' });
    }

    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        return res.status(404).json({ err: 'User not found' });
      }

      if (await user.comparePassword(req.body.password)) {
        return res
          .status(422)
          .json({ err: 'This is already your current password' });
      }

      user.password = req.body.password;

      const patchedUser = await user.save();
      return res.json({
        success: true,
        id: patchedUser._id,
        username: patchedUser.username,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while updating user' });
    }
  })
  .delete(verifyAccessToken, async (req, res) => {
    if (req.params.username !== res.locals.user.username) {
      return res.status(401).json({ err: 'Unauthorized to delete this user' });
    }

    try {
      const user = await User.findOneAndDelete({
        username: req.params.username,
      });
      if (!user) {
        return res.status(404).json({ err: 'User not found' });
      }

      // delete all note records with the author's id
      await Note.deleteMany({ authorId: user._id }).catch(() => {
        return res
          .status(500)
          .json({ err: 'An error occurred while deleting user notes' });
      });

      return res.json({ success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ err: 'An error occurred while deleting user' });
    }
  });

module.exports = router;
