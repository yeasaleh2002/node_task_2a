const express = require('express');
const router = express.Router();

router.post('/calculate', (req, res) => {
  let amount = parseFloat(req.body.amount) * 100; 
  const denominations = {
    '$20 bills': 2000,
    '$10 bill': 1000,
    '$5 bill': 500,
    '$1 bill': 100,
    '25 cents': 25,
    '10 cents': 10,
    '5 cents': 5,
    '1 cent': 1
  };

  const result = {};
  for (const [name, value] of Object.entries(denominations)) {
    if (amount >= value) {
      result[name] = Math.floor(amount / value);
      amount = amount % value;
    }
  }

  res.json(result);
});

module.exports = router;
