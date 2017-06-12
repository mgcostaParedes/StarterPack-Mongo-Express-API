const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/apiproject');

const app = express();
app.use(morgan('dev'));
app.use(helmet());

//VIEWS ENGINE
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
      
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

//FLASH MESSAGES
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});

//Routes
const cars = require('./routes/cars');
const users = require('./routes/users');
const usersApi = require('./routes/api/users');
const index = require('./routes/index');

//middleware
app.use(logger('dev'));
app.use(bodyParser.json());

//routes API
app.use('/api/users', usersApi);

//routes APP
app.use('/cars', cars);
app.use('/users', users);
app.use('/', index);

//catch 404 errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = error.status || 500;

    //respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });

    //respond to ourselves
    console.error(err);
});

//start server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))