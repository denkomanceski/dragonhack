var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
    console.log("request came", JSON.stringify(req.params));
    var obj = {
        '$type': 'ActionableResourceAvailability_20',
        'Mode': 'Action',
        'ActionableResourceId': '1234567'
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.15+json');
    res.send(obj)
});
router.get('/actionableResource', (req, res) => {
    console.log("request came", JSON.stringify(req.params));
    var assistant_chat_bubble = 'Hello and welcome on stream list'

    var next_step = {name: 'Show me next thing', type: 'ActionNextStep_18'}
    var close_dialog = {name: 'Bye', type: 'ActionFinishWorkflow_18'}
    var actions = [next_step, close_dialog]
    var description_list = [assistant_chat_bubble]
    var obj = {
        'DescriptionList': description_list,
        'ActionList': actions,
        '$type': 'ActionableResource_22',
        'Id': uuid.v4()
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.15+json')
    res.send(obj)
});
router.get('/actionableResource/:actionableResourceId', (req, res) => {
    console.log("request came", JSON.stringify(req.params));
    var assistant_chat_bubble = 'Hello and welcome on stream list'

    var next_step = {name: 'Show me next thing', type: 'ActionNextStep_18'}
    var close_dialog = {name: 'Bye', type: 'ActionFinishWorkflow_18'}
    var actions = [next_step, close_dialog]
    var description_list = [assistant_chat_bubble]
    var obj = {
        'DescriptionList': description_list,
        'ActionList': actions,
        '$type': 'ActionableResource_22',
        'Id': uuid.v4()
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.15+json')
    res.send(obj)
});
router.post('/action', (req, res) => {
    console.log("request came");
    res.send({ok: true})
});

module.exports = router;
