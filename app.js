var express = require('express');
var path = require('path');

var app = express();
app.directory = __dirname;

app.use(express.static(path.resolve(__dirname, 'build')));

module.exports = app;
