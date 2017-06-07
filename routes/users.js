const express = require('express');
//const router = express.Router();
const router = require('express-promise-router')();
const joi = require('joi');
const User = require('../models/user');

const UsersController = require('../controllers/users');

const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

//API ROUTES
router.route('/api')
    .get(UsersController.index)
    .post(validateBody(schemas.userSchema), UsersController.newUser);

router.route('/api/:userId')
    .get(validateParam(schemas.idSchema, 'userId'), UsersController.getUser)
    .put([validateParam(schemas.idSchema, 'userId'),
     validateBody(schemas.userSchema)], UsersController.replaceUser)
    .patch([validateParam(schemas.idSchema, 'idUser'), 
    validateBody(schemas.userOptionalSchema)],UsersController.updateUser);

router.route('/api/:userId/cars')
    .get(validateParam(schemas.idSchema, 'userId'), UsersController.getUsersCars)
    .post([validateParam(schemas.idSchema, 'userId'), validateBody(schemas.patchCarSchema)],UsersController.newUserCar);


//VIEWS ROUTES
router.route('/login').get((req, res) => {
	res.render('login');
})

router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try {
      const result = joi.validate(req.body, schemas.userRegister);
    
      if(result.error) {
        req.flash('error', 'Data is not valid. Please try again');
        res.redirect('/users/register');
        return
      }
      //CHECK IF EMAIL IS ALREADY TAKEN
      const user = await User.findOne({'email': result.value.email});
      if(user) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/register');
        return
      }
    } catch(error) {
      next(error);
    }
  });


module.exports = router;