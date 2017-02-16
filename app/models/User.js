/**
 * Created by jeanpierre on 12/02/17.
 */

// Set up mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Export our mongoose model, with a user name and friends list
module.exports = mongoose.model('User', new Schema({
    user: String,
    password: String,
    key: String
}));