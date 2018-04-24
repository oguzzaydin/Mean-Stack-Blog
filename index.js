const express = require('express');
const app = express();
const router = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router); // Import Blog Routes
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(morgan('dev')); //console log  server request/response time



mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could Not connect to database: ', err);
    } else {
        console.log('connect to database MongoDB :' + config.db);
    }
});


// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/client/dist/')); // Provide static directory for frontend
app.use('/authentication', authentication); // Use Authentication routes in application
app.use('/blogs', blogs); // Use Blog routes in application

// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
    console.log('Listening on port 8080');
});