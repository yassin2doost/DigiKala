
const 
    router = require('express').Router();
    async = require('async'),
    User = require('../models/User'),
    passport = require('passport'),
    Cart = require('../models/Cart'),
    passportConfig = require('../config/passport');
 
// Signup get and post
    router.get('/signup', (req, res, next) => {
        if(req.user) return res.redirect('/');
        res.render('account/signup', {
            errors: req.flash('errors')
        });
    });

router.post('/signup', (req, res, next) => {

    async.waterfall([
        callback => {

        let user = new User();

        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.profile.name = req.body.name;
        user.profile.image = user.gravatar();

    // Mongoose Method 
    User.findOne({ email: req.body.email } , (err, existingUser) => {
        if(err) return next(err);
         if (existingUser) {
        req.flash('errors', 'ایمیل شما در پایگاه داده ما وجود دارد لطفا وارد شوید کنید');
           return res.redirect('/signup'); 
       } else {
        user.save( (err, user) => {
            if(err) return next(err);
            callback(console.log('User registered ....'), user);    
            });
        }
        });
    },

    user => {
            let cart = new Cart();
            cart.owner = user._id;

            cart.save( err  => {
                if(err) return next(err);
                req.logIn(user, err => {
                    if(err) {
                    console.log('cart section error' + err);
                    } else {
                        console.log('Cart has created...');
                        res.redirect('/profile');
                    } 
                    
                });
            });  
        }
    ]);
});

// End of Signup routes :)

// Login Page
router.get('/login', (req, res, next) => {
    if(req.user) return res.redirect('/');
    res.render('account/login', {
        message: req.flash('loginMessage')
    });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get('/logout', (req, res, next) => {
     req.logout();
     res.redirect('/login');
  });
// End of Login routes :)

// Start of Profile Page

router.get('/profile', (req, res, next) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
      if (err) return next(err);
      res.render('account/profile', { user });
    });
  });

  router.get('/edit-profile', (req, res, next) => {
      // Az Khodam
      if(!req.user) res.redirect('/login');
    res.render('account/edit-profile', {
    message: req.flash('success')
    });
  });

  router.post('/edit-profile', (req, res, next) => {
    user.findOne({ _id: req.user._id}, (err, user) => {
    if(err) return next(err);

    if(req.body.name) user.profile.name = req.body.name;
    if(req.body.address) user.profile.address = req.body.address;
    if(req.image) user.profile.image = req.body.image;

    if(req.body.email) user.req.email = req.body.email;
    if(req.body.password) user.req.password = req.body.password;
 
    user.save( err => {
        if(err) return next(err);
        req.flash('sucess', ' تغیرات با موفقیت ذخیره شد');
        res.redirect('/profile');
        
        });
    });
});



module.exports = router;


    

