// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Replace with your public-facing URL (e.g., ngrok or hosted server)
const PUBLIC_WEBHOOK_URL = 'https://9773-195-249-146-101.ngrok-free.app/webhook';

// Replace with the Exposee registration endpoint
const EXPOSEE_WEBHOOK_URL = 'https://12awebhooksystem.vercel.app/webhooks/register';

// Middleware to parse JSON
app.use(bodyParser.json());

// Webhook listener endpoint
app.post('/webhook', (req, res) => {
  console.log('📬 Received webhook payload:', req.body);
  res.status(200).json({ status: 'received' });
});

// Register webhook with Exposee
const registerWebhook = async () => {
  try {
    const response = await axios.post(EXPOSEE_WEBHOOK_URL, {
      url: PUBLIC_WEBHOOK_URL,
      events: ['order.created', 'order.shipped'],
      description: 'Node.js demo webhook'
    });

    console.log('✅ Webhook successfully registered:', response.data);
  } catch (error) {
    console.error('❌ Error registering webhook:', error.response?.data || error.message);
  }
};

// Start server and register webhook
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at http://localhost:${PORT}`);
  registerWebhook();
});
