var exec = require('child_process').exec;

var setVolume = function(volume, cb){
    var cmd = "osascript -e 'set volume output volume "+volume+"'";
    exec(cmd, function() {
        cb(true)
    });
}
exports.setVolume = setVolume;
