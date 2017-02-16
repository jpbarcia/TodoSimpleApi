/**
 * Created by jeanpierre on 14/02/17.
 */

// Set up mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Export our mongoose model, with a user name and friends list
module.exports = mongoose.model('Todo', new Schema({
    user_id: String,
    todo: String,
    done: Boolean,
    date_created: Date,
    date_done: Date
}));