var PythonShell = require('python-shell');

module.exports = {
    extractDateTime: function (content, callback) {
        PythonShell.run('/parsing/time_parser.py', {
            args: content
        }, callback);
    },
    extractLocation: function (content, callback) {
        return "NOT IMPLEMENTED";
    }
};