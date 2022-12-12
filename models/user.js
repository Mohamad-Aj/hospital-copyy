const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ID: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    JID: {
        type: String,
        required: true
    },
    notes:{
        type:Array
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;