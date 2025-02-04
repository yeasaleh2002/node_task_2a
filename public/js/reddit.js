 // Fetch the top 4 even-numbered Reddit posts from the API
 fetch('http://localhost:3000/api/reddit/top-posts')
 .then(response => response.json())
 .then(posts => {
   const postsContainer = document.getElementById('posts');
   posts.forEach(post => {
     const postCard = document.createElement('div');
     postCard.classList.add('post-card');

     postCard.innerHTML = `
     <div>
     <p>Posted by: ${post.author}</p>
     <h5>${post.title}</h5>
       <a style="color: #DEB64B;" href="${post.link}" target="_blank">Read more &#129133;</a>
     
     </div>`;

     postsContainer.appendChild(postCard);
   });
 })
 .catch(error => {
   console.error('Error fetching posts:', error);
 });