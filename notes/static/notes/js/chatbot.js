// ================== AI Chatbot ==================
const openChatbot = document.getElementById("openChatbot");

openChatbot.addEventListener("click", (e) => {
  e.preventDefault();
  chatbotModal.style.display = "flex";
  chatInput.focus();
});

closeChatbot.addEventListener("click", () => {
  chatbotModal.style.display = "none";
});

// Close on outside click
chatbotModal.addEventListener("click", (e) => {
  if (e.target === chatbotModal) {
    chatbotModal.style.display = "none";
  }
});

// Send on Enter key
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendChat.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // Add user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "user-msg";
  userMsgDiv.textContent = message;
  chatMessages.appendChild(userMsgDiv);
  
  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Disable input while processing
  chatInput.disabled = true;
  sendChat.disabled = true;

  // Add typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch("/notes/chatbot/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    
    // Remove typing indicator
    typingDiv.remove();

    if (data.error) {
      throw new Error(data.error);
    }

    // Add bot response
    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "bot-msg";
    botMsgDiv.textContent = data.reply;
    chatMessages.appendChild(botMsgDiv);
    
  } catch (error) {
    typingDiv.remove();
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "bot-msg";
    errorDiv.textContent = "Sorry, I encountered an error. Please try again.";
    errorDiv.style.color = "#ff6b6b";
    chatMessages.appendChild(errorDiv);
  } finally {
    chatInput.disabled = false;
    sendChat.disabled = false;
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}