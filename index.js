const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

app.use(morgan('dev')); //console log  server request/response time

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could Not connect to database: ', err);
    } else {

        console.log('connect to database MongoDB');
    }
});

app.use(express.static(__dirname + '/client/dist/'));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
    console.log('Listening Port 8080');
});