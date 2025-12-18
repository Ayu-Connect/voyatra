
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log('Listing available models...');

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            const models = JSON.parse(data).models;
            console.log('Available Models:');
            models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.error('Failed to list models.');
            console.error('Status:', res.statusCode);
            console.error('Response:', data);
        }
    });
}).on('error', (e) => {
    console.error('Network error:', e);
});
