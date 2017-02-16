/**
 * Created by jeanpierre on 12/02/17.
 */

const mongoose = require('mongoose');
const nc = require('nconf');

// this variable will be used to hold the collection for use below


let start = function () {
    "use strict";

    console.log('[DATABASE] Initializing connection');

    let databaseConfig = nc.get('database');
    let mongoURI = `mongodb://${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.name}`;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURI, (err) => {
        if(err)
            console.log('[DATABASE] Could not connect database\n' + err);
        else
            console.log('[DATABASE] Connection success');
    });

};

module.exports = start;