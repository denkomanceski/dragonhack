var exec = require('child_process').exec;
var Chrome = require('chrome-remote-interface');
var request = require('request');
var socket = require('socket.io-client')('http://46.101.221.106:3001');
var ACTION_KEYWORD = {
    TRAVELING: 'to go from',
    MEETING: 'meet',
    HELLO: 'hello',
    GREETING: 'how are you',
    YES: 'yes',
    NO: 'no'
};
socket.on('connect', () => {
    console.log("Connected...");
});
socket.on('action', action => {
    console.log(JSON.stringify(action));
    switch (action.lastActionCode) {
        case ACTION_KEYWORD.TRAVELING:

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
        case ACTION_KEYWORD.NO:

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
var embedIframe = (url) => {
    Chrome.List((err, tabs) => {
        tabs.forEach(tab => {
            if (tab.url.indexOf('4thoffice') != -1) {
                OfficeTab = tab;
            }
        });
        Chrome(OfficeTab, (tab) => {
            tab.Runtime.evaluate({expression: "document.getElementsByClassName('open-scarlett')[0].click()"}, function (err, resp) {
                setTimeout(() => {
                    tab.Runtime.evaluate({
                        expression: `document.getElementsByClassName('scarlet-content')[0].innerHTML = "<iframe src='https://www.skyscanner.net' style='height: 100%;width: 100%;'></iframe>"`
                    }, (err, resp) => {
                    })
                }, 3000)
            });
        });
    });
}
var OfficeTab;

exports.setVolume = setVolume;
