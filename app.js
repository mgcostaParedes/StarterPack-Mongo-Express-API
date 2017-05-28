const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/apiproject');

const app = express();

//Routes
const users = require('./routes/users');

//middleware
app.use(logger('dev'));
app.use(bodyParser.json());

//routes
app.use('/users', users);

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