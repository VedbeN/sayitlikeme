/* eslint-env node */
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/user');
//routes are defined here
const users = require('./routes/users');

const logger = require('./logger.js');
// twitter authentication with passport

const passport = require('passport');
const TwitterStrategy  = require('passport-twitter').Strategy;
const secrets = require('./config/secret.js');

const audioUploader = require('./audio-uploader.js');

//Create the Express app
const app = express();

const dbName = secrets.db.dbName;
const connectionString = secrets.db.mongoHost + dbName;


mongoose.connect(connectionString);
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',parameterLimit:50000, extended: true }));

passport.use(new TwitterStrategy({
    consumerKey: secrets.twitterAuth.consumerKey,
    consumerSecret: secrets.twitterAuth.consumerSecret,
    callbackURL: secrets.twitterAuth.callbackURL
},
    function(token, tokenSecret, profile, cb) {
        User.findOne({ twitterId: profile.username }, function (err, user) {
            if(err) {
                logger.log('error', 'Twitter strategy problem', {err: err});
            }
            if(user) {
                return cb(err, user);
            } else {
                let newUser = new User({ twitterId: profile.username });
                newUser.save(function(err){
                    if(err) {
                        return err;
                    } else {
                        return cb(err, newUser);
                    }
                });
            }
        });
    })
);


passport.serializeUser(function(user, done) {
    logger.log('info', 'user id serializsed as: ', {id: user.twitterId});
    done(null, user.twitterId);
});

passport.deserializeUser(function(obj, done) {
    logger.log('info', 'user deserializsed as: ', {user: obj});
    done(null, obj);
});
// parsing, and session handling.
app.use(require('body-parser').urlencoded({ extended: true }));

let sessionOptions = {
    secret: secrets.session.secret,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 20}
};
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sessionOptions.cookie.secure = true; // serve secure cookies
    sessionOptions.cookie.domain = '.sayitlike.me'; // serve secure cookies

}

app.use(session(sessionOptions));




// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//This is our route middleware
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login-' }),
    function(req, res) {
        // Successful authentication, redirect to registration form.
        res.redirect('/add-');
    });
app.get('/logout-', function(req, res){
    req.logout();
    res.redirect('/login-');
});
app.use('/api-/', users);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.post('/upload-/audio', audioUploader.handleUpload);
app.use('*',function(req,res) {
    res.sendFile('index.html', {root: path.resolve(__dirname,'../public-/')});
});

module.exports = app;
