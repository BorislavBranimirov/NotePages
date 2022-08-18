const express = require('express');
const router = express.Router();

const { User } = require('../models');
const jwt = require('jsonwebtoken');
const authUtils = require('../utils/authUtils');
const userUtils = require('../utils/userUtils');

router.route('/login').post(async (req, res) => {
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
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(422).json({ err: 'Wrong username or password' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(422).json({ err: 'Wrong username or password' });
    }

    const accessToken = authUtils.createAccessToken(user);

    const refreshToken = authUtils.createRefreshToken(user);

    authUtils.addRefreshCookie(req, res, refreshToken);

    return res.json({
      accessToken: accessToken,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ err: 'An error occurred while trying to log in' });
  }
});

router.route('/refresh-token').post(async (req, res) => {
  // refresh token should be supplied in a cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ err: 'No refresh token provided' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ username: payload.username });
    if (!user) {
      return res.status(422).json({ err: "User doesn't exist" });
    }

    const newAccessToken = authUtils.createAccessToken(user);

    const newRefreshToken = authUtils.createRefreshToken(user);

    authUtils.addRefreshCookie(req, res, newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    // if refresh token is expired send a 401, the user should log in again to receive a new one
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ err: 'Unauthorized' });
    }
    return res
      .status(500)
      .json({ err: 'An error occurred while refreshing token' });
  }
});

router.route('/logout').post(async (req, res) => {
  authUtils.clearRefreshCookie(req, res);
  return res.json({ success: true });
});

module.exports = router;
