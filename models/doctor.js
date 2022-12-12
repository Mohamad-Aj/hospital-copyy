const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new mongoose.Schema({
    IDS: {
        type: String
    }
})

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;