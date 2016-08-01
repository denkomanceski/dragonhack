/**
 * Created by denkomanceski on 5/14/16.
 */
var http = require("http");
var _ = require('lodash');
var querystring = require('querystring');
var utils = require('./utils');
var actionController = require('./controllers/actionController');
var request = require('request');

var config = {
    apiUrl: 'clean-sprint-app.4thoffice.com',
    authToken: 'Bearer 4ddb73e7-0074-7494-fe19-75b219319bf8'
};

var conversationConfig = {
    email: 'denkomanceski@gmail.com',
    userId: '8a360d87-7ed7-4bea-8846-a807903d0e73',
    conversationIdentity: 'A1_20f0a67d5ce841a1b409e6e98f76602d',
    conversationWith: 'uzupan@marg.si'
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
            utils.logMsg(`BODY: ${chunk}`);
        });
        res.on('end', (err, data) => {
            utils.logMsg('No more data in response.')
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
            utils.logMsg(`BODY: ${chunk}`);
        });
        res.on('end', (err, data) => {
            if (callback)callback(data);
            utils.logMsg('No more data in response.')
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
            //utils.logMsg(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            utils.logMsg('No more data in response.')
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
var fetchMessages = () => {
    var postData = querystring.stringify({
        'feedscope': 'Card',
        'feedidentity': 'A1_b16f3b59e5864e9f943cc97b77c926bf',
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
            //utils.logMsg(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            //console.log("DATA:" + JSON.stringify(data));
            return parseAction(JSON.parse(data));
            utils.logMsg('No more data in response.');
        })
    });

    req.write(postData);
    req.end();
};

var interval;
function startPolling(conversationIdentity) {
    lastProcessedMessage = '';
    if (interval) {
        clearInterval(interval);
    }
    if (conversationIdentity) {
        conversationConfig.conversationIdentity = conversationIdentity;
    }
    interval = setInterval(function () {
        fetchMessages()
    }, 3000);
}

var lastProcessedMessage = '';
var parseAction = function (chunk) {
    // utils.logMsg("Parsing...", JSON.stringify(chunk));
    var len = _.get(chunk, 'DiscussionListPage.DiscussionList[0].PostListPage.Posts.length', undefined);
    var newParsedMessage = '';
    if (len)
        newParsedMessage = utils.replaceBreakWithNewline(_.get(chunk, `DiscussionListPage.DiscussionList[0].PostListPage.Posts[${len-1}].Text`));
    console.log(newParsedMessage, "parsed..");
    if (newParsedMessage && newParsedMessage != lastProcessedMessage) {

        // set new parsed message as last processed message
        lastProcessedMessage = newParsedMessage;

        // process new parsed message
        actionController.processAction(newParsedMessage, function (messageToSend) {
            lastProcessedMessage = messageToSend;
            sendChatMessageByFeedIdentity(conversationConfig.conversationIdentity, messageToSend);
        });
    }
};

//sendChatMessageByEmail('kristjansesek@gmail.com', "test123");
//sendChatMessageByFeedIdentity('A1_cc175089d4d34e5492588e65ae8920fd','denkomanceski@gmail.com');
// sendChatMessageByFeedIdentity('A1_20f0a67d5ce841a1b409e6e98f76602d', "Hello test123", (data) => {
//     utils.logMsg(JSON.stringify(data));
// });

// getUserId('denkomanceski@gmail.com', (res) => {
//     console.log(JSON.stringify(res), "RESSS...");
// });
sendMailMessage('kristjansesek@gmail.com', 'hello', 'hello');
function getUsersByStreamID(streamId, cb) {
    var options = {
        url: `http://${config.apiUrl}/api/stream/${streamId}`,
        headers: {
            'Authorization': config.authToken,
            'Accept': 'application/vnd.4thoffice.stream-5.3+json',
            'X-Impersonate-User': conversationConfig.userId
        }
    };
    request(options, (error, response, body) => {
        var data = JSON.parse(body);
        console.log(JSON.stringify(data));
        var members = [];
        if (data.Members)
            data.Members.forEach(member => {
                if (member.id != conversationConfig.userId)
                    members.push(member);
            });
        else {
            members.push(data);
        }
        cb(members);
    })
}

getUsersByStreamID('A1_20f0a67d5ce841a1b409e6e98f76602d', users => {
    var string = [];
    users.forEach(user => {
        string.push(user.Name);
    });
    string = string.join(', ');
    console.log(string);
});

exports.startPolling = startPolling;
exports.getUsersByStreamID = getUsersByStreamID;