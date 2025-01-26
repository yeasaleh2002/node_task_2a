let lastUpdate = null;

const pollChat = async () => {
  try {
    const response = await fetch(`/api/chat/poll?lastUpdate=${lastUpdate}`);
    if (response.status === 200) {
      const data = await response.json();
      lastUpdate = data.lastUpdate;
      await updateChatMessages();
    }
  } catch (error) {
    console.error('Polling error:', error);
  }
  setTimeout(pollChat, 1000);
};

const updateChatMessages = async () => {
  const response = await fetch('/api/chat/all');
  const messages = await response.json();
  
  const chatDiv = document.getElementById('chat-messages');
  chatDiv.innerHTML = messages.map(msg => `
    <div class="mb-2">${msg}</div>
  `).join('');
  chatDiv.scrollTop = chatDiv.scrollHeight;
};

const sendMessage = async () => {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  await fetch('/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  input.value = '';
};

pollChat(); 