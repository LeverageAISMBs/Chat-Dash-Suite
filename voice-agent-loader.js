
(function() {
  if (!window.geminiVoiceAgentConfig || !window.geminiVoiceAgentConfig.agentId) {
    console.error("Gemini Voice Agent: Agent ID not found in window.geminiVoiceAgentConfig.");
    return;
  }

  const agentId = window.geminiVoiceAgentConfig.agentId;
  const agentDomain = window.geminiVoiceAgentConfig.domain || window.location.origin;
  
  const styles = `
    :root {
      --gemini-voice-bubble-size: 60px;
      --gemini-voice-bubble-color: #8b5cf6; /* violet-500 */
      --gemini-voice-widget-width: 400px;
      --gemini-voice-widget-height: 450px;
      --gemini-voice-widget-spacing: 20px;
    }
    .gemini-voice-bubble {
      position: fixed;
      bottom: var(--gemini-voice-widget-spacing);
      right: var(--gemini-voice-widget-spacing);
      width: var(--gemini-voice-bubble-size);
      height: var(--gemini-voice-bubble-size);
      background-color: var(--gemini-voice-bubble-color);
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
      z-index: 999999;
    }
    .gemini-voice-bubble:hover {
      transform: scale(1.1);
    }
    .gemini-voice-bubble-icon {
      color: white;
      width: 32px;
      height: 32px;
    }
    .gemini-voice-widget-container {
      position: fixed;
      bottom: calc(var(--gemini-voice-widget-spacing) + var(--gemini-voice-bubble-size) + 10px);
      right: var(--gemini-voice-widget-spacing);
      width: var(--gemini-voice-widget-width);
      max-width: 90vw;
      height: var(--gemini-voice-widget-height);
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
    .gemini-voice-widget-container.open {
      transform: scale(1);
      opacity: 1;
    }
    .gemini-voice-widget-iframe {
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
  bubble.className = "gemini-voice-bubble";
  bubble.innerHTML = `<svg class="gemini-voice-bubble-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>`;
  document.body.appendChild(bubble);

  // Create widget container and iframe
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "gemini-voice-widget-container";
  const iframe = document.createElement("iframe");
  iframe.className = "gemini-voice-widget-iframe";
  iframe.src = `${agentDomain}/voice-agent?agentId=${agentId}`;
  widgetContainer.appendChild(iframe);
  document.body.appendChild(widgetContainer);

  // Add event listener
  bubble.addEventListener("click", () => {
    widgetContainer.classList.toggle("open");
  });
})();
