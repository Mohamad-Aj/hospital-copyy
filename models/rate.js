const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new mongoose.Schema({
    text: {
        type: String
    },
    Dr:{
        type:String
    },
    Pat:{
        type:String
    }
})

const rate = mongoose.model('rate', rateSchema);

module.exports = rate;

