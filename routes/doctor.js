const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db')
const Doctor = require('../models/doctor')


// const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((result) => console.log('connected to db'))
//     .catch((err) => console.log(err));


// var db = mongoose.connection
// mongoose.set('strictQuery', true);
// router.get('/' , (req,res)=>{
//     res.redirect('doctor/Index')
// })

router.route('/login').get((req, res) => {
    res.render('doctor/login')
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('doctor/Index', { id: id })
})

router.get('/Index/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('doctor/Index', { id: id })
        })
})

router.get('/Appointments/:id', (req, res) => {
    res.render('doctor/Appointments')
})

router.get('/Patients/:id', (req, res) => {
    res.render('doctor/Patients')
})

router.get('/Profile/:id', (req, res) => {
    res.render('doctor/Profile')
})

router.get('/Notes/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('doctor/Notes', { id: id })
        })
})

router.route('/login').post( async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/error').json({ mssg: "User does not exist" }) }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    Doctor.findOne({ IDS: user.ID })
                        .then((result) => {
                            if(result) { res.redirect(`/doctor/${user.id}`)
                        res.end()}
                               
                        });

                })
            })
    }
    catch {
        res.redirect('/error')
    }
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });
});



module.exports = router;