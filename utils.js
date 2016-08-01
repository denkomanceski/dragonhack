var debug = true;

module.exports = {
    capitalizeFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    replaceBreakWithNewline: function (string) {
        return string ? string.split("[br][/br]").join("\n") : undefined;
    },
    logMsg: function (content) {
        if (debug) {
            console.log(content);
        }
    }
};