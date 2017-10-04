var express = require('express');
var router = express.Router();
var assert = require('assert');
var sqlite = require('sqlite3');
var citydb = new sqlite.Database('./database/cities.db', (err)=> console.log(err));
var datadb = new sqlite.Database('./database/data.db', (err)=> console.log(err));
var usersdb = new sqlite.Database('./database/users.db', (err)=> console.log(err));

var Cart = require('../public/scripts/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    citydb.all('select * from cities', function(err, results) {
        res.render('index', {cities: results, successMsg: successMsg, noMessages: !successMsg});
    });

});

router.get('/cuisines', function(req, res, next) {
    res.render('cuisines', { });
});

router.post('/', function (req, res) {
    res.send('Got a POST request');
});

router.post('/cuisines', function (req, res) {


    if(req.body.city_choice == "Bristol") {
        datadb.all('SELECT * FROM cuisines WHERE city = ?', "Bristol", function(err, results) {
            if(results == null) {
                res.send("Null");
            }
            else {
                res.render('cuisines', {cuisines: results});
            }
        });
    }
    else if(req.body.city_choice == "Manchester") {
        datadb.all('SELECT * FROM cuisines WHERE city = ?', "Manchester", function(err, results) {
            if(results == null) {
                res.send("Null");
            }
            else {
                res.render('cuisines', {cuisines: results});
            }
        });
    }
    else if(req.body.city_choice == "London") {
        datadb.all('SELECT * FROM cuisines WHERE city = ?', "London", function(err, results) {
            if(results == null) {
                res.send("Null");
            }
            else {
                res.render('cuisines', {cuisines: results});
            }
        });
    }
});

router.get('/cuisines/deals', function(req, res, next) {
    res.render('deals', { });
});

router.post('/cuisines/deals', function (req, res) {
    datadb.all('select * from deals where city = ? and cuisine = ?', [req.body.city_choice,req.body.cuisine_type ] , function(err, results) {
        if(results == null) {
            res.send("Null");
        } else {
            res.render('deals', {deals: results});
        }
    });
});

router.get('/cuisines/deals/restaurant', function(req, res, next) {
    res.render('restaurant', {});
});

router.post('/cuisines/deals/restaurant', function (req, res) {
    datadb.get('select * from deals where restaurant = ?', [req.body.restaurant_choice], function(err, results) {

        if(results == null) {
            res.send("Null, not getting anything");
        } else {
            res.render('restaurant', {
                restaurant: results
            });
        }
    });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    console.log(productId);

    datadb.get('select * from deals where restaurant = ?  COLLATE NOCASE', productId, function(err, product) {
        if(product == null) {
            res.send("Null, not getting anything");
        } else {
            console.log(product);
            console.log(product.restaurant);


            cart.add(product, product.restaurant);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        }
    });
});


router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    datadb.get('select * from deals where restaurant = ?  COLLATE NOCASE', productId, function(err, product) {
        if(product == null) {
            res.send("Null, not getting anything");
        } else {
            cart.reduceByOne(product.restaurant);
            req.session.cart = cart;
            res.redirect('/shopping-cart');
        }
    });
});


router.get('/increase/:id', function(req, res, next) {
    var productId = req.params.id;
    console.log(productId);
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    datadb.get('select * from deals where restaurant = ?  COLLATE NOCASE', productId, function(err, product) {
        if(product == null) {
            res.send("Null, not getting anything");
        } else {
            cart.increaseByOne(product.restaurant);
            req.session.cart = cart;
            res.redirect('/shopping-cart');
        }
    });
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    datadb.get('select * from deals where restaurant = ?  COLLATE NOCASE', productId, function(err, product) {
        if(product == null) {
            res.send("Null, not getting anything");
        } else {
            cart.removeItem(product.restaurant);
            req.session.cart = cart;
            res.redirect('/shopping-cart');
        }
    });
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    console.log(errMsg);
     res.render('checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_L372D5lyzYuVS9V3tKBNE6k7"
    );

    stripe.charges.create({
        amount: Math.ceil(cart.totalPrice * 100),
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }

        usersdb.run('INSERT INTO orders (userID, email, totalPrice, orderNumber) values(?, ?, ?, ?)', [req.user.id, req.user.email, cart.totalPrice, charge.id], function(err, row) {
            if (err) {
               console.log("error");
            }
            console.log("ordeers updated");
        });


        usersdb.get("SELECT * FROM orders ORDER BY cartID DESC LIMIT 1", function(err, row) {
            if (err) {
               console.log("error");
            }

            (cart.generateArray()).forEach(function(order) {
                usersdb.run('INSERT INTO carts (id, foodItem, restaurantItem, price, userID, qty, totalPrice) values(?, ?, ?, ?, ?, ?, ?)', [row.cartID, order.item.food, order.item.restaurant, order.item.price, req.user.id, order.qty, cart.totalPrice], function(err, row) {
                    if (err) {
                       console.log("error could not put in");
                    }
                    console.log("cart updated");
                });
            });
        });



        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
    });
});

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
