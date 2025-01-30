const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const StripeSubscription = require('../models');

// Route to create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    // 1️⃣ Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,  
      currency: currency,
      metadata: { userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Error creating payment intent' });
  }
});

// Route to confirm payment & save in DB
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, userId } = req.body;

    // 2️⃣ Fetch Payment Intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // 3️⃣ Save to Database
      await StripeSubscription.create({
        userId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      });

      res.json({ message: 'Payment successful & stored in DB' });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).send({ error: 'Error confirming payment' });
  }
});

module.exports = router;
