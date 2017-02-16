/**
 * Created by jeanpierre on 12/02/17.
 */

const express = require('express');
const nc = require('nconf');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let start =  function() {
    'use strict';
    // Configure express
    let app = express();
    app.use(morgan('common'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json({type: '*/*'}));

    console.log('[SERVER] Initializing routes');

    require('../../app/auth/auth')(app);

    require('../../app/routes/index')(app);

    // Error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: err.message,
            message: (app.get('env') === 'development' ? err : {})
        });
        next(err);
    });

    let nodePort = nc.get('NODE_PORT');
    app.listen(nodePort);
    console.log('[SERVER] Listening on port ' + nodePort);

};

module.exports = start;