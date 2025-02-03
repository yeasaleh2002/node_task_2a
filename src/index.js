const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./models');
const routes = require('./routes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api', routes);

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/airport', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/airport.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/auth.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chat.html'));
});

app.get('/count', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/count.html'));
});

app.get('/export', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/export.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/payment.html'));
});

app.get('/photo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/photo.html'));
});

app.get('/time', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/time.html'));
});

app.get('/top', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/top.html'));
});

const PORT = process.env.PORT || 3000;

// Database connection and server start
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});