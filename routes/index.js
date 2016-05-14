var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
  res.send({ok: true})
  console.log("request came");
});
router.get('/actionableResource', (req, res) => {
  res.send({ok: true})
  console.log("request came");
});
router.post('/action', (req, res) => {
  res.send({ok: true})
  console.log("request came");
});

module.exports = router;
