var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal = require('google-calendar');
var moment = require('moment');
require('moment-range');
var config = {
    consumer_key: '677105350306-371f5lpnpndtgrc9p087597sarhcva1q.apps.googleusercontent.com',
    consumer_secret: 'T8BYSHVLbPOzERBWvsDJ2imm'
}
var token = 'ya29.Ci8xA4OlZ2iuWjRB22dL_LjfHYAiOtt3nlCkZyNH_oFC2KHQSGgErnAaVs67nC7LIA';
var google_calendar;
passport.use(new GoogleStrategy({
        clientID: config.consumer_key,
        clientSecret: config.consumer_secret,
        callbackURL: "http://localhost:3001/auth",
        scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
    },
    function (accessToken, refreshToken, profile, done) {

        //google_calendar = new gcal.GoogleCalendar(accessToken);
        google_calendar = new gcal.GoogleCalendar(accessToken);
        token = accessToken;
        // google_calendar.calendarList.list(function (err, calendarList) {
        //     console.log(JSON.stringify(calendarList));
        //     google_calendar.events.list(calendarList.items[0].id, function (err, calendarList) {
        //
        //         console.log(JSON.stringify(calendarList));
        //     });
        // });

        return done(null, profile);
    }
));
console.log(moment(new Date('2016')).format("YYYY-MM-DDTHH:mm:ssZ"));
google_calendar = new gcal.GoogleCalendar(token);
var event = {
    'summary': 'Google I/O 2015',
    'description': 'A chance to hear more about Google developer products.',
    'start': {
        'dateTime': new Date(),
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': new Date(),
        'timeZone': 'America/Los_Angeles'
    },
    'attendees': [
        {'email': 'dm2295@student.uni-lj.si'},
        {'email': 'denko.wow@hotmail.com'}
    ]
};
// insertEvent('denkomanceski@gmail.com', event);
function insertEvent(calendarId, event) {
    google_calendar.events.insert(calendarId, event, {
        sendNotifications: true
    }, (err, data) => {
        console.log(err, data);
    })
}
function listEvents(cb) {
    google_calendar.calendarList.list(function (err, calendarList) {
        console.log(JSON.stringify(calendarList));
        if(err) throw err;
        google_calendar.events.list(calendarList.items[0].id, {
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
            timeMin: (moment(new Date()).subtract(5, 'days')).format("YYYY-MM-DDTHH:mm:ssZ"),
            timeMax: moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")
        }, function (err, calendarItems) {
            if (calendarItems.items.length > 0)
                cb(calendarItems.items.reverse());
        });
    });

}
function currentlyRunning(events){
    var date = moment();
    var activeEvent = {}
    events.forEach(event => {
        var startDate = new moment(event.start.dateTime);
        var endDate = new moment(event.end.dateTime);
        var range = moment().range(startDate, endDate);
        if(range.contains(date))
            activeEvent  = event;
    });
    return activeEvent;
}
listEvents((events) => {
    console.log(JSON.stringify(currentlyRunning(events)));
});

console.log(":)");
exports.passport = passport;