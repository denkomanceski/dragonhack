/**
 * Created by denkomanceski on 5/15/16.
 */
var nest = require('unofficial-nest-api');
var setTemperature = function(temperature){
    nest.login('denkomanceski@gmail.com', 'asd!!', function (err, data) {
        if (err) {
            console.log(err.message);
            process.exit(1);
            return;
        }
        nest.fetchStatus(function (data) {
            console.log(JSON.stringify(data), "data")
            for (var deviceId in data.device) {
                if (data.device.hasOwnProperty(deviceId)) {
                    var device = data.shared[deviceId];
                    console.log(JSON.stringify(device))
                    console.log(deviceId, "lur")
                    // here's the device and ID
                    nest.setTemperature(deviceId, temperature);
                }
            }
        });
    });
}
exports.setTemperature = setTemperature;