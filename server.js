const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
var path = require('path');
const app = express();
var config =  require('./config.json')

let cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

require('./route/route.js')(app);

var server = http.createServer(app);
server.listen(config.server.port, config.server.fqdn);
