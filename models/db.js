const mongoose = require('mongoose');
// const Nurse = require('../models/nurse')


mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

module.exports = exports = mongoose