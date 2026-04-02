import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendAIChat } from '../api/portfolio';
import './AIChatPanel.css';

export default function AIChatPanel({ portfolio, summary }) {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // 发送逻辑 → 完全使用你封装的 sendAIChat
    const sendToAI = async () => {
        if (!userInput.trim()) return;

        const userMessage = userInput.trim();
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setUserInput('');
        setAiLoading(true);

        try {
            const response = await sendAIChat({
                portfolio: portfolio,
                summary: summary,
                userMessage: userMessage,
            });

            const aiReply = response?.choices?.[0]?.message?.content || '⚠️ No response';
            setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
        } catch (err) {
            console.error('AI Chat error:', err);
            setMessages([...newMessages, { role: 'assistant', content: '⚠️ Failed to connect AI' }]);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="ai-chat-container">
            <div className="ai-chat-header">
                <h3>AI Portfolio Analyst</h3>
            </div>

            <div className="ai-chat-message-list">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`ai-chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}
                    >
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p style={{ margin: '0.2rem 0' }}>{children}</p>,
                                strong: ({ children }) => <strong>{children}</strong>,
                                ul: ({ children }) => <ul style={{ paddingLeft: '1rem' }}>{children}</ul>,
                                li: ({ children }) => <li>{children}</li>,
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                ))}

                {aiLoading && (
                    <div className="ai-chat-loading">Analyzing your portfolio...</div>
                )}
            </div>

            <div className="ai-chat-input-bar">
                <input
                    type="text"
                    placeholder="Ask for investment advice..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendToAI()}
                />
                <button onClick={sendToAI}>SEND</button>
            </div>
        </div>
    );
}