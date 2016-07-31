/**
 * Created by denkomanceski on 5/14/16.
 */
var http = require("http");
var querystring = require('querystring');
var config = {
    apiUrl: 'clean-sprint-app.4thoffice.com',
    authToken: 'Bearer a9ac4015-e8ba-8dcf-642a-e3fe58e1b57f'
};

var conversationConfig = {
    email: 'denkomanceski@gmail.com',
    userId: '8a360d87-7ed7-4bea-8846-a807903d0e73',
    conversationIdentity: 'A1_cc175089d4d34e5492588e65ae8920fd',
    conversationWith: 'kristjansesek@gmail.com'
};

var nesty = require('./nest');

var extractionController = require('./controllers/extractionController');
var externalAPIController = require('./controllers/externalAPIController');

var ACTION = {
    SKYSCANNER: 0,
    BOOKING: 1,
    GOOGLE_CALENDAR: 2,
    UBER: 3
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
            //console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.')
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
var lastMessageByMe = '';

var sendChatMessageByEmail = (email, content, cb) => {
    lastMessageByMe = content;
    getUserId(email, (res) => {
        sendChatMessageByFeedIdentity(res.Id, content, cb);
    })

};
var sendChatMessageByFeedIdentity = (feedIdentity, content, cb) => {
    //console.log(res.Id);
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
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', (err, data) => {
            if (cb)cb(data);
            console.log('No more data in response.')
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
            //console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.')
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
    console.log("Hey");
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
            //console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            return parseCheckFor(JSON.parse(data));
            console.log('No more data in response.')
        })
    });

    req.write(postData);
    req.end();
};
setInterval(function () {
    fetchMessages(conversationConfig.conversationWith)
}, 3000);
var skip = false;
var parseCheckFor = function (chunck) {
    var t = 0;
    chunck.DiscussionListPage.DiscussionList.forEach(function (item) {
        t++;
        if (item.Post)
            if (item.Post.Text) {
                if (t == 1 && item.Post.Text != lastMessageByMe && !skip) {
                    skip = true;
                    checkAction(item.Post.Text, (content) => {
                        if (content.length > 0)
                        // sendChatMessageByEmail('denkomanceski@gmail.com', content, () => {
                        //     skip = false;
                        // });
                            sendChatMessageByFeedIdentity(conversationConfig.conversationIdentity, content, () => {
                                skip = false;
                            });


                        else {
                            skip = false;
                        }
                    });
                }
                console.log(t + '. ' + item.Post.Text)
            }

    });

};

var volume = require('./volume');
var lastActionCode, lastActionText;

// external python scripts are running asynchronously, so we always wait until they finish, before we continue to
// process new data
var externalServiceRunning = false;

var checkAction = (action, cb) => {

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
            cb("Right..the volume is decreased to 60%. ");
        });
    }
    else if (action.toLowerCase().indexOf('hello') > -1) {
        cb('Hi boss, what would you like me to do for you :)')
    }
    else if (action.toLowerCase().indexOf('how are you') > -1) {
        cb('I am feeling great, I have you')
    }
    else if (action.toLowerCase().indexOf('to go from') > -1) {
        lastActionCode = ACTION.SKYSCANNER;
        lastActionText = action;
        cb('Do you want me to redirect you to skyscanner ?')
    }
    else if (action.toLowerCase().indexOf('yes') > -1) {
        switch (lastActionCode) {
            case ACTION.SKYSCANNER:
                var spawn = require('child_process').spawn;
                spawn('open', [checkCities(lastActionText)]);
                cb('');
                break;
            case ACTION.GOOGLE_CALENDAR:
                cb('A meeting on ' + lastActionText + ' added to calendar.');
                break;
        }

        // clear last action
        lastActionCode = '';
        lastActionText = '';
    }
    else if (action.toLowerCase().indexOf('meet') > -1) {

        externalServiceRunning = true;

        // try to extract the date
        extractionController.extractDateTime(action, (err, results) => {
            if (err) throw err;
            lastActionCode = ACTION.SKYSCANNER;

            var lastMessage = 'I noticed you are planning a meeting on ' + results[0]
                + '. Would you like me to add a meeting to calendar and send invitation?';
            lastMessageByMe = lastMessage;

            cb(lastMessage);
            lastActionText = results[0];

            externalServiceRunning = false;
        });
    }
};

function checkCities(action) {
    var city1 = '', city2 = '';
    cityNamesDictinary.forEach(city => {
        var indexNr = action.indexOf(city.name);
        if (indexNr > -1) {
            action = action.slice(0, indexNr) + action.slice(indexNr + city.name.length, action.length);
            if (!city1)
                city1 = city.code;
            else if (!city2)
                city2 = city.code;
        }
    });
    return `https://www.skyscanner.net/transport/flights/${city1}/${city2}`
}
var cityNamesDictinary = [
    {name: 'london', code: 'lond'},
    {name: 'ljubljana', code: 'lju'}
];
sendChatMessageByEmail('kristjansesek@gmail.com', "test123");
//sendChatMessageByFeedIdentity('A1_cc175089d4d34e5492588e65ae8920fd','denkomanceski@gmail.com');
// sendChatMessageByFeedIdentity('A1_20f0a67d5ce841a1b409e6e98f76602d', "Hello test123", (data) => {
//     console.log(JSON.stringify(data));
// });

getUserId('denkomanceski@gmail.com', (res) => {
    console.log(JSON.stringify(res));
});

