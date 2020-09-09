const express = require('express');
const app = express();
const configRoutes = require('./routes');

app.use(express.json());

let reqCount = 0;

app.use(function (req, res, next) {
    reqCount++;
    console.log('Number of Requests:' + reqCount);
    next();
});

app.use(
    function (req, res, next) {
        console.log('Request URL:', req.originalUrl);
        next();
    },
    function (req, res, next) {
        console.log('Request Type:', req.method);
        next();
    }
);

let json = {};

app.use(function (req, res, next) {
	if(!json[req.originalUrl]) json[req.originalUrl] = 0;
	json[req.originalUrl]++;
	console.log(req.originalUrl + " has been requested " + json[req.originalUrl] + " times.");
	next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
