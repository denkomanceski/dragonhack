var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var passport = require('../calendar').passport;
var startPolling = require('../contactApi').startPolling;
var getUsersByStreamID = require('../contactApi').getUsersByStreamID;
startPolling();
var currentOpenedUsers = [];
/* GET home page. */
router.get('/actionableResource/availability', (req, res) => {
    // var obj = {
    //     '$type': 'ActionableResourceAvailability_20',
    //     'Mode': 'Action',
    //     'ActionableResourceId': '1234567'
    // };

    console.log(JSON.stringify(req.query));
    if (req.query.contextId) {
        getUsersByStreamID(req.query.contextId, user => currentOpenedUsers = user);
        startPolling(req.query.contextId);
    }
    var actionableResourceId = req.query.contextId != 'null' ? `LondonChallengeExample.${req.query.contextType}.${req.query.contextId}` : `LondonChallengeExample.${req.query.contextType}`
    console.log(`Sending...is ${req.query.contextId != 'null'} -> ${actionableResourceId} ...`);
    var obj = {
        "ActionableResourceId": actionableResourceId,
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
    var usersString = 'This conversation is with '
    currentOpenedUsers.forEach(user => {
        usersString+=user.Name;
    });
    var obj = {
        "$type": "ActionableResource_21",
        "Id": "8a360d87-7ed7-4bea-8846-a807903d0e73",
        "DescriptionList": [
            `${usersString}`
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


router.get('/auth',
    passport.authenticate('google', {session: false}));

router.get('/auth/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}),
    function (req, res) {
        req.session.access_token = req.user.accessToken;
        res.redirect('/');
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
