/**
 * Created by jeanpierre on 12/02/17.
 */

const nconf = require('nconf');

nconf.set('url', 'todo.com');

nconf.set('database', {
    name: 'todo',
    host: 'localhost',
    port: '27017'
});