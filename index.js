const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');

const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

app.use(express.json());
app.use(cors({ origin: 'https://amazon-clone-amber-psi.vercel.app' }));

app.post('/checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: 'https://amazon-clone-amber-psi.vercel.app/success',
      cancel_url: 'https://amazon-clone-amber-psi.vercel.app/cancel',
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

app.listen(8000);
