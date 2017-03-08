/**
 * Created by jeanpierre on 14/02/17.
 */

const express = require('express');
const crypto = require('crypto');
const nc = require('nconf');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const Secret = nc.get('SECRET');

module.exports = function(app) {
    'use strict';
    let router = express.Router();

    router.route('/register/')
        .post(async function(req, res, next) {

            let user = req.body.user;
            let password = req.body.password;

            let userFound = await User.findOne({user: user});

            if(userFound) {
                res.json({ error: 'Username already registered.'});
                return null;
            }

            let hashedPassword = crypto.createHmac('sha256', Secret)
                .update(password)
                .digest('hex');

            let privateKey = crypto.createHmac('sha256', hashedPassword)
                .update(user)
                .digest('hex');

            let registeredUser = new User();
            registeredUser.user = user;
            registeredUser.password = hashedPassword;
            registeredUser.key = privateKey;

            await registeredUser.save();

            let newAccessToken = jwt.sign({
                id: registeredUser.id,
                user: registeredUser.user
            }, Secret, { expiresIn: 60 * 15 });
            return res.json({ message: {
                user: registeredUser.user,
                refreshToken: jwt.sign({
                    id: registeredUser.id,
                    user: registeredUser.user,
                    accessToken: newAccessToken
                }, registeredUser.key, { expiresIn: 60 * 60 * 12 }),
                accessToken: newAccessToken
            }});
        });

    router.route('/login/')
        .post(async function(req, res, next) {
            let user = req.body.user;
            let password = crypto.createHmac('sha256', Secret)
                .update(req.body.password)
                .digest('hex');
            let userFound = await User.findOne({user: user, password: password});

            if(!userFound) {
                return res.json({ error: 'Invalid User or Password.'});
            }

            let newAccessToken = jwt.sign({
                id: userFound.id,
                user: userFound.user
            }, Secret, { expiresIn: 60 * 15 });
            return res.json({ message: {
                user: userFound.user,
                refreshToken: jwt.sign({
                    id: userFound.id,
                    user: userFound.user,
                    accessToken: newAccessToken
                }, userFound.key, { expiresIn: 60 * 60 * 12 }),
                accessToken: newAccessToken
            }});

        });

    router.route('/token/')
        .post(async function(req, res, next) {
            let accessToken = req.body.accessToken;
            let refreshToken = req.body.refreshToken;

            let accessTokenExpired = false;
            try {
                jwt.verify(accessToken, Secret);
            } catch (e) {
                accessTokenExpired = e.name === "TokenExpiredError";
            }
            if(!accessTokenExpired) {
                return res.json({error: "Cannot get new tokens."});
            }

            let decodedAccessToken = jwt.decode(accessToken, Secret);
            let userFound = await User.findOne({_id: decodedAccessToken.id});
            if(!userFound) {
                return res.json({error: "Cannot get new tokens."});
            }

            let decodedRefreshToken;
            try {
                decodedRefreshToken = jwt.verify(refreshToken, userFound.key);
            } catch (e) {
                return res.json({error: "Cannot get new tokens."});
            }

            if(decodedAccessToken.id !== decodedRefreshToken.id
                || decodedRefreshToken.accessToken !== accessToken) {
                return res.json({error: "Cannot get new tokens."});
            }

            let newAccessToken = jwt.sign({
                    id: userFound.id,
                    user: userFound.user
                }, Secret, { expiresIn: 60 * 15 });
            return res.json({ message: {
                refreshToken: jwt.sign({
                    id: userFound.id,
                    user: userFound.user,
                    accessToken: newAccessToken
                }, userFound.key, { expiresIn: 60 * 60 * 12 }),
                accessToken: newAccessToken
            }});


        });

    app.use('/api/auth/', router);
};