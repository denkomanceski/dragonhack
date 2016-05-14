/**
 * Created by denkomanceski on 5/14/16.
 */
var http = require("http");
var querystring = require('querystring');
var config =  {
    apiUrl: 'sprint-app.4thoffice.com',
    authToken: 'Bearer b14668b4-d02d-b34b-4838-77ad84fb4137'
};


var sendMailMessage = (email, title, content) => {
    var options = {
        host: config.apiUrl,
        path: '/api/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/vnd.4thoffice.post-5.15+json',
            'Accept': 'application/vnd.4thoffice.post-5.15+json',
            'Authorization': 'Bearer b14668b4-d02d-b34b-4838-77ad84fb4137'
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
var sendChatMessage = (email, content) => {
    getUserId(email, (res) => {
        console.log(res.Id);
        var options = {
            host: config.apiUrl,
            path: '/api/post',
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.4thoffice.post-5.15+json',
                'Accept': 'application/vnd.4thoffice.post-5.15+json',
                'Authorization': 'Bearer b14668b4-d02d-b34b-4838-77ad84fb4137'
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
//sendMailMessage('ivica.taseski94@gmail.com', 'Mofo', 'What the heck');
sendChatMessage('ivica.taseski94@gmail.com', "Sakas da go zemis bez race?");

