var extractionController = require('./extractionController');
var calendar = require('./../calendar');
var utils = require('./../utils');
var app = require('../bin/www');
var moment = require('moment');
var _ = require('lodash');

// TODO: get it dynamically
var START_LOCATION = {
    name: 'Canary Wharf',
    latitude: 51.501,
    longitude: -0.037
};

var ACTION_KEYWORD = {
    TRAVELING: 'travel',
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

var cityNameCodePairs = [
    {name: 'london', code: 'lond'},
    {name: 'ljubljana', code: 'lju'}
];

var lastActionCode, lastActionContent;

// external python scripts are running asynchronously and we always wait until they finish,
// before we continue to process new data
var externalServiceRunning = false;

var clearLastAction = function () {
    lastActionCode = '';
    lastActionContent = '';
};

var getCityCodeForName = function (cityName) {
    return _.find(cityNameCodePairs, {name: cityName.toLowerCase()}).code;
};

module.exports = {
    processAction: function (action, cb) {
        // skip processing when external service is running
        if (externalServiceRunning) {
            return;
        }

        for (var key in ACTION_KEYWORD) {
            if (!ACTION_KEYWORD.hasOwnProperty(key) || action.toLowerCase().indexOf(ACTION_KEYWORD[key]) == -1) {
                continue;
            }

            switch (ACTION_KEYWORD[key]) {
                case ACTION_KEYWORD.HELLO:
                    //cb('Hi boss, what would you like me to do for you :)');
                   // cb('');
                    app.io.emit('action', {lastActionCode: ACTION_KEYWORD.HELLO, lastActionContent: 'Hello'});
                    break;
                case ACTION_KEYWORD.GREETING:
                    //cb('I am feeling great, I have you');
                   // cb('');
                    break;
                case ACTION_KEYWORD.MEETING:
                    externalServiceRunning = true;

                    extractionController.extractMeetingData(action, function (error, result) {
                        lastActionContent = {
                            datetime: moment(result[0][0]),
                            firstLocation: START_LOCATION,
                            secondLocation: {
                                name: result[1][0],
                                latitude: result[1][1],
                                longitude: result[1][2]
                            }
                        };

                        if (lastActionContent.datetime && lastActionContent.firstLocation.name && lastActionContent.secondLocation.name) {
                            lastActionCode = NEXT_ACTION.GOOGLE_CALENDAR;
                            cb('I noticed you are planning a meeting on ' + lastActionContent.datetime.format('YYYY-MM-DD hh:mm') + " in " + lastActionContent.secondLocation.name
                                + '. Would you like me to add a meeting to calendar and send invitations?');
                            app.io.emit('action', {lastActionCode, lastActionContent});
                        }

                        externalServiceRunning = false;
                    });
                    break;
                case ACTION_KEYWORD.TRAVELING:

                    // start extracting data, because it takes some time before its done
                    externalServiceRunning = true;
                    extractionController.extractTravelData(action, function (error, result) {
                        // result[0][0] is result from datetime parsing and result[1] is result from location parsing
                        var source, destination;

                        if (result[1].length > 1) {
                            source = result[1][0];
                            destination = result[1][1];
                        } else {
                            source = 'London'; // TODO: extract current location
                            destination = result[1][0];
                        }

                        lastActionContent = {
                            datetime: moment(result[0][0]),
                            firstLocation: source,
                            secondLocation: destination
                        };

                        if (lastActionContent.firstLocation && lastActionContent.secondLocation && lastActionContent.datetime) {
                            lastActionCode = NEXT_ACTION.SKY_SCANNER;
                            cb('I noticed you plan to travel from ' + source + ' to ' + destination + (lastActionContent.datetime ? ' on ' + lastActionContent.datetime.format('YYYY-MM-DD hh:mm') : '') + '. ' +
                                'Do you want me to check for available flights?');
                            app.io.emit('action', {lastActionCode, lastActionContent});
                        }

                        externalServiceRunning = false;
                    });

                    break;
                case ACTION_KEYWORD.YES:
                    switch (lastActionCode) {
                        case NEXT_ACTION.SKY_SCANNER:
                            lastActionCode = NEXT_ACTION.AIR_BNB;
                            var skyScannerUrl = `https://www.skyscanner.net/transport/flights/${getCityCodeForName(lastActionContent.firstLocation)}/${getCityCodeForName(lastActionContent.secondLocation)}?selectedoday=${lastActionContent.datetime.format('DD')}&oym=${lastActionContent.datetime.format('YYMM')}`;
                            cb('Here are the cheapest flights I found:\n' + skyScannerUrl + "\n\n" +
                                "Would you also like me to check for AirBnB?");
                            break;
                        case NEXT_ACTION.AIR_BNB:
                            var airBnbUrl = `https://www.airbnb.co.uk/s/${lastActionContent.secondLocation}?guests=1&checkin=${lastActionContent.datetime.format('DD-MM-YYYY')}&s_tag=1nkLc9tK`;
                            cb('Here are the cheapest AirBnB flats that I found in ' + lastActionContent.secondLocation + " for " + lastActionContent.datetime.format('YYYY-MM-DD') + ":\n\n" + airBnbUrl);
                            clearLastAction();
                            break;
                        case NEXT_ACTION.GOOGLE_CALENDAR:

                            calendar.insertEvent('kristjansesek@gmail.com', {
                                'summary': 'Meeting',
                                'description': 'This event was added by Scarlett.',
                                'start': {
                                    'dateTime': lastActionContent.datetime.format()
                                },
                                'end': {
                                    'dateTime': lastActionContent.datetime.add(1, 'hour').format()
                                },
                                'location': lastActionContent.secondLocation.name
                            }, (success) => {
                                if (success) {
                                    cb('A meeting on ' + lastActionContent.datetime.format('YYYY-MM-DD hh:mm') + ' at ' + lastActionContent.secondLocation.name + ' added to calendar.\n\n' +
                                        'Would you also like me to find transportation for your meeting at ' + lastActionContent.secondLocation.name + ' ' + lastActionContent.datetime.format('YYYY-MM-DD hh:mm') + '?');
                                    lastActionCode = NEXT_ACTION.CITY_MAPPER;
                                }
                            });
                            break;
                        case NEXT_ACTION.CITY_MAPPER:
                            var cityMapperUrl = `https://citymapper.com/directions?endaddress=${lastActionContent.secondLocation.name}&endcoord=${lastActionContent.secondLocation.latitude},${lastActionContent.secondLocation.longitude}&startaddress=${lastActionContent.firstLocation.name.replace(" ", "+")}&startcoord=${lastActionContent.firstLocation.latitude},${lastActionContent.firstLocation.longitude}`;
                            cb('Here is the best transportation that I found for ' + lastActionContent.secondLocation.name + " at " + lastActionContent.datetime.format('YYYY-MM-DD hh:mm') + ":\n\n" + cityMapperUrl);
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
