const express = require('express');
const router = express.Router();
const { Chat } = require('../models');
const redis = require('redis');

const redisClient = redis.createClient();
(async () => await redisClient.connect())();

// Polling API
router.get('/poll', async (req, res) => {
  const messages = await redisClient.get('chatroom');
  if (messages) {
    res.status(200).send(messages);
  } else {
    res.status(204).send();
  }
});

// Send message API
router.post('/send', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send('Message is required');

  const messages = JSON.parse((await redisClient.get('chatroom')) || '[]');
  messages.push(message);
  await redisClient.set('chatroom', JSON.stringify(messages));

  res.status(200).send('Message sent');
});

// Get all messages
router.get('/chat/all', async (req, res) => {
  const messages = JSON.parse((await redisClient.get('chatroom')) || '[]');
  res.status(200).json(messages);
});

// Save chat to database
router.post('/save', async (req, res) => {
  const messages = JSON.parse((await redisClient.get('chatroom')) || '[]');
  if (!messages.length) return res.status(400).send('No messages to save');

  await Chat.create({
    chat_messages: JSON.stringify(messages),
  });

  res.status(200).send('Chat saved to database');
});

module.exports = router;
