var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
  console.log("request came", JSON.stringify(req.params));
  var obj = {
    '$type': 'ActionableResourceAvailability_20',
    'Mode': 'Action',
    'ActionableResourceId': `test.chatstream.${req.query.contextType}`
  };
  res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.15+json');
  res.send(obj)
});
router.get('/actionableResource', (req, res) => {
  console.log("request came");
  res.send({ok: true})
});
router.get('/actionableResource/:actionableResourceId', (req, res) => {
  console.log("request came", JSON.stringify(req.params));
  res.send({ok: true})
});
router.post('/action', (req, res) => {
  console.log("request came");
  res.send({ok: true})
});

module.exports = router;
