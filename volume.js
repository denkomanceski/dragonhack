var exec = require('child_process').exec;
var Chrome = require('chrome-remote-interface');
var request = require('request');
request('http://46.101.221.106:3001/lastContext', {}, (err, resp, body) => {
    JSON.stringify(body);
});
var setVolume = function(volume, cb){
    var cmd = "osascript -e 'set volume output volume "+volume+"'";
    exec(cmd, function() {
        cb(true)
    });
}

exec('ls', function(error, stdout, stderr) {
    // command output is in stdout
    console.log("Done..s");
})
var OfficeTab;
Chrome.List((err, tabs) => {
    tabs.forEach(tab => {
        if(tab.url.indexOf('4thoffice') != -1){
            OfficeTab = tab;
        }
    });
    Chrome(OfficeTab, (tab) => {
        // setInterval(() => {
            tab.Runtime.evaluate({expression: "document.getElementsByClassName('open-scarlett')[0].click()"}, function(err, resp) {
                setTimeout(() => {
                    tab.Runtime.evaluate({expression:
                        `document.getElementsByClassName('scarlet-content')[0].innerHTML = "<iframe src='https://www.skyscanner.net' style='height: 100%;width: 100%;'></iframe>"`
                    }, (err, resp) => {
                    })
                }, 3000)
            });
        // }, 10000);
    });
});
exports.setVolume = setVolume;
