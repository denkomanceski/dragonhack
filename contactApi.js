/**
 * Created by denkomanceski on 5/14/16.
 */
var http = require("http");
var querystring = require('querystring');
var config =  {
    apiUrl: 'sprint-app.4thoffice.com',
    authToken: 'Bearer 5719ca4c-f87c-e014-1fa5-1bf09f169965'
};

var nesty = require('./nest');
var sendMailMessage = (email, title, content) => {
    var options = {
        host: config.apiUrl,
        path: '/api/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.post-5.15+json',
            'Accept': 'application/vnd.4thoffice.post-5.15+json',
            'Authorization': config.authToken
        }
    };
    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
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
var sendChatMessage = (email, content, cb) => {
    lastMessageByMe = content;
    getUserId(email, (res) => {
        console.log(res.Id);
        var options = {
            host: config.apiUrl,
            path: '/api/post',
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.4thoffice.post-5.15+json',
                'Accept': 'application/vnd.4thoffice.post-5.15+json',
                'Authorization': config.authToken
            }
        };
        var req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                if(cb)cb();
                console.log('No more data in response.')
            })
        });

        req.write(JSON.stringify({
                "Parent": {
                    "Id": res.Id
                },
                "Text": content
            }
        ));
        req.end();
    })
    
};
var getUserId = (email, cb) => {
    var options = {
        host: config.apiUrl,
        path: '/api/stream',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.stream.user-5.3+json',
            'Accept': 'application/vnd.4thoffice.stream.user-5.3+json',
            'Authorization': config.authToken
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

    req.write(JSON.stringify( {"User": {
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
        'feedscope':'ChatStream',
        'feedidentity':'A1_4c8f2c4a303d4474946e27b6e2bc2166',
        'size':10,
        'offset':0
    });
    var options = {
        host: 'sprint-app.4thoffice.com',
        path: '/api/feed?'+postData,
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.feed-5.15+json',
            'Accept': 'application/vnd.4thoffice.feed-5.15+json',
            'Authorization': config.authToken
        }
    };
    var data = '';
    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            //cb(JSON.parse(chunk));
            data+=chunk;
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            return parseCheckFor(JSON.parse(data));
            console.log('No more data in response.')
        })
    });

    req.write(postData);
    req.end();
};
setInterval(function() {fetchMessages('denkomanceski@gmail.com')}, 1000);
var skip = false;
var parseCheckFor = function(chunck){
    var t = 0;
    chunck.DiscussionListPage.DiscussionList.forEach(function(item) {
        t++;
        if(item.Post)
        if(item.Post.Text){
            if(t == 1 && item.Post.Text != lastMessageByMe && !skip){
                skip = true;
                checkAction(item.Post.Text, (content) => {
                    sendChatMessage('denkomanceski@gmail.com', content, () => {
                        skip = false;
                    });
                });
            }
            console.log(item.Post.Text)
        }

    });

}
var volume = require('./volume');
var checkAction = (action, cb) => {
    if(action.indexOf('coming home') > -1) {
        nesty.setTemperature(25);
        cb('Great! The current temperature here is 15 degree, but by the time you come home I will set it to 25');
    }
    else if(action.indexOf('volume up') > -1) {
        volume.setVolume(100, (success) => {
            cb("Okay, I've increased the volume for you to 100%. Enjoy your music!");
        });
    }
    else if(action.indexOf('volume down') > -1) {
        volume.setVolume(30, (success) => {
            cb("Right..the volume is decreased to 30%. ");
        });
    }
    else if(action.toLowerCase().indexOf('hello jarvis') > -1){
        cb('Hey, alright')
    }
}
//sendMailMessage('ivica.taseski94@gmail.com', 'Mofo', 'What the heck');
//sendChatMessage('denkomanceski@gmail.com', "Testing mountains");



