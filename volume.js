var exec = require('child_process').exec;
var Chrome = require('chrome-remote-interface');
var request = require('request');
var socket = require('socket.io-client')('http://46.101.221.106:3001');
var ACTION_KEYWORD = {
    TRAVELING: 'travel',
    MEETING: 'meet',
    HELLO: 'hello',
    GREETING: 'how are you',
    YES: 'yes',
    NO: 'no',
    AIRBNB: "AIRBNB"
};
socket.on('connect', () => {
    console.log("Connected...");
});
socket.on('action', action => {
    console.log(JSON.stringify(action));
    switch (action.lastActionCode) {
        case ACTION_KEYWORD.TRAVELING:
            appendIframe('https://www.skyscanner.net');
            break;
        case ACTION_KEYWORD.MEETING:

            break;
        case ACTION_KEYWORD.HELLO:
            embedIframe('random');
            break;
        case ACTION_KEYWORD.GREETING:

            break;
        case ACTION_KEYWORD.YES:

            break;
        case AIRBNB:
            appendIframe('https://www.airbnb.co.uk');
            break;
    }
});
request('http://46.101.221.106:3001/lastContext', {}, (err, resp, body) => {
    JSON.stringify(body);
});
var setVolume = function (volume, cb) {
    var cmd = "osascript -e 'set volume output volume " + volume + "'";
    exec(cmd, function () {
        cb(true)
    });
}

exec('ls', function (error, stdout, stderr) {
    // command output is in stdout
    console.log("Done..s");
})
var myTab;

var findTab = (cb) => {
    if (myTab)
        cb(myTab)
    else
        Chrome.List((err, tabs) => {
            tabs.forEach(tab => {
                if (tab.url.indexOf('4thoffice') != -1) {
                    OfficeTab = tab;
                }
            });
            Chrome(OfficeTab, (tab) => {
                myTab = tab;
                cb(myTab);
            });
        });
}

var embedIframe = (url) => {
    findTab(tab => {
        evalEmbed(tab);
    })
};
var appendIframe = (url) => {
    findTab(tab => {
        evalAppend(tab, url);
    })
};
var evalAppend = (tab, url) => {
    tab.Runtime.evaluate({
        expression: `$( ".action-list" ).after( "<iframe src='${url}' style='height: 350px; margin-top: 20px; margin-bottom: 20px; width: 100%;'>" )`
    }, (err, resp) => {
        console.log("??");
    })
}
function evalEmbed(tab) {
    tab.Runtime.evaluate({expression: "document.getElementsByClassName('open-scarlett')[0].click()"}, function (err, resp) {
        setTimeout(() => {
            tab.Runtime.evaluate({
                expression: `document.getElementsByClassName('scarlet-content')[0].innerHTML = "<iframe src='https://www.skyscanner.net' style='height: 100%;width: 100%;'></iframe>"`
            }, (err, resp) => {
                console.log("??");
            })
        }, 2000)
    });
}
var OfficeTab;

exports.setVolume = setVolume;
