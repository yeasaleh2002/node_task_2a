const express = require('express');
const router = express.Router();
const axios = require('axios'); // We will use axios to make the HTTP request to Reddit

// Fetch top 4 even-numbered posts from /r/programming
router.get('/top-posts', async (req, res) => {
  try {
    const response = await axios.get('https://www.reddit.com/r/programming.json');
    const posts = response.data.data.children;

    // Filter to get the even-numbered posts (2nd, 4th, etc.)
    const evenPosts = posts.filter((_, index) => (index + 1) % 2 === 0).slice(0, 4); // Get top 4 even posts
    
    const result = evenPosts.map(post => ({
      title: post.data.title,
      link: `https://reddit.com${post.data.permalink}`,
      author: post.data.author,
      
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    res.status(500).json({ error: 'Error fetching Reddit posts' });
  }
});

module.exports = router;
