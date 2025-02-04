const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51IWQUwH8oljXErmds28KftkL6o6jYIcPgYbBdfEmCPSuAlIh0fgoS4NADcCmsIZbdQ3p5nbAeCOcGkSmo38U9BIe00BdOenrqo');

// Create a checkout session for analytics upgrade
router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Analytics Service Upgrade',
                            description: 'Unlimited analytics tracking for your dashboard',
                        },
                        unit_amount: 500,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/analytics-success`,
            cancel_url: `${req.headers.origin}/`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Payment successful for session:', session.id);
    }

    res.json({ received: true });
});

module.exports = router;
