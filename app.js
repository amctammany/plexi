var express = require('express');
var path = require('path');

var app = express();
app.directory = __dirname;
var dir = (process.env.NODE_ENV === 'production' ? 'dist' : 'build');

app.use(express.static(path.resolve(__dirname, dir)));
app.use('/doc', express.static(path.resolve(__dirname, 'doc')));

module.exports = app;
