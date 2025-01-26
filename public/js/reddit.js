const updateRedditFeed = async () => {
  const response = await fetch('/api/reddit');
  const posts = await response.json();
  
  const feedDiv = document.getElementById('reddit-feed');
  feedDiv.innerHTML = posts.map(post => `
    <div class="bg-gray-50 p-4 rounded">
      <a href="${post.link}" class="text-blue-600 hover:underline" target="_blank">
        ${post.title}
      </a>
      <p class="text-sm text-gray-600">Posted by ${post.author}</p>
    </div>
  `).join('');
};

updateRedditFeed();
setInterval(updateRedditFeed, 300000); // Update every 5 minutes 