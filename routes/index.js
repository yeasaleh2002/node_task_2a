var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/airport', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/airport.html'));
});

router.get('/auth', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/auth.html'));
});

router.get('/chat', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/chat.html'));
});

router.get('/count', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/count.html'));
});

router.get('/export', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/export.html'));
});

router.get('/payment', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/payment.html'));
});

router.get('/photo', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/photo.html'));
});

router.get('/time', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/time.html'));
});

router.get('/top', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/top.html'));
});

module.exports = router;
