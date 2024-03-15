// create web server    
// require express
const express = require('express');
// create an express application
const app = express();
// require body-parser
const bodyParser = require('body-parser');
// require express-handlebars
const handlebars = require('express-handlebars');
// require path
const path = require('path');
// require mongoose
const mongoose = require('mongoose');
// require Comment model
const Comment = require('./models/comment');
// require Post model
const Post = require('./models/post');
// require method-override
const methodOverride = require('method-override');
// require express-session
const session = require('express-session');
// require connect-flash
const flash = require('connect-flash');
// require passport
const passport = require('passport');
// require passport-local
const LocalStrategy = require('passport-local').Strategy;
// require User model
const User = require('./models/user');

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comments', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

// use body-parser
app.use(bodyParser.urlencoded({extended: false}));
// use method-override
app.use(methodOverride('_method'));
// use express-session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
// use connect-flash
app.use(flash());
// use passport
app.use(passport.initialize());
app.use(passport.session());
// use express-handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if (user.password !== password) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport