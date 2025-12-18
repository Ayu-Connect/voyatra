
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const data = JSON.stringify({
    contents: [{
        parts: [{
            text: "Hello, this is a test."
        }]
    }]
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Testing API Key with model: ${MODEL}...`);

const req = https.request(URL, options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        if (res.statusCode === 200) {
            console.log('Success! API Key is working.');
            try {
                const parsed = JSON.parse(responseBody);
                if (parsed.candidates && parsed.candidates[0].content) {
                    console.log('Response content received.');
                } else {
                    console.log('Unexpected response structure:', responseBody);
                }
            } catch (e) {
                console.log('Error parsing JSON:', e);
            }
        } else {
            console.error('API Request Failed.');
            console.error('Response:', responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error('Network Error:', error);
});

req.write(data);
req.end();
