import { useState } from 'react';
import axios from 'axios';

export default function Chat({ videoId }) {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);

    const askQuestion = async () => {
        const userMsg = { sender: 'user', text: query };
        setMessages([...messages, userMsg]);

        const res = await axios.post('http://localhost:5000/api/chat/ask', { videoId, question: query });
        
        const botMsg = { sender: 'bot', text: res.data.answer, sources: res.data.sources };
        setMessages([...messages, userMsg, botMsg]);
        setQuery('');
    };

    return (
        <div className="border p-4 h-96 overflow-y-auto">
            {messages.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <p className="bg-gray-200 inline-block p-2 rounded">{msg.text}</p>
                    {/* Time Chips[cite: 2] */}
                    {msg.sources && msg.sources.map((src, j) => (
                        <button key={j} className="text-xs bg-blue-100 text-blue-800 ml-2 px-1 rounded cursor-pointer">
                            {Math.floor(src.start)}s - {Math.floor(src.end)}s
                        </button>
                    ))}
                </div>
            ))}
            <div className="mt-4 flex">
                <input value={query} onChange={(e) => setQuery(e.target.value)} className="border p-2 flex-grow" placeholder="Ask a question..." />
                <button onClick={askQuestion} className="bg-green-500 text-white px-4">Ask</button>
            </div>
        </div>
    );
}