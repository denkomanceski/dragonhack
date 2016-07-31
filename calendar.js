var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal     = require('google-calendar');
var config = {
    consumer_key: '677105350306-371f5lpnpndtgrc9p087597sarhcva1q.apps.googleusercontent.com',
    consumer_secret: 'T8BYSHVLbPOzERBWvsDJ2imm'
}

passport.use(new GoogleStrategy({
        clientID: config.consumer_key,
        clientSecret: config.consumer_secret,
        callbackURL: "http://localhost:3001/auth",
        scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
    },
    function(accessToken, refreshToken, profile, done) {

        //google_calendar = new gcal.GoogleCalendar(accessToken);
        var google_calendar = new gcal.GoogleCalendar(accessToken);

        google_calendar.calendarList.list(function(err, calendarList) {
            console.log(JSON.stringify(calendarList));
            google_calendar.events.list(calendarList.items[0].id, function(err, calendarList) {

               console.log(JSON.stringify(calendarList));
            });
        });

        return done(null, profile);
    }
));
console.log(":)");
exports.passport = passport;