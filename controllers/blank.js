/**
 * Created by denkomanceski on 8/3/16.
 */
var extractionController = require('./extractionController');
extractionController.extractMeetingData("Hey, wanna meet tomorrow at 10pm at Abbey Street? Kind regards, Kristjan Sešek", function (error, result) {
    console.log(JSON.stringify(error));
    console.log("========");
    console.log(JSON.stringify(result))
});