var async = require('async');


var PythonShell = require('python-shell');

module.exports = {
    extractData: function (content, callback) {
        async.parallel([
            function (cb) {
                PythonShell.run('../parsing/time_parser.py', {
                    args: content
                }, cb);
            },
            function (cb) {
                PythonShell.run('../parsing/spacy_ner.py', {
                    args: content
                }, cb);
            }], callback);
    }
};