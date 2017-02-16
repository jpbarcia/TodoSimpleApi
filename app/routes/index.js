/**
 * Created by jeanpierre on 12/02/17.
 */


const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();

module.exports = function(app) {
    'use strict';

    // Initialize all routes
    Object.keys(routes).forEach((routeName) => {
        let router = express.Router();

        require('./' + routeName)(router);

        app.use('/api/' + changeCase.paramCase(routeName), router);
    });
};