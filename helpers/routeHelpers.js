const Joi = require('joi');

module.exports = {
    validateParam: (schema, name) => {
        return(req, res, next) => {
            const result = Joi.validate({ param: req['params'][name]}, schema);
            if(result.error) {
                //handle error
                return res.status(400).json(result.error)
            } else {
                if(!req.value)
                    req.value = {};

                if(!req.value['params'])
                    req.value['params'] = {};

                req.value['params'][name] = result.value.param;

                next();
            }
        }
    },
    validateBody: (schema) => {
        return(req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if(result.error) {
                return res.status(400).json(result.error);
            } else {
                if(!req.value)
                    req.value = {};

                if(!req.value['body'])
                    req.value['body'] = {};

                req.value['body'] = result.value;
                next();
            }
        }
    },
    
    //MIDDLEWARE AUTHENTICATE
    isAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },
    isNotAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
          res.redirect('/');
        } else {
          return next();
        }
    },

    schemas: {
        userSchema: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required()
        }),
        userOptionalSchema: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email()
        }),
        userCarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),
        carSchema: Joi.object().keys({
            seller: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),
        putCarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),
        putCarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),
        patchCarSchema: Joi.object().keys({
            make: Joi.string(),
            model: Joi.string(),
            year: Joi.number()
        }),
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        userRegister: Joi.object().keys({
          email: Joi.string().email().required(),
          username: Joi.string().required(),
          password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).required(),
          confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
        })
    }
}