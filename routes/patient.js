const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const Doctor = require('../models/doctor')
const Nurse = require('../models/nurse');
const { json } = require('body-parser');

const mongoose = require('mongoose');
// const Nurse = require('../models/nurse')

const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

const db = mongoose.connection

var methodOverride = require("method-override");
router.use(methodOverride("_method"))

// router.get('/',(req,res)=>{
//     res.render('patient/Index')
// })

router.get('/login', (req, res) => {
    res.render('patient/login')
})


router.route('/register').get((req, res) => {
    res.render('patient/register')
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('patient/Index', { result: result })
        })
})

router.get('/Index/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('patient/Index', { result: result })
        })
})

router.get('/Appointments/:id', (req, res) => {
    const DocRef = db.collection('alldoctors');
    DocRef.find().toArray((err, arr) => {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Appointments', { doctors: arr, result: result })
            })
    })

})

router.get('/Medicine/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('patient/Medicine', { result: result })
        })
})

router.get('/Profile/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('patient/Profile', { result: result })
        })
})

router.get('/Doctors/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('patient/Doctors', { result: result })
        })
})
router.get('/Guide/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('patient/Guide', { result: result })
        })
})




router.route('/login').post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/login404').json({ mssg: "User does not exist" }) }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    Doctor.findOne({ IDS: user.ID })
                        .then((result) => {
                            if (result) {
                                res.redirect(`/login404`)
                                res.end()
                            }

                        });
                    Nurse.findOne({ PDS: user.ID })
                        .then((result) => {
                            if (result) {
                                res.redirect(`/login404`)
                                res.end()
                            } else {
                                res.redirect(`/patient/${user.id}`)
                                res.end();
                            }

                        });

                })
            })
    }
    catch {
        res.redirect('/login404')
    }
})

router.route('/Appointments/:id').post((req, res) => {
    const DocName = req.body.docs;

    console.log(DocName)
    const id = req.params.id;
    console.log(id)
    User.findById(id)
        .then(r => {
            console.log(r)
            var Patient = [r.fullname, ~~((Date.now() - r.birthdate) / (31557600000)), r.ID];
            let flag = 0;
            db.collection('users').findOne({ fullname: DocName })
                .then(r1 => {
                    if (r1) {
                        console.log(r1)
                        console.log(r1.patients)
                        if (r1.patients.length > 0) {
                            r1.patients.forEach(patient => {
                                // console.log('im hereeee')
                                // console.log(patient)
                                if (patient[0] === Patient[0] && patient[1] === Patient[1] && patient[2] === Patient[2]) {
                                    flag = 1;
                                }
                            })
                        }
                        if (flag === 0) {
                            db.collection('users').updateOne({ fullname: DocName }, {
                                $push: {
                                    patients: Patient
                                }
                            })
                        }
                    }else{
                        console.log(r1)
                        console.log('in else')
                    }



                })
        });
    const date = req.body.date.toString();
    const time = req.body.time.toString();
    var New_Appointment = {
        time: time,
        date: date,
    }
    console.log(DocName)
    User.findOne({ fullname: DocName })
    .then((user) => {
        if (user) {
            console.log(user)
            Doctor.findOne({ IDS: user.ID })
                .then(async (result) => {
                    if (result) {
                        // console.log(New_Appointment)
                        console.log(user)
                        // console.log(result)
                        // console.log(user.fullname)
                        db.collection('users').updateOne({ fullname: user.fullname }, {
                            $push: {
                                appointments: New_Appointment
                            }
                        })
                        res.redirect(`/patient/Index/${req.params.id}`);
                    }

                });
        }});
    // console.log(DocName)

})

router.route('/Profile/:id').put(async (req, res) => {
    console.log('im here')
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) {
                db.collection('users').updateOne({ email: result.email }, {
                    $set: {
                        password: hashedPassword,
                        email: req.body.email,
                        phonenumber: req.body.phonenumber
                    }

                })
                res.redirect(req.get('referer'));
            }
        })

})


router.route('/LogOut').post((req, res) => {
    console.log('loggin out')
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
})
module.exports = router;