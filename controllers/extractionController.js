var PythonShell = require('python-shell');


var cityNamesDictinary = [
    {name: 'london', code: 'lond'},
    {name: 'ljubljana', code: 'lju'}
];


module.exports = {
    extractDateTime: function (content, callback) {
        PythonShell.run('../parsing/time_parser.py', {
            args: content
        }, callback);
    },
    extractLocation: function (content) {
        var city1 = '', city2 = '';
        cityNamesDictinary.forEach(city => {
            var indexNr = content.indexOf(city.name);
            if (indexNr > -1) {
                content = content.slice(0, indexNr) + content.slice(indexNr + city.name.length, content.length);
                if (!city1)
                    city1 = city;
                else if (!city2)
                    city2 = city;
            }
        });
        return [city1, city2];
    }
};