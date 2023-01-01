const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique:true
    },
    birthdate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    ID: {
        type: String,
        required: true,
        unique:true
    },
    phonenumber: {
        type: String,
        required: true,
        unique:true
    },
    gender: {
        type: String,
        required: true,
    },
    JID: {
        type: String,
        required: true,
    },
    notes:{
        type:Array
    },
    appointments:{
        type:Array
    },
    patients:{
        type:Array
    },
    OrderedCard:{
        type:Boolean
    },
    code:{
        type:String
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;