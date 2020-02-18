const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const profileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    address: {
        street: { type: String },
        houseNumber: { type: String },
        zipcode: { type: String },
        city: { type: String },
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('Profile', profileSchema);