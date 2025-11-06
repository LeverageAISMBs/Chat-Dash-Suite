
(function() {
  if (!window.geminiChatbotConfig || !window.geminiChatbotConfig.botId) {
    console.error("Gemini Chatbot: Bot ID not found in window.geminiChatbotConfig.");
    return;
  }

  const botId = window.geminiChatbotConfig.botId;
  const chatDomain = window.geminiChatbotConfig.domain || window.location.origin;

  const styles = `
    :root {
      --gemini-chat-bubble-size: 60px;
      --gemini-chat-bubble-color: #2563eb; /* blue-600 */
      --gemini-chat-widget-width: 400px;
      --gemini-chat-widget-height: 600px;
      --gemini-chat-widget-spacing: 20px;
    }
    .gemini-chat-bubble {
      position: fixed;
      bottom: var(--gemini-chat-widget-spacing);
      right: var(--gemini-chat-widget-spacing);
      width: var(--gemini-chat-bubble-size);
      height: var(--gemini-chat-bubble-size);
      background-color: var(--gemini-chat-bubble-color);
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
      z-index: 999999;
    }
    .gemini-chat-bubble:hover {
      transform: scale(1.1);
    }
    .gemini-chat-bubble-icon {
      color: white;
      width: 32px;
      height: 32px;
    }
    .gemini-chat-widget-container {
      position: fixed;
      bottom: calc(var(--gemini-chat-widget-spacing) + var(--gemini-chat-bubble-size) + 10px);
      right: var(--gemini-chat-widget-spacing);
      width: var(--gemini-chat-widget-width);
      max-width: 90vw;
      height: var(--gemini-chat-widget-height);
      max-height: 80vh;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      border-radius: 12px;
      overflow: hidden;
      transform-origin: bottom right;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      transform: scale(0);
      opacity: 0;
      z-index: 999998;
    }
    .gemini-chat-widget-container.open {
      transform: scale(1);
      opacity: 1;
    }
    .gemini-chat-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `;

  // Inject styles
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Create bubble
  const bubble = document.createElement("div");
  bubble.className = "gemini-chat-bubble";
  bubble.innerHTML = `<svg class="gemini-chat-bubble-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`;
  document.body.appendChild(bubble);

  // Create widget container and iframe
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "gemini-chat-widget-container";
  const iframe = document.createElement("iframe");
  iframe.className = "gemini-chat-widget-iframe";
  iframe.src = `${chatDomain}/chatbot?botId=${botId}`;
  widgetContainer.appendChild(iframe);
  document.body.appendChild(widgetContainer);

  // Add event listener
  bubble.addEventListener("click", () => {
    widgetContainer.classList.toggle("open");
  });
})();
