const express = require('express');
const router = express.Router();
const { Chat, sequelize } = require('../models');
const redis = require('redis');
const { Op } = require('sequelize');

const redisClient = redis.createClient();
(async () => await redisClient.connect())();

// Get list of users (contacts)
router.get('/users/:currentUserId', async (req, res) => {
  try {
    const { currentUserId } = req.params;
    const existingRandomUsers = req.query.randomUsers ? JSON.parse(req.query.randomUsers) : [];
    
    // Generate random users only if none exist
    const randomUsers = existingRandomUsers.length > 0 ? existingRandomUsers : 
      Array.from({ length: 5 }, () => ({
        userId: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Random User ' + Math.floor(Math.random() * 1000),
        lastSeen: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }));

    // Get existing chat users
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user_id: currentUserId },
          { sender_id: currentUserId }
        ]
      },
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('sender_id')), 'userId'],
      ],
      raw: true
    });

    // Combine random users with existing chat users
    const existingUserIds = new Set(chats.map(chat => chat.userId));
    const allUsers = [
      ...randomUsers.filter(user => !existingUserIds.has(user.userId)),
      ...chats.map(chat => ({
        userId: chat.userId,
        name: 'User ' + chat.userId.substring(5, 10),
        lastSeen: new Date().toISOString()
      }))
    ];

    res.status(200).json({
      users: allUsers,
      randomUsers: randomUsers // Send back random users for storage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history between two users
router.get('/history/:userId/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, sender_id: otherUserId },
          { user_id: otherUserId, sender_id: userId }
        ]
      },
      order: [['created_at', 'ASC']],
      raw: true
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check for new messages from any user
router.get('/check-messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const keys = await redisClient.keys(`lastMessage:${userId}:*`);
    const messages = [];
    
    for (const key of keys) {
      const message = await redisClient.get(key);
      if (message) {
        messages.push({
          message: JSON.parse(message),
          from: key.split(':')[2]
        });
        await redisClient.del(key);
      }
    }
    
    if (messages.length > 0) {
      res.status(200).json(messages);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Polling API for new messages
router.get('/poll/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;
  const lastMessage = await redisClient.get(`lastMessage:${userId}:${otherUserId}`);
  if (lastMessage) {
    await redisClient.del(`lastMessage:${userId}:${otherUserId}`);
    res.status(200).send(lastMessage);
  } else {
    res.status(204).send();
  }
});

// Send message API
router.post('/send', async (req, res) => {
  try {
    const { message, userId, senderId } = req.body;
    if (!message || !userId || !senderId) {
      return res.status(400).send('Message, userId, and senderId are required');
    }

    // Save message to database
    const chat = await Chat.create({
      user_id: userId,
      sender_id: senderId,
      message: message,
    });

    // Store in Redis for real-time updates
    await redisClient.set(`lastMessage:${userId}:${senderId}`, JSON.stringify(chat));
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
