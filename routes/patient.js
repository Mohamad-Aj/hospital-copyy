const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const Doctor = require('../models/doctor')
const Nurse = require('../models/nurse');
const { json } = require('body-parser');
const allappoint = require('../models/allappoint')
const sessions = require('../app').sessions;
const cookieParser = require('../app').cookieParser;
let session;

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
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Index', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }

})

router.get('/Index/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Index', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Appointments/:id', (req, res) => {
    if (session) {
        const DocRef = db.collection('alldoctors');
        const appRef = db.collection('allappoints');
        DocRef.find().toArray((err, arr) => {
            const id = req.params.id;
            User.findById(id)
                .then(result => {
                    appRef.find().toArray((err, a) => {
                        if (result) res.render('patient/Appointments', { apps: a, doctors: arr, result: result })
                    })

                })
        })
    } else {
        res.redirect('/HomePage')
    }

})

router.get('/Medicine/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Medicine', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Profile/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Profile', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})
router.get('/OrderCard/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/OrderCard', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Doctors/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Doctors', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Rate/:id', (req, res) => {

    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {

                const rateRef = db.collection('rates');
                rateRef.find().toArray(async (err, a) => {
                    const DocRef = db.collection('alldoctors');
                    DocRef.find().toArray((err, arr) => {
                        if (result) res.render('patient/Rate', { doctors: arr, Rates: a, result: result })
                    })

                })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Guide/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Guide', { result: result })
            })
    } else {
        res.redirect('/HomePage')
    }
})

router.get('/Lab/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Lab', { id:id, result: result })
            })
    } else {
        res.redirect('/HomePage')
    }
})




router.route('/login').post(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    try {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/login404').json({ mssg: "User does not exist" }) }
                bcrypt.compare(password, user.password, (err, result1) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                        res.redirect('/login404')
                    }

                    if (result1) {
                        db.collection('alldoctors').findOne({ email: email })
                            .then(ress => {
                                if (ress) {
                                    return res.redirect('/login404')
                                }
                                else {
                                    session = req.session
                                    session.userid = email
                                    return res.redirect(`/patient/${user.id}`)

                                }
                            })
                    }
                    else {
                        return res.redirect('/login404')
                    }

                })
            })
    }
    catch {
        return res.redirect('/login404')
    }
})

router.route('/Appointments/:id/:patname').post(async (req, res) => {
    const DocName = req.body.docs;
    const date = req.body.date.toString();
    const time = req.body.time.toString();
    var New_Appointment1 = {
        time: time,
        date: date,
        name: DocName
    }
    let patN;
    console.log(DocName)
    const id = req.params.id;
    let flag2 = 0
    User.findById(id)
        .then(async r => {
            console.log(r)
            var Patient = [r.fullname, ~~((Date.now() - r.birthdate) / (31557600000)), r.ID];
            let flag = 0;
            const appRef = db.collection('allappoints');
            await appRef.find().toArray(async (err, a) => {
                console.log(a)
                if (a.length >= 0) {
                    if (a.length > 0) {
                        await a.forEach(appos => {
                            console.log(appos)
                            console.log(appos.time, New_Appointment1.time)
                            console.log(appos.date, New_Appointment1.date)
                            if (appos.time === New_Appointment1.time && appos.date === New_Appointment1.date && appos.name === DocName) {
                                console.log('in if statement')
                                flag2 = 1
                            }
                        })
                    }
                    if (a.length >= 0) {
                        if (flag2 === 0) {
                            console.log('the flag2 didnt change')
                            db.collection('users').updateOne({ fullname: r.fullname }, {
                                $push: {
                                    appointments: New_Appointment1
                                }
                            })
                            db.collection('allappoints').insertOne(New_Appointment1)

                        }
                    }
                }

            })

            console.log('flag2=', flag2)
            const date1 = req.body.date.toString();
            const time1 = req.body.time.toString();
            var New_Appointment = {
                name: req.params.patname,
                time: time1,
                date: date1,
            }
            let flag1 = 0
            console.log(DocName)
            User.findOne({ fullname: DocName })
                .then((user) => {
                    if (user) {
                        // console.log(user)
                        Doctor.findOne({ IDS: user.ID })
                            .then(async (result) => {
                                if (result) {
                                    let fla = 0
                                    // console.log(New_Appointment)
                                    // console.log(user)
                                    // console.log(result)
                                    // console.log(user.fullname)
                                    // console.log(result)
                                    // console.log(result.patients)
                                    if (user.patients.length > 0) {
                                        user.patients.forEach(patient => {
                                            // console.log('im hereeee')
                                            // console.log(patient)
                                            if (patient[0] === Patient[0] && patient[1] === Patient[1] && patient[2] === Patient[2]) {
                                                fla = 1;
                                            }
                                        })
                                    }
                                    if (fla === 0) {
                                        db.collection('users').updateOne({ fullname: DocName }, {
                                            $push: {
                                                patients: Patient
                                            }
                                        })
                                    }

                                    user.appointments.forEach(appo => {
                                        if (appo.time === New_Appointment.time && appo.date === New_Appointment.date)
                                            flag1 = 1
                                    })
                                    if (flag1 === 0) {
                                        db.collection('users').updateOne({ fullname: user.fullname }, {
                                            $push: {
                                                appointments: New_Appointment
                                            }
                                        })
                                    }
                                }

                            });
                            db.collection('nurses').findOne({ PDS: user.ID })
                            .then(async (result3) => {
                                if (result3) {
                                    let fla = 0
                                    // console.log(New_Appointment)
                                    // console.log(user)
                                    // console.log(result)
                                    // console.log(user.fullname)
                                    // console.log(result)
                                    // console.log(result.patients)
                                    if (user.patients.length > 0) {
                                        user.patients.forEach(patient => {
                                            // console.log('im hereeee')
                                            // console.log(patient)
                                            if (patient[0] === Patient[0] && patient[1] === Patient[1] && patient[2] === Patient[2]) {
                                                fla = 1;
                                            }
                                        })
                                    }
                                    if (fla === 0) {
                                        db.collection('users').updateOne({ fullname: DocName }, {
                                            $push: {
                                                patients: Patient
                                            }
                                        })
                                    }

                                    user.appointments.forEach(appo => {
                                        if (appo.time === New_Appointment.time && appo.date === New_Appointment.date)
                                            flag1 = 1
                                    })
                                    if (flag1 === 0) {
                                        db.collection('users').updateOne({ fullname: user.fullname }, {
                                            $push: {
                                                appointments: New_Appointment
                                            }
                                        })
                                    }
                                }

                            });
                        res.redirect(req.get('referer'));
                    }
                });
        });

    // console.log(DocName)

})

router.route('/Profile/:id').put(async (req, res) => {
    console.log('im here here')
    const email = req.body.email.toLowerCase();
    console.log(email)

    const phonenumber = req.body.phonenumber;
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.password)
    console.log(phonenumber)
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) {
                if (email && phonenumber && req.body.password) {
                    db.collection('users').updateOne({ email: result.email }, {
                        $set: {
                            email: email,
                            phonenumber: phonenumber,
                            password: hashedPassword
                        }

                    })
                    res.redirect(req.get('referer'));
                }
                else {
                    if (email && phonenumber && req.body.password.length === 0) {
                        db.collection('users').updateOne({ email: result.email }, {
                            $set: {
                                email: email,
                                phonenumber: phonenumber
                            }

                        })
                        res.redirect(req.get('referer'));
                    }
                    else {
                        if (email && req.body.password && phonenumber.length === 0) {
                            db.collection('users').updateOne({ email: result.email }, {
                                $set: {
                                    email: email,
                                    password: hashedPassword
                                }

                            })
                            res.redirect(req.get('referer'));
                        }
                        else {
                            if (email.length === 0 && phonenumber && req.body.password) {
                                db.collection('users').updateOne({ email: result.email }, {
                                    $set: {
                                        phonenumber: phonenumber,
                                        password: hashedPassword
                                    }

                                })
                                res.redirect(req.get('referer'));
                            }
                            else {
                                if (email && phonenumber.length === 0 && req.body.password.length === 0) {
                                    console.log('change only email')
                                    db.collection('users').updateOne({ email: result.email }, {
                                        $set: {
                                            email: email
                                        }

                                    })
                                    res.redirect(req.get('referer'));
                                }
                                else {
                                    if (email.length === 0 && phonenumber && req.body.password.length === 0) {
                                        db.collection('users').updateOne({ email: result.email }, {
                                            $set: {
                                                phonenumber: phonenumber
                                            }

                                        })
                                        res.redirect(req.get('referer'));
                                    }
                                    else {
                                        if (email.length === 0 && phonenumber.length === 0 && req.body.password) {
                                            db.collection('users').updateOne({ email: result.email }, {
                                                $set: {
                                                    password: hashedPassword
                                                }

                                            })
                                            res.redirect(req.get('referer'));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

})


router.route('/Rate/:id').post(async (req, res) => {
    console.log('im in rate')
    const id = req.params.id;
    User.findById(id)
        .then(patient => {
            if (patient) {
                const name = patient.fullname;
                const Review = {
                    text: req.body.rating,
                    Dr: req.body.docss.toString(),
                    Pat: name
                }
                db.collection('rates').insertOne(Review)
                res.redirect(req.get('referer'))
            }
        })
})

var nodemailer = require('nodemailer');

router.route('/Medicine/:id/:med').post((req, res) => {
    const id = req.params.id;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mahospital7@gmail.com',
            pass: 'njlyzuukbkffwmcq'
        }
    });

    User.findById(id)
        .then(result => {
            if (result) {
                console.log(result)
                var mailOptions = {
                    from: 'mahospital7@gmail.com',
                    to: result.email,
                    subject: 'Medicine Order',
                    text: `Thanks For your Purcahse You will have ${req.params.med} in 3-5 days Payment on delivery!`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        })
    res.redirect(req.get('referer'));


})

router.route('/OrderCard/:id').post((req, res) => {
    const id = req.params.id;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mahospital7@gmail.com',
            pass: 'njlyzuukbkffwmcq'
        }
    });

    User.findById(id)
        .then(result => {
            if (result) {
                console.log(result)
                if (result.email != req.body.email) { res.redirect(`/patient/Index/${result.id}`) }
                else {
                    console.log(result)
                    var mailOptions = {
                        from: 'mahospital7@gmail.com',
                        to: result.email,
                        subject: 'Magnet Card Order',
                        text: `Thanks For your Order You will have the card in 5-7 days!
                    Note: the name you entered will be ${req.body.name}`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    db.collection('users').updateOne({ email: result.email }, {
                        $set: { OrderedCard: true }
                    })
                    res.redirect(req.get('referer'));
                }
            }
        })

})


router.route('/deleteLab/:id/:Result/:nurse').post(async (req, res) => {
    const id = req.params.id;
    const Res = req.params.Result;
    const Nurse = req.params.nurse
    User.findById(id)
    .then(result=>{
        if(result){
            db.collection('users').updateOne({fullname:result.fullname},{
                $pull:{"notes": {Nurse:Nurse,Result:Res}}
            })
            res.redirect(req.get('referer'))
        }
    })
})

router.route('/LogOut').post((req, res) => {
    console.log('loggin out in patient')
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
})
module.exports = router;


