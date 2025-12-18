
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const MODELS_TO_TEST = ['gemini-2.5-flash', 'gemini-2.0-flash-exp'];

function testModel(model) {
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const data = JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(URL, options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            console.log(`Model: ${model}`);
            console.log(`Status: ${res.statusCode}`);
            if (res.statusCode !== 200) {
                console.log(`Error: ${responseBody}`);
            } else {
                console.log('Success!');
            }
            console.log('---');
        });
    });

    req.write(data);
    req.end();
}

MODELS_TO_TEST.forEach(testModel);
