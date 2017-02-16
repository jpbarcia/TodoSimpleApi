/**
 * Created by jeanpierre on 9/02/17.
 */

'use strict';

const server = require('./config/initializers/server');
const database = require('./config/initializers/database');
const nc = require('nconf');

// Load Environment variables from .env file
require('dotenv').config();

// Set up configs
nc.use('memory');
nc.argv();
nc.env();

// Load config file for the environment
require('./config/environments/' + nc.get('NODE_ENV'));

// Initialize Modules
console.log('[APP] Starting server initialization...');
database();
server();


