var extractionController = require('./extractionController');
var calendar = require('./../calendar');
var utils = require('./../utils');
var app = require('../bin/www');
var ACTION_KEYWORD = {
    TRAVELING: 'to go from',
    MEETING: 'meet',
    HELLO: 'hello',
    GREETING: 'how are you',
    YES: 'yes',
    NO: 'no'
};

var NEXT_ACTION = {
    SKY_SCANNER: 0,
    AIR_BNB: 1,
    GOOGLE_CALENDAR: 2,
    CITY_MAPPER: 3
};

var lastActionCode, lastActionContent;

// external python scripts are running asynchronously and we always wait until they finish,
// before we continue to process new data
var externalServiceRunning = false;

var clearLastAction = function () {
    lastActionCode = '';
    lastActionContent = '';
};

module.exports = {
    processAction: function (action, cb) {

        // skip processing when external service is running
        if (externalServiceRunning) {
            return;
        }

        action = action.toLowerCase();

        for (var key in ACTION_KEYWORD) {
            if (!ACTION_KEYWORD.hasOwnProperty(key) || action.indexOf(ACTION_KEYWORD[key]) == -1) {
                continue;
            }

            switch (ACTION_KEYWORD[key]) {
                case ACTION_KEYWORD.HELLO:
                    //cb('Hi boss, what would you like me to do for you :)');
                    cb('')
                    app.io.emit('action', {lastActionCode: -1, lastActionContent: 'Hello'});
                    break;
                case ACTION_KEYWORD.GREETING:
                    //cb('I am feeling great, I have you');
                    cb('')
                    break;
                case ACTION_KEYWORD.MEETING:
                    externalServiceRunning = true;

                    // try to extract the date
                    extractionController.extractDateTime(action, (err, results) => {
                        if (err) throw err;
                        lastActionCode = NEXT_ACTION.GOOGLE_CALENDAR;
                        // cb('I noticed you are planning a meeting on ' + results[0]
                        //     + '. Would you like me to add a meeting to calendar and send invitation?');
                        cb('')

                        // TODO: dynamic location extraction
                        lastActionContent = {datetime: results[0], location: "Baker Street"};
                        app.io.emit('action', {lastActionCode, lastActionContent});
                        externalServiceRunning = false;
                    });
                    break;
                case ACTION_KEYWORD.TRAVELING:
                    lastActionCode = NEXT_ACTION.SKY_SCANNER;
                    lastActionContent = action;
                    app.io.emit('action', {lastActionCode, lastActionContent});
                    //cb('I noticed you plan to travel. Do you want me to check for available flights?');
                    cb('')
                    break;
                case ACTION_KEYWORD.YES:
                    switch (lastActionCode) {
                        case NEXT_ACTION.SKY_SCANNER:
                            // var spawn = require('child_process').spawn
                            // spawn('open', [extractionController.extractLocation(lastActionContent)]);
                            lastActionContent = extractionController.extractLocation(lastActionContent);
                            lastActionCode = NEXT_ACTION.AIR_BNB;
                            var skyScannerUrl = `https://www.skyscanner.net/transport/flights/${lastActionContent[0].code}/${lastActionContent[1].code}`;
                            cb('Here are the cheapest flights I found:\n' + skyScannerUrl + "\n\n" +
                                "Would you also like me to check for AirBnb?");
                            break;
                        case NEXT_ACTION.GOOGLE_CALENDAR:
                            // TODO: parse correct dates and add location
                            calendar.insertEvent('kristjansesek@gmail.com', {
                                'summary': '4th Office Meeting',
                                'description': 'This event was added by Scarlett.',
                                'start': {
                                    'dateTime': new Date(),
                                },
                                'end': {
                                    'dateTime': new Date(),
                                },
                            }, (success) => {
                                if (success) {
                                    cb('A meeting on ' + lastActionContent.datetime + ' added to calendar.\n\n' +
                                        'Would you also like me to find transportation for your meeting on ' + lastActionContent.location + " at " + lastActionContent.datetime + "?");
                                    lastActionCode = NEXT_ACTION.CITY_MAPPER;
                                }
                            });
                            break;
                        case NEXT_ACTION.AIR_BNB:
                            var airBnbUrl = `https://www.airbnb.co.uk/s/${lastActionContent[1].code}?guests=1&checkin=31-07-2016&checkout=30-08-2016&s_tag=1nkLc9tK`;
                            cb('Here are the cheapest AirBnB flats that I found in ' + utils.capitalizeFirstLetter(lastActionContent[1].name) + ":\n" + airBnbUrl);
                            clearLastAction();
                            break;
                        case NEXT_ACTION.CITY_MAPPER:
                            var cityMapperUrl = "https://citymapper.com/directions?endaddress=Baker+St%2C+Marylebone%2C+London%2C+UK&endcoord=51.52061%2C-0.15685&endname=Baker+St%2C+Marylebone%2C+London%2C+UK&startaddress=68-80+Hanbury+St%2C+London+E1+5JL%2C+UK&startcoord=51.520138%2C-0.07031340000003183";
                            cb('Here is the best transportation that I found for ' + lastActionContent.location + ":\n\n" + cityMapperUrl);
                            clearLastAction();
                            break;
                    }
                    break;
                case ACTION_KEYWORD.NO:
                    clearLastAction();
                    break;
            }
        }
    }
};

exports.lastActionContent = lastActionContent;
exports.lastActionCode = lastActionCode;