var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var passport = require('../calendar').passport;
var startPolling = require('../contactApi').startPolling;
var getUsersByStreamID = require('../contactApi').getUsersByStreamID;
var lastAction = require('../controllers/actionController');
var conversationConfig = require('../controllers/actionController').conversationConfig;
var actionController = require('../controllers/actionController');
startPolling();
var currentOpenedUsers = [];
var lastContextId = '';
//var crconsole = require('crconsole');
/* GET home page. */
router.get('/lastContext', (req, res) => {
    res.send({lastActionCode: lastAction.lastActionCode, lastActionContent: lastAction.lastActionContent});
});
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
        lastContextId = {contextId: req.query.contextId, type: req.query.contextType};
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
    var usersString = [];
    currentOpenedUsers.forEach(user => {
        usersString.push(user.Name);
    });
    usersString = usersString.join(', ');
    console.log(usersString, "USERS...");
    // var obj = {
    //     "$type": "ActionableResource_21",
    //     "Id": "8a360d87-7ed7-4bea-8846-a807903d0e73",
    //     "DescriptionList": [
    //         `This conversation is with: ${usersString} \n http://www.google.com`
    //     ],
    //     "ActionList": [
    //         {
    //             "ActionType": "Negative",
    //             "Name": "Show me next thing",
    //             "Id": "turnmeon",
    //             "$type": "ActionNextStep_18",
    //             "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
    //         },
    //         {
    //             "ActionType": "Positive",
    //             "Name": "Bye",
    //             "Id": "turnmeoff",
    //             "$type": "ActionFinishWorkflow_18",
    //             "AssistantEmail": "9e8b941a-ea27-4fa4-bc6b-03db0460b4e7@4thoffice.com"
    //         }
    //     ]
    // };
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json')
    res.send(actionController.meetingFlow('I found something. Do you want me to add to calendar') || req.body)
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
    var obj = {};
    switch(req.body.ActionList[0].Id.split('_')[1]) {
        case 'meeting':
            obj = actionController.meetingFlow('', req.body.ActionList[0].Id);
            break;
    }

    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json');
    res.send(obj);
});

module.exports = router;
