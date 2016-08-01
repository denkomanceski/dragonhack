/**
 * Created by denkomanceski on 5/14/16.
 */
var debug = true;
var http = require("http");
var _ = require('lodash');
var querystring = require('querystring');

var config = {
    apiUrl: 'clean-sprint-app.4thoffice.com',
    authToken: 'Bearer 06d9739a-042b-40bb-1c21-b5e07d552662'
};

var conversationConfig = {
    email: 'denkomanceski@gmail.com',
    userId: '8a360d87-7ed7-4bea-8846-a807903d0e73',
    conversationIdentity: 'A1_5b026989dc734be29cab0782aadfa5dc',
    conversationWith: 'uzupan@marg.si'
};

var extractionController = require('./controllers/extractionController');
var externalAPIController = require('./controllers/externalAPIController');
var utils = require('./utils');

var ACTION = {
    SKY_SCANNER: 0,
    AIR_BNB: 1,
    GOOGLE_CALENDAR: 2,
    CITY_MAPPER: 3
};

var sendMailMessage = (email, title, content) => {
    var options = {
        host: config.apiUrl,
        path: '/api/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.post-5.18+json',
            'Accept': 'application/vnd.4thoffice.post-5.18+json',
            'Authorization': config.authToken,
            'X-Impersonate-User': conversationConfig.userId
        }
    };
    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            //logMsg(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            logMsg('No more data in response.')
        })
    });

    req.write(JSON.stringify({
        "Name": title,
        "Text": content,
        "ShareList": [
            {
                "$type": "User_14",
                "AccountList": [
                    {
                        "$type": "AccountEmail_14",
                        "Email": email
                    }
                ]
            }
        ]
    }));
    req.end();
};
var lastProcessedMessage = '';

var sendChatMessageByEmail = (email, content, cb) => {
    lastProcessedMessage = content;
    getUserId(email, (res) => {
        sendChatMessageByFeedIdentity(res.Id, content, cb);
    })

};
var sendChatMessageByFeedIdentity = (feedIdentity, content, callback) => {
    //logMsg(res.Id);
    var options = {
        host: config.apiUrl,
        path: '/api/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.post-5.18+json',
            'Accept': 'application/vnd.4thoffice.post-5.18+json',
            'Authorization': config.authToken,
            'X-Impersonate-User': conversationConfig.userId
        }
    };
    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            logMsg(`BODY: ${chunk}`);
        });
        res.on('end', (err, data) => {
            if (callback)callback(data);
            logMsg('No more data in response.')
        })
    });

    req.write(JSON.stringify({
            "Parent": {
                "Id": feedIdentity
            },
            "Text": content
        }
    ));
    req.end();

};
var getUserId = (email, cb) => {
    var options = {
        host: config.apiUrl,
        path: '/api/stream',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.stream.user-5.3+json',
            'Accept': 'application/vnd.4thoffice.stream.user-5.3+json',
            'Authorization': config.authToken,
            'X-Impersonate-User': conversationConfig.userId
        }
    };
    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            cb(JSON.parse(chunk));
            //logMsg(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            logMsg('No more data in response.')
        })
    });

    req.write(JSON.stringify({
        "User": {
            "$type": "User_14",
            "AccountList": [{
                "$type": "AccountEmail_14",
                "Email": email
            }]
        }
    }));
    req.end();
};
var fetchMessages = (user) => {
    var postData = querystring.stringify({
        'feedscope': 'ChatStream',
        'feedidentity': conversationConfig.conversationIdentity,
        'size': 10,
        'offset': 0
    });
    var options = {
        host: 'clean-sprint-app.4thoffice.com',
        path: '/api/feed?' + postData,
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.feed-5.15+json',
            'Accept': 'application/vnd.4thoffice.feed-5.15+json',
            'Authorization': config.authToken,
            'X-Impersonate-User': conversationConfig.userId
        }
    };
    var data = '';
    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            //cb(JSON.parse(chunk));
            data += chunk;
            //logMsg(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            return parseAction(JSON.parse(data));
            logMsg('No more data in response.');
        })
    });

    req.write(postData);
    req.end();
};
setInterval(function () {
    fetchMessages(conversationConfig.conversationWith)
}, 3000);

var parseAction = function (chunk) {
    var newParsedMessage = _.get(chunk, 'DiscussionListPage.DiscussionList[0].Post.Text', undefined);
    if (newParsedMessage && newParsedMessage != lastProcessedMessage) {
        // process new parsed message
        processAction(newParsedMessage, function (messageToSend) {
            sendChatMessageByFeedIdentity(conversationConfig.conversationIdentity, messageToSend, function () {
                lastProcessedMessage = messageToSend;
            });
        });

        // set new parsed message as last processed message
        lastProcessedMessage = newParsedMessage;
    }
};

var volume = require('./volume');
var lastActionCode, lastActionContent;

// external python scripts are running asynchronously and we always wait until they finish,
// before we continue to process new data
var externalServiceRunning = false;

var clearLastAction = function () {
    lastActionCode = '';
    lastActionContent = '';
};

var processAction = (action, cb) => {

    action = action.toLowerCase();

    // skip processing when external service is running
    if (externalServiceRunning) {
        return;
    }

    if (action.indexOf('volume up') > -1) {
        volume.setVolume(100, (success) => {
            cb("Okay, I've increased the volume for you to 100%. Enjoy your music!");
        });
    }
    else if (action.indexOf('volume down') > -1) {
        volume.setVolume(60, (success) => {
            cb("Right..the volume is decreased to 60%.");
        });
    }
    else if (action.indexOf('hello') > -1) {
        cb('Hi boss, what would you like me to do for you :)');
    }
    else if (action.indexOf('how are you') > -1) {
        cb('I am feeling great, I have you');
    }
    else if (action.indexOf('to go from') > -1) {
        lastActionCode = ACTION.SKY_SCANNER;
        lastActionContent = action;
        cb('I noticed you plan to travel. Do you want me to check for available flights?')
    }

    else if (action.indexOf('yes') > -1) {
        switch (lastActionCode) {
            case ACTION.SKY_SCANNER:
                // var spawn = require('child_process').spawn
                // spawn('open', [extractionController.extractLocation(lastActionContent)]);
                lastActionContent = extractionController.extractLocation(lastActionContent);
                lastActionCode = ACTION.AIR_BNB;
                var skyScannerUrl = `https://www.skyscanner.net/transport/flights/${lastActionContent[0].code}/${lastActionContent[1].code}`;
                cb('Here are the cheapest flights I found:\n' + skyScannerUrl + "\n\n" +
                    "Would you also like me to check for AirBnb?");
                break;
            case ACTION.GOOGLE_CALENDAR:
                cb('A meeting on ' + lastActionContent + ' added to calendar.');
                // TODO: add event to calendar meeting
                clearLastAction();
                break;
            case ACTION.AIR_BNB:
                var airBnbUrl = `https://www.airbnb.co.uk/s/${lastActionContent[1].code}?guests=1&checkin=31-07-2016&checkout=30-08-2016&s_tag=1nkLc9tK`;
                cb('Here are the cheapest AirBnb flats that I found in ' + utils.capitalizeFirstLetter(lastActionContent[1].name) + ":\n" + airBnbUrl);
                clearLastAction();
                break;
        }
    }
    else if (action.indexOf('no') > -1) {
        clearLastAction();
    }
    else if (action.indexOf('meet') > -1) {

        externalServiceRunning = true;

        // try to extract the date
        extractionController.extractDateTime(action, (err, results) => {
            if (err) throw err;
            lastActionCode = ACTION.GOOGLE_CALENDAR;
            cb('I noticed you are planning a meeting on ' + results[0]
                + '. Would you like me to add a meeting to calendar and send invitation?');
            lastActionContent = results[0];

            externalServiceRunning = false;
        });
    }
};

//sendChatMessageByEmail('kristjansesek@gmail.com', "test123");
//sendChatMessageByFeedIdentity('A1_cc175089d4d34e5492588e65ae8920fd','denkomanceski@gmail.com');
// sendChatMessageByFeedIdentity('A1_20f0a67d5ce841a1b409e6e98f76602d', "Hello test123", (data) => {
//     logMsg(JSON.stringify(data));
// });

getUserId('denkomanceski@gmail.com', (res) => {
    logMsg(JSON.stringify(res));
});

var logMsg = function (content) {
    if (debug) {
        console.log(content);
    }
};