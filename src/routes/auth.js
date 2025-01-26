const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const router = express.Router();

const users = {};

router.post('/generate-2fa', (req, res) => {
  const { username } = req.body;

  const secret = speakeasy.generateSecret({
    name: username + '@myapp', // Customize based on your app
    length: 20,
  });

  users[username] = { secret: secret.base32 };

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ message: 'Error generating QR code' });
    }

    res.json({
      secret: secret.base32,
      qrCodeUrl: data_url,
    });
  });
});

router.post('/verify-2fa', (req, res) => {
  const { username, token } = req.body;

  const user = users[username];

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
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
});

module.exports = router;
