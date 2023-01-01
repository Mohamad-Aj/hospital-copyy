const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const Nurse = require('../models/nurse')
const sessions = require('../app').sessions;
const cookieParser = require('../app').cookieParser;
let session;


const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));


var db = mongoose.connection
mongoose.set('strictQuery', true);


router.get('/login', (req, res) => {
    res.render('nurse/login')
})

router.get('/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) {
                    await res.render('nurse/Index', { result: result, id: id })

                }
            })
    } else {
        res.redirect('/HomePage');
    }
})

router.get('/Index/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) {
                    await res.render('nurse/Index', { result: result, id: id })

                }
            })
    } else {
        res.redirect('/HomePage');
    }
})

router.get('/Profile/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) {
                    await res.render('nurse/Profile', { result: result, id: id })

                }
            })
    } else {
        await res.redirect('/HomePage');
    }
})

router.get('/Appointments/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) await res.render('nurse/Appointments', { patients: result.patients, result: result, appointments: result.appointments, id: id })
            })
    }
    else {
        await res.redirect('/HomePage');
    }
})

router.get('/Patients/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) await res.render('nurse/Patients', { patients: result.patients, result: result, appointments: result.appointments, id: id })
            })
    }
    else {
        await res.redirect('/HomePage');
    }
})

router.get('/Guide/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('nurse/Guide', { id:id,result: result })
            })
    } else {
        res.redirect('/HomePage')
    }
})

router.get('/Lab/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) await res.render('nurse/Lab', { patients: result.patients, result: result, appointments: result.appointments, id: id })
            })
    }
    else {
        await res.redirect('/HomePage');
    }
})



router.route('/login').post(async (req, res) => {
    const email = req.body.email.toLowerCase();
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
                    console.log('im in nurse login')
                    Nurse.findOne({ PDS: user.ID })
                        .then((result) => {
                            if (result) {
                                session = req.session
                                console.log(session)
                                session.userid = req.body.email.toLowerCase()
                                res.redirect(`/nurse/${user.id}`)
                                res.end()
                            }
                            else {
                                res.redirect('/login404');
                            }

                        });

                })
            })
    }
    catch {
        res.redirect('/login404')
    }
})

router.route('/Profile/:id').put(async (req, res) => {
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
                    return res.redirect(req.get('referer'));
                } else {
                    if (email && phonenumber && req.body.password.length === 0) {
                        db.collection('users').updateOne({ email: result.email }, {
                            $set: {
                                email: email,
                                phonenumber: phonenumber
                            }

                        })
                        return res.redirect(req.get('referer'));
                    }
                    else {
                        if (email && req.body.password && phonenumber.length === 0) {
                            db.collection('users').updateOne({ email: result.email }, {
                                $set: {
                                    email: email,
                                    password: hashedPassword
                                }

                            })
                            return res.redirect(req.get('referer'));
                        }
                        else {
                            if (email.length === 0 && phonenumber && req.body.password) {
                                db.collection('users').updateOne({ email: result.email }, {
                                    $set: {
                                        phonenumber: phonenumber,
                                        password: hashedPassword
                                    }

                                })
                                return res.redirect(req.get('referer'));
                            }
                            else {
                                if (email && phonenumber.length === 0 && req.body.password.length === 0) {
                                    console.log('change only email')
                                    db.collection('users').updateOne({ email: result.email }, {
                                        $set: {
                                            email: email
                                        }

                                    })
                                    return res.redirect(req.get('referer'));
                                }
                                else {
                                    if (email.length === 0 && phonenumber.length > 0 && req.body.password.length === 0) {
                                        db.collection('users').updateOne({ email: result.email }, {
                                            $set: {
                                                phonenumber: phonenumber
                                            }

                                        })
                                        return res.redirect(req.get('referer'));
                                    }
                                    else {
                                        if (email.length === 0 && phonenumber.length === 0 && req.body.password) {
                                            db.collection('users').updateOne({ email: result.email }, {
                                                $set: {
                                                    password: hashedPassword
                                                }

                                            })
                                            return res.redirect(req.get('referer'));
                                        }
                                        else {
                                            if (email.length === 0 && phonenumber.length === 0 && req.body.password.length === 0) {
                                                return res.redirect(req.get('referer'));
                                            }
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

router.route('/Appointments/:id/:time/:date/:patn').post(async (req, res) => {
    const time = req.params.time;
    const id = req.params.id;
    const date = req.params.date;
    const n = req.params.patn;
    console.log(id);
    User.findById(id)
        .then(async (result) => {
            if (result) {
                console.log(time)
                await db.collection('users').updateOne({ fullname: result.fullname }, { $pull: { "appointments": { name: n, date: date, time: time } } })
                db.collection('users').updateOne({ fullname: n }, { $pull: { "appointments": { name: result.fullname, date: date, time: time } } })
                db.collection('allappoints').deleteOne({ name: result.fullname, time: time, date: date })
                res.redirect(req.get('referer'));

            }
        })
})


router.route('/Lab/:id').post(async (req, res) => {
    const id = req.params.id;
    const pat = req.body.pats;
    const LabResult = req.body.Res;
    
    User.findById(id)
    .then(result=>{
        if(result){
            const lab = {
                Pat:pat,
                Result:LabResult,
                Nurse:result.fullname
            }
            db.collection('users').updateOne({fullname:result.fullname},{
                $push:{notes: lab}
            })
            const PatLab={
                Nurse:result.fullname,
                Result:LabResult
            }
            db.collection('users').updateOne({fullname:pat},{
                $push:{notes:PatLab}
            })
            res.redirect(req.get('referer'))
        }
    })
})

router.route('/deleteLab/:id/:Result/:pat').post(async (req, res) => {
    const id = req.params.id;
    const Res = req.params.Result;
    const Pat = req.params.pat
    User.findById(id)
    .then(result=>{
        if(result){
            db.collection('users').updateOne({fullname:result.fullname},{
                $pull:{"notes": {Pat:Pat,Result:Res}}
            })
            res.redirect(req.get('referer'))
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