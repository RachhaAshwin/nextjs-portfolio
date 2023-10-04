import React, { useState } from 'react';
//import axios from 'axios';
//import "../styles/popup.css";

const Popup = () => {
    const [message, setMessage] = useState(''); 
    const [response, setResponse] = useState(''); 
    const [loading, setLoading] = useState(false);

    const sendQuery = async () => {
        setLoading(true);

        // check if the message contains certain keywords
        const keywords = ['hello', 'hi', 'hey'];
        const foundKeyword = keywords.some(keyword => message.toLowerCase().includes(keyword));

        if (foundKeyword) {
            // if the message contains certain keywords, return the cached response
            const cachedResponse = localStorage.getItem('cachedResponse');
            if (cachedResponse) {
                setResponse(cachedResponse);
                setLoading(false);
                return;
            }
        }

        try {
            const result = await axios.post('https://ashwinrachha.onrender.com/query', { query: message });
            setResponse(result.data.response);
            // cache the response
            localStorage.setItem('cachedResponse', result.data.response);
        } catch (error) {
            setResponse('Error communicating with the server.');
        }
        setLoading(false);
    };

    return (
        <div className="chatbox">
            <input 
                type="text" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                className="chat-input"
                placeholder="Type your message..."
            />
            <button onClick={sendQuery} className="chat-send-btn">Send</button>
            <div className="response-box">
                {response}
            </div>
            {loading && <div className="spinner"></div>}
        </div>
    );
};

export default Popup;