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
        "ActionableResourceId": "LondonChallengeExample.`${req.query.contextType}`",
        "Mode": "Action",
        "$type": "ActionableResourceAvailability_20"
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json');
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
                "ActionType": "Negative",
                "Name": "Show me next thing",
                "Id": "turnmeon",
                "$type": "ActionNextStep_18",
                "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            },
            {
                "ActionType": "Positive",
                "Name": "Bye",
                "Id": "turnmeoff",
                "$type": "ActionFinishWorkflow_18",
                "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            }
        ]
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json')
    res.send(obj)
});
router.post('/action', (req, res) => {
    console.log("post request came", JSON.stringify(req.body));
    var obj = {
        "$type": "ActionableResource_21",
        "Id": "8a360d87-7ed7-4bea-8846-a807903d0e73",
        "DescriptionList": [
            "I have nothing for you mate"
        ],
        "ActionList": [
            // {
            //     "ActionType": "Positive",
            //     "Name": "Show me next thing",
            //     "Id": "turnmeon",
            //     "$type": "ActionNextStep_18",
            //     "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            // },
            // {
            //     "ActionType": "Negative",
            //     "Name": "Bye",
            //     "Id": "turnmeoff",
            //     "$type": "ActionFinishWorkflow_18",
            //     "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
            // }
        ]
    };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json');
    res.send(obj);
});

module.exports = router;
