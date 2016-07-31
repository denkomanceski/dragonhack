var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
    console.log("request came", JSON.stringify(req.params));
    // var obj = {
    //     '$type': 'ActionableResourceAvailability_20',
    //     'Mode': 'Action',
    //     'ActionableResourceId': '1234567'
    // };
    var obj = {
        "ActionableResourceId": "LondonChallengeExample.streamlistimportant.null",
        "Mode": "None",
        "$type": "ActionableResourceAvailability_20"
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json');
    res.send(obj)
});
router.get('/actionableResource', (req, res) => {
    // console.log("request came", JSON.stringify(req.params));
    // var assistant_chat_bubble = 'Hello and welcome on stream list'
    //
    // var next_step = {name: 'Show me next thing', type: 'ActionNextStep_18'}
    // var close_dialog = {name: 'Bye', type: 'ActionFinishWorkflow_18'}
    // var actions = [next_step, close_dialog]
    // var description_list = [assistant_chat_bubble]
    // var obj = {
    //     'DescriptionList': description_list,
    //     'ActionList': actions,
    //     '$type': 'ActionableResource_21',
    //     'Id': uuid.v4()
    // };
    var obj = {
        "$type": "ActionableResource_21",
        "Id": "8a360d87-7ed7-4bea-8846-a807903d0e73",
        "DescriptionList": [
            "Hello and welcome on stream list"
        ],
        "ActionList": [
            {
                "ActionType": "Positive",
                "Name": "Show me next thing",
                "Id": "271f759b-2d70-432e-b2da-6cf2b9bd02b0",
                "$type": "ActionNextStep_18",
                "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            },
            {
                "ActionType": "Positive",
                "Name": "Bye",
                "Id": "858a1f6c-dc42-4ebd-a095-986a1e076e25",
                "$type": "ActionFinishWorkflow_18",
                "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            }
        ]
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json')
    res.send(obj)
});
router.get('/actionableResource/:actionableResourceId', (req, res) => {
    console.log("request came", JSON.stringify(req.params));
    // var assistant_chat_bubble = 'Hello and welcome on stream list'
    //
    // var next_step = {name: 'Show me next thing', type: 'ActionNextStep_18'}
    // var close_dialog = {name: 'Bye', type: 'ActionFinishWorkflow_18'}
    // var actions = [next_step, close_dialog]
    // var description_list = [assistant_chat_bubble]
    // var obj = {
    //     'DescriptionList': description_list,
    //     'ActionList': actions,
    //     '$type': 'ActionableResource_21',
    //     'Id': uuid.v4()
    // };
    var obj = {
        "$type": "ActionableResource_21",
        "Id": "8a360d87-7ed7-4bea-8846-a807903d0e73",
        "DescriptionList": [
            "Hello and welcome on stream list"
        ],
        "ActionList": [
            {
                "ActionType": "Positive",
                "Name": "Show me next thing",
                "Id": "271f759b-2d70-432e-b2da-6cf2b9bd02b0",
                "$type": "ActionNextStep_18",
                "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            },
            {
                "ActionType": "Negative",
                "Name": "Bye",
                "Id": "858a1f6c-dc42-4ebd-a095-986a1e076e25",
                "$type": "ActionFinishWorkflow_18",
                "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            }
        ]
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json')
    res.send(obj)
});
router.post('/action', (req, res) => {
    console.log("request came", JSON.stringify(req.body));
    res.send({ok: true})
});

module.exports = router;
