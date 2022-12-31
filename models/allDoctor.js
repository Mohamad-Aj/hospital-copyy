const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allDoctorSchema = new mongoose.Schema({
    Name: {
        type: String
    },
    email:{
        type:String
    }
})

const allDoctor = mongoose.model('allDoctor', allDoctorSchema);

module.exports = allDoctor;