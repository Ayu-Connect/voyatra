# Travel Buddy App (Vikhyat)

A collaborative travel planning application with AI-powered recommendations and group chat features.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel / Render / Railway

## Features
- Group Trip Planning
- Budget Tracking
- Live Group Chat with AI Assistant
- Interactive Map (Leaflet.js)
- Travel Recommendations

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vikhyat
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your Gemini API Key in `.env`
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Locally**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel
This project includes a `vercel.json` for easy deployment.
1. Install Vercel CLI or connect GitHub repo to Vercel dashboard.
2. Set Environment Variables (`GEMINI_API_KEY`) in Vercel.
3. Deploy!

### Render/Railway
1. Connect GitHub repo.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add Environment Variables.

## Security Note
This project uses a backend proxy (`server.js`) to protect API keys. Never commit your `.env` file.
