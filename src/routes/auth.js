const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const router = express.Router();
const { User } = require('../models');

router.post('/generate-2fa', async (req, res) => {
  try {
    const { username } = req.body;

    // Find or create user
    const [user] = await User.findOrCreate({
      where: { username },
      defaults: { username }
    });

    const secret = speakeasy.generateSecret({
      name: `${username}@myapp`,
      length: 20,
    });

    // Save secret to database
    await user.update({ secret: secret.base32 });

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code' });
      }

      res.json({
        secret: secret.base32,
        qrCodeUrl: data_url,
      });
    });
  } catch (error) {
    console.error('Error generating 2FA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/verify-2fa', async (req, res) => {
  try {
    const { username, token } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || !user.secret) {
      return res.status(400).json({ message: 'User not found or 2FA not set up' });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: token,
    });

    if (isValid) {
      return res.json({ message: '2FA verified successfully!' });
    } else {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
