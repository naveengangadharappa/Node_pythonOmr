const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const routs = require('./Routs/routs.js');
const dotenv = require('dotenv');
dotenv.config();

var app = express();
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}));

const shouldCompress = (req, res) => { 
    if (req.headers['x-no-compression']) {
        // don't compress responses if this request header is present
        return false;
    }
    // fallback to standard compression  
    return compression.filter(req, res);
};

app.use(compression({
    filter: shouldCompress,
    threshold: 0
}));

app.use(helmet());

// app.use(cors({
//     origin: ['http://localhost:3000',],//your front url,
//     methods: ['GET', 'POST'],
//     credentials: true,
//     exposedHeaders: ['set-cookie']
// }))

// app.use((err, req, res, next) => {   //middle ware to handle Error 
//     handleError(err, res);
// });

app.use('/', routs);
let port = process.env.PORT || 3001;
app.listen(port, () => { console.log(`Express server started and listening on port ${port}`) });
