var async = require('async');
var path = require('path');
var PythonShell = require('python-shell');

exports.extractMeetingData = function (content, callback) {
    PythonShell.run('parsing/location_checker.py', {
        args: content
    }, callback);

    setTimeout(() => {
        PythonShell.run('parsing/time_parser.py', {
            args: content
        }, (err, something) => {
            console.log(err);
            console.log("==== 2nd ====");
            console.log(something);
        });
    })
    // async.parallel([
    //     function (cb) {
    //         PythonShell.run('parsing/time_parser.py', {
    //             args: content
    //         }, cb);
    //     }, function (cb) {
    //
    //     }], callback);
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