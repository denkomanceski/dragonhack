var async = require('async');

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