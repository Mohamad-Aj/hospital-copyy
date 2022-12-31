const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appAppointSchema = new mongoose.Schema({
    time: {
        type: String
    },
    date:{
        type:String
    },
    name:{
        type:String
    }
})

const allappoint = mongoose.model('allappoint',  appAppointSchema );

module.exports = allappoint;