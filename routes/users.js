const express = require('express');
//const router = express.Router();
const router = require('express-promise-router')();
const joi = require('joi');
const User = require('../models/user');
const passport = require('passport');


const Authenticate = require('../controllers/authenticate/authenticate');

const { isAuthenticated, isNotAuthenticated, schemas } = require('../helpers/routeHelpers');


//VIEWS ROUTES
router.route('/login')
.get(isNotAuthenticated, (req, res) => {
	res.render('login');
})
.post(passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.route('/dashboard')
  .get(isAuthenticated, (req, res) => {
    res.render('dashboard', {
      username: req.user.username
    });
  })

router.route('/register')
  .get(isNotAuthenticated, (req, res) => {
    res.render('register');
  })
  .post(Authenticate.registerUser);

router.route('/logout')
  .get(isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out.')
    res.redirect('/users/login');
  });

module.exports = router;