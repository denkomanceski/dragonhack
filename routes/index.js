var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
  res.render('index', { title: 'Express' });
});
router.get('/actionableResource', (req, res) => {
  res.render('index', { title: 'Express' });
});
router.post('/action', (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
