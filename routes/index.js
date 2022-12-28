const express = require('express')
const router = express.Router();
const User = require('../models/user')
const Doctor = require('../models/doctor')
const Nurse = require('../models/nurse')
const db = require('../models/db')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const doctorRouter = require('../routes/doctor');
const nurseRouter = require('../routes/nurse');
const sessions = require('../app').sessions;
const cookieParser = require('../app').cookieParser;
let session;
router.get('/', (req, res) => {
    res.render('HomePage')
})

router.get('/HomePage', (req, res) => {
    res.render('HomePage')
})

router.get('/login', (req, res) => {
    res.render('HomePage')
})

router.get('/Guide' , (req,res)=>{
    res.render('Guide')
})

router.get('/basicRegister', (req, res) => {
    res.render('basicRegister')
})


router.post('/HomePage', function (req, res) {
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
});

router.use('/doctor', doctorRouter)
router.use('/nurse', nurseRouter)

module.exports = router;