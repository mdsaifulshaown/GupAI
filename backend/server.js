const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, chatHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Here you can integrate with any AI service
        // Example with OpenAI (make sure to install: npm install openai)
        const { OpenAI } = require('openai');
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Store in .env file
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                ...chatHistory.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                { role: "user", content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        const aiResponse = completion.choices[0].message.content;

        res.json({ 
            reply: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});