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
            openScarlet(success => {
                appendIframe(action.url);
            });
            break;
        case ACTION_KEYWORD.HELLO:
            embedIframe('random');
            break;
        case ACTION_KEYWORD.GREETING:

            break;
        case ACTION_KEYWORD.YES:

            break;
        case ACTION_KEYWORD.AIRBNB:
            appendIframe(action.url);
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
});
var myTab;

var findTab = (cb) => {
    if (myTab)
        cb(myTab);
    else
        Chrome.List((err, tabs) => {
            for (var i = 0; i < tabs.length; i++)
                if (tabs[i].url.indexOf('4thoffice.com') != -1) {
                    OfficeTab = tabs[i];
                    break;
                }
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
        //evalEmbed(tab);
    })
};
var blinkScarlet = function(){
  findTab(tab => {
      tab.Runtime.evaluate({
          expression: `$(".open-scarlett").addClass("active")`
      }, (err, resp) => {
          console.log("??");
      })
  })
};
var evalAppend = (tab, url) => {
    tab.Runtime.evaluate({
        expression: `$(".scarlet-content").append("<iframe src='${url}' style='height: 350px; margin-top: 20px; margin-bottom: 20px; width: 100%;'></iframe>")`
    }, (err, resp) => {
        console.log("??");
    })
};
function openScarlet(cb){
    findTab(tab => {
        tab.Runtime.evaluate({expression: "document.getElementsByClassName('open-scarlett')[0].click()"}, function (err, resp) {
            setTimeout(() => {cb(true)}, 1000)
        })
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
//embedIframe()
exports.setVolume = setVolume;

//blinkScarlet();
appendIframe('https://citymapper.com/directions?endaddress=68+Hanbury+Street%2C+London&endcoord=51.520194%2C-0.071025&endname=Second+Home&startaddress=Canary+Wharf%2C+London+E14%2C+UK&startcoord=51.505431%2C-0.023533&startname=Canary+Wharf%2C+London+E14%2C+UK')