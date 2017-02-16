/**
 * Created by jeanpierre on 14/02/17.
 */

const express = require('express');
const crypto = require('crypto');
const nc = require('nconf');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const Secret = nc.get('SECRET');

module.exports = function(req, res, next) {
    "use strict";
    let token = null;
    let authorization = req.get('Authorization');
    if (authorization) {
        let authParts = authorization.split(' ');
        if (authParts.length === 2 && authParts[0] === "Bearer")
            token = authParts[1];
    }

    if(!token)
        return next({status: 401, message: "Not Authorized"});

    let decoded;
    try {
        decoded = jwt.verify(token, Secret);
    } catch (e) {
        e.status = 401;
        if(e.name === "TokenExpiredError")
            e.message = "Token Expired";
        return next(e);
    }

    req.body.user = {
        id: decoded.id,
        user: decoded.user,
    };
    next();
};
