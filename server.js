require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname)));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// ================= API =================
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const context =
            "You are a participant in a group travel chat for a trip to India. Be helpful, friendly, and concise. Keep responses under 50 words.";

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${context}\n\nUser: ${message}\nResponse:`
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// ✅ Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index7.html'));
});

// ❗ REQUIRED for Vercel
module.exports = app;

// ✅ Start server ONLY if running locally
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

