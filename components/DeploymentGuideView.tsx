
import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
        <code className="text-green-300">{children}</code>
    </pre>
);

export const DeploymentGuideView: React.FC = () => {
    const chatbotEmbedCode = `<script>
    window.geminiChatbotConfig = {
        botId: "your-bot-id"
    };
</script>
<script src="/chatbot-loader.js" async defer></script>`;

    const voiceAgentEmbedCode = `<script>
    window.geminiVoiceAgentConfig = {
        agentId: "your-agent-id"
    };
</script>
<script src="/voice-agent-loader.js" async defer></script>`;

    return (
        <div className="p-8 space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white">Deployment Guide</h1>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-blue-400">Step 1: Host Your Gemini Suite</h2>
                <p className="text-gray-300">
                    Before you can embed any agents, this entire Gemini Suite application must be deployed to a public URL. This is the most crucial step. You can use services like Vercel, Netlify, Cloudflare Pages, or your own web server.
                </p>
                <p className="text-gray-300">
                    Once deployed, you will have a public domain. Let's assume your domain is:
                </p>
                <CodeBlock>https://your-gemini-suite-url.com</CodeBlock>
                <p className="text-gray-300">
                    You will use this URL in the next steps to load the agent scripts on your other websites.
                </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-blue-400">Step 2: Embed a Chatbot</h2>
                <p className="text-gray-300">
                    Navigate to the <span className="font-bold text-white">Chatbots</span> view, find the bot you want to deploy, and click the "Embed" button. You will see a code snippet like this:
                </p>
                <CodeBlock>{chatbotEmbedCode}</CodeBlock>
                <p className="text-gray-300">
                    To make this work on your production website, you <strong className="text-yellow-300">must</strong> replace the relative script path <code className="bg-gray-700 p-1 rounded text-yellow-300">/chatbot-loader.js</code> with the full, absolute URL from Step 1.
                </p>
                <p className="font-semibold text-white">Example:</p>
                <CodeBlock>{`<script src="https://your-gemini-suite-url.com/chatbot-loader.js" async defer></script>`}</CodeBlock>
                <p className="text-gray-300">
                    Copy the complete, updated snippet and paste it just before the closing <code className="bg-gray-700 p-1 rounded text-yellow-300">&lt;/body&gt;</code> tag of your website.
                </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-blue-400">Step 3: Embed a Voice Agent</h2>
                <p className="text-gray-300">
                    The process for voice agents is identical. Go to the <span className="font-bold text-white">Voice Agents</span> view and click "Embed" on your chosen agent.
                </p>
                <p className="text-gray-300">
                    You will get a snippet like this:
                </p>
                <CodeBlock>{voiceAgentEmbedCode}</CodeBlock>
                 <p className="text-gray-300">
                    Again, replace <code className="bg-gray-700 p-1 rounded text-yellow-300">/voice-agent-loader.js</code> with the full URL from Step 1.
                </p>
                <p className="font-semibold text-white">Example:</p>
                <CodeBlock>{`<script src="https://your-gemini-suite-url.com/voice-agent-loader.js" async defer></script>`}</CodeBlock>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold text-blue-400">Troubleshooting</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><strong className="text-white">The bubble doesn't appear:</strong> Open your browser's developer console (F12). Check the 'Console' and 'Network' tabs for 404 errors. This usually means the URL to your loader script is incorrect.</li>
                    <li><strong className="text-white">The chat window is blank or shows an error:</strong> Ensure your Gemini Suite application is running correctly at its hosted URL. Check the console for any errors originating from the iframe.</li>
                    <li><strong className="text-white">Voice Agent doesn't work:</strong> Voice agents require a secure context (HTTPS) to access the microphone. Ensure both your parent site and the Gemini Suite are served over HTTPS. The browser will also prompt for microphone permission.</li>
                </ul>
            </div>
        </div>
    );
};
