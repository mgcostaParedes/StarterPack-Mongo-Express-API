const { schemas } = require('../../helpers/routeHelpers');
const joi = require('joi');
const User = require('../../models/user');

module.exports = {
	registerUser: async(req, res, next) => {
		try {
	      const result = joi.validate(req.body, schemas.userRegister);
	    
	      if(result.error) {
	      	console.log(result.error);
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
	      //HASH PASSWORD
	      const hash = await User.hashPassword(result.value.password);

	      //SAVE USER
	      delete result.value.confirmationPassword;
	      result.value.password = hash;

	      const newUser = await new User(result.value);
	      await newUser.save();

	      req.flash('success', 'You may now login!');
	      res.redirect('/users/login');

	    } catch(error) {
	      next(error);
	    }
	}

};