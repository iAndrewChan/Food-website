var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var sqlite = require('sqlite3');

var usersdb = new sqlite.Database('./database/users.db', (err)=> console.log(err));

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/profile', isLoggedIn, function (req, res, next) {
    usersdb.all('SELECT * FROM carts WHERE userID = ?', req.user.id, function(err, results) {
        console.log(results);
        if(results == null) {
            res.send("error couldn't retrieve");
        }
        else {
            var seperatedOrders = [];
            if(results.length != 0) {
                 seperatedOrders = seperate(results);
            }
            res.render('profile', {orders: seperatedOrders});
        }
    });
});



router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});


router.use('/', notLoggedIn, function(req, res, next) {
   next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function seperate(orders){
    var arr = [];
    var temp_arr = [];
    var prev_orderID = orders[0].id;
    var counter = 0;
    for (var i in orders) {
        if(i == orders.length - 1 ){
            arr.push(temp_arr);
        }
        if(orders[i].id == prev_orderID) {
            temp_arr.push(orders[i]);
        } else {
            arr.push(temp_arr);
            temp_arr = [];
            temp_arr.push(orders[i]);
        }
        prev_orderID = orders[i].id;
    }

    return arr;
}
