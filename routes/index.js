var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var passport = require('../calendar').passport;
var startPolling = require('../contactApi').startPolling;
var getUsersByStreamID = require('../contactApi').getUsersByStreamID;
var actionController = require('../controllers/actionController');
startPolling();
var currentOpenedUsers = [];
var lastContextId = '';

//var crconsole = require('crconsole');
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
     var obj = actionController.getLastActionContent();

    switch(obj.lastActionCode) {
        case actionController.NEXT_ACTION.GOOGLE_CALENDAR:
            obj = actionController.meetingFlow(obj.text);
            break;
        case actionController.NEXT_ACTION.SKY_SCANNER:
            obj = actionController.travelFlow(obj.text);
            break;
        case 'reminder':
            obj = obj.realOBJ;
            break;
    }
    if(!obj.Id){
        obj = {
            "$type": "ActionableResource_21",
            "Id": "8a360d87-7ed7-4bea-8846-a807903d0e73",
            "DescriptionList": [
                // `This conversation is with: ${usersString} \n http://www.google.com`
                'I have nothing for you mate.'
            ],
            "ActionList": []
        };
    }
    console.log(JSON.stringify(obj), "=======");
    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json')
    res.send(obj);
    //res.send(actionController.travelFlow('I noticed you plan to travel......'))
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
            obj = actionController.meetingFlow('', req.body.ActionList[0].Id) || req.body;
            break;
        case 'travel':
            obj = actionController.travelFlow('', req.body.ActionList[0].Id) || req.body;
            break;
    }

    res.set('Content-Type', 'application/vnd.4thoffice.actionable.resource.availability-v5.17+json');
    res.send(obj);
});

module.exports = router;
