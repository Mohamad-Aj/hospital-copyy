const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NurseSchema = new mongoose.Schema({
    PDS: {
        type: String
    }
})

const Nurse = mongoose.model('Nurse', NurseSchema);

module.exports = Nurse;