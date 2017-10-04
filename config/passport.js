var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sqlite = require('sqlite3');


var db = new sqlite.Database('./database/users.db', (err)=> console.log(err));

var bcrypt = require('bcrypt-nodejs');


function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

function validPassword(password, dataPassword) {
  return bcrypt.compareSync(password, dataPassword);
};

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT * FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    db.get('SELECT * FROM users WHERE email = ?', email, function(err, row) {
      if (err) {
          return done(err);
      }
      if (row) {
        return done(null, false, {message: 'Email is already in use.'});
      }

      db.run('INSERT INTO users (email, password) values(?, ?)', [email, encryptPassword(password)], function(err, row) {
          if (err) {
             return done(err, false);
          }
          return done(null, row, {message: 'Account created!!.'});
      });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    db.get('SELECT * FROM users WHERE email = ?', email, function(err, row) {
      if (err) {
          return done(err);
      }
      if (!row) {
          return done(null, false, {message: 'No user found.'});
      }

      if (!validPassword(password, row.password)) {
          return done(null, false, {message: 'Wrong password.'});
      }
      return done(null,row);
    });
}));
