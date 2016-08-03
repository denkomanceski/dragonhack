var async = require('async');
var path = require('path');
var PythonShell = require('python-shell');

exports.extractMeetingData = function (content, callback) {
    async.parallel([
        function (cb) {
            PythonShell.run('../parsing/time_parser.py', {
                args: content
            }, cb);
        }, function (cb) {
            PythonShell.run('../parsing/location_checker.py', {
                args: content
            }, cb);
        }], callback);
};

exports.extractTravelData = function (content, callback) {
    async.parallel([
        function (cb) {
            PythonShell.run('../parsing/time_parser.py', {
                args: content
            }, cb);
        }, function (cb) {
            PythonShell.run('../parsing/spacy_ner.py', {
                args: content
            }, cb);
        }], callback);
};

PythonShell.run(path.join(__dirname, '../parsing/location_checker.py'), {
    args: 'BLABLA Abbey Street :)'
}, (err, data) => {
    console.log(err, data);
});