var debug = false;

module.exports = {
    replaceBreakWithNewline: function (string) {
        return string ? string.split("[br][/br]").join("\n") : undefined;
    },
    logMsg: function (content) {
        if (debug) {
            console.log(content);
        }
    }
};