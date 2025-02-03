const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51IWQUwH8oljXErmds28KftkL6o6jYIcPgYbBdfEmCPSuAlIh0fgoS4NADcCmsIZbdQ3p5nbAeCOcGkSmo38U9BIe00BdOenrqo');
const { StripeSubscription } = require('../models');

// Route to create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    if (!amount || !currency || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,  
      currency: currency,
      metadata: { userId },
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret, 
      paymentIntentId: paymentIntent.id,
      publicKey: 'pk_test_51IWQUwH8oljXErmdg6L4MhsuB6tDdmumlHFfyNaopty2U27pmRcqMX1c868zn838lGQtU1eYV6bKRSQtMFWf36VT00aNsvnTOE'
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message || 'Error creating payment intent' });
  }
});

// Route to confirm payment & save in DB
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, userId } = req.body;

    if (!paymentIntentId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch Payment Intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Save to Database
      await StripeSubscription.create({
        userId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.json({ success: true, message: 'Payment successful & stored in DB' });
    } else {
      res.status(400).json({ error: `Payment not completed. Status: ${paymentIntent.status}` });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message || 'Error confirming payment' });
  }
});

module.exports = router;
