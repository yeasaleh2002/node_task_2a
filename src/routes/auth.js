const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const router = express.Router();

// Simulate a "database" (you can use actual DB in real use cases)
const users = {};

// Route to generate 2FA secret and QR code URL
router.post('/generate-2fa', (req, res) => {
  const { username } = req.body;

  // Generate a new secret key for the user
  const secret = speakeasy.generateSecret({
    name: username + '@myapp', // Customize based on your app
    length: 20,
  });

  // Store the secret in the simulated "database"
  users[username] = { secret: secret.base32 };

  // Generate a QR code URL for the 2FA app (Google Authenticator, etc.)
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ message: 'Error generating QR code' });
    }

    // Return the secret and the QR code
    res.json({
      secret: secret.base32,
      qrCodeUrl: data_url,
    });
  });
});

// Route to verify 2FA token
router.post('/verify-2fa', (req, res) => {
  const { username, token } = req.body;

  // Retrieve the user's secret from the simulated "database"
  const user = users[username];

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Verify the token using the secret
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
