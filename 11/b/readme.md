# Stripe Payment Integration Example

This project demonstrates how to integrate Stripe payments into a Node.js/Express backend and a React frontend.

---

## Features

- Stripe Checkout integration
- Secure backend endpoint for creating payment sessions
- Simple React frontend for checkout

---

## Prerequisites

- Node.js and npm installed
- [Stripe account](https://dashboard.stripe.com/register)

---

## 1. Register Your App with Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/).
2. Get your **Publishable key** and **Secret key** from Developers > API keys.

---

## 2. Configure Environment Variables

Create a `.env` file in your backend project root:

```
STRIPE_SECRET_KEY=your-stripe-secret-key
```

---

## 3. Install Dependencies

In your backend folder, run:

```bash
npm install express cors dotenv stripe
```

---

## 4. Backend Setup

Create a file called `server.js`:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log('Server started on http://localhost:4000'));
```

---

## 5. Frontend Setup

In your React frontend, add a checkout button:

```javascript
function App() {
  const handleCheckout = async () => {
    const res = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div>
      <h1>Stripe Payment Example</h1>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
```

---

## 6. Running the Application

1. **Start the backend:**
   ```bash
   node server.js
   ```
2. **Start the frontend:**
   ```bash
   cd your-frontend-folder
   npm start
   ```
3. **Test the flow:**
   - Click "Checkout"
   - Complete payment in Stripe's checkout page ( See stripe test cards https://docs.stripe.com/testing#cards )
   - You will be redirected to `/success` or `/cancel` on your frontend

---
