require('./data/reddit-db')
require('dotenv').config();
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
mongoose.Promise = global.Promise;
mongoose.connect(
    "mongodb://localhost/reddit-db", {
        useMongoClient: true
    }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set('debug', true);
const express = require('express');
const app = express();
app.use(methodOverride('_method'))
app.use(express.static('public'));

const PostModel = require('./models/post')
const Post = require('./controllers/post');
const bodyParser = require('body-parser');
const JSON = require('circular-json')
const expressValidator = require('express-validator');
const Subreddit = require('./controllers/subreddit')
const Comment = require('./controllers/comment')
const Replies = require('./controllers/replies');
const Auth = require('./controllers/auth')

var exphbs = require('express-handlebars');

app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator()); // Add after body parser initialization!
var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        console.log('User is null')
        req.user = null;
    } else {
        var token = req.cookies.nToken;
        console.log('This is the token present on the request ' + token)
        var decodedToken = jwt.decode(token, {
            complete: true
        }) || {};
        console.log('This is the decoded JWT token user ' + JSON.stringify(decodedToken.payload))
        req.user = decodedToken.payload;
        res.locals.user = req.user // Every request has this middleware with it therefore every request has a scope to the local properties such as the user
    }

    next();
};

var isUserAuthorized = (req, res, next) => {
    console.log('This is the user ' + JSON.stringify(req.user))
    if (!req.user) {
        return res.redirect('/signup?e=' + encodeURIComponent('Must be logged in to do that'))
    } else {
        next()
    }
}

app.use(checkAuth);

app.get('/', (req, res) => {
    PostModel.find({}, function (err, posts) {
            console.log('These are the posts ' + err)
            res.render('./posts-index.handlebars', {
                posts
            })
        })
        .catch((err) => {
            console.log(err.message)
        })
});

Auth(app);
app.use(isUserAuthorized);
Post(app);
Subreddit(app);
Comment(app);
Replies(app);

// var requireAuthorization = (req, res, next) => {
//     console.log("Requiring Authorization")

//     if (req.user) {
//         Post(app);
//         Subreddit(app);
//         Comment(app);
//     }

//     else {
//         'User does not exist'
//     }
// }
// app.use(requireAuthorization)



// Main.handlebars all other templates inherit from
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

// Main Template => main.handlebars
app.set('view engine', 'handlebars');

app.listen(3000, () => {
    console.log('App listening on port 3000')
});


module.exports = app