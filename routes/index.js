var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
  console.log("request came", JSON.stringify(req.params.query));
  res.send({ok: true})
});
router.get('/actionableResource', (req, res) => {
  console.log("request came");
  res.send({ok: true})
});
router.post('/action', (req, res) => {
  console.log("request came");
  res.send({ok: true})
});

module.exports = router;
