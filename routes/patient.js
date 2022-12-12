const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db')
const Doctor = require('../models/doctor')
const Nurse = require('../models/nurse')



router.get('/login', (req, res) => {
    res.render('patient/login')
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('patient/Index', { id: id })
})


router.route('/login').post(async (req, res) => {
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
                            if (result) {
                                res.render(`/error`)
                                res.end()
                            }

                        });
                    Nurse.findOne({ PDS: user.ID })
                        .then((result) => {
                            if (result) {
                                res.render(`/error`)
                                res.end()
                            }else{
                                res.redirect(`/patient/${user.id}`)
                                res.end();
                            }

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