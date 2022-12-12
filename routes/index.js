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
const session = require('express-session');


// router.use(session({
//     secret:'secret-key',
//     cookie:{maxAge:3000},
//     resave:false,
//     saveUninitialized:false
// }));

// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({
//     extended: true
// }))


// const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((result) => console.log('connected to db'))
//     .catch((err) => console.log(err));
// var db = mongoose.connection

// router.get('/register', (req, res) => {
//     res.render('register')
// })

// router.route('/register').post(async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.session.body.password, 10);
//         const F = req.session.body.id1
//         let flag = 1;
//         Doctor.findOne({ IDS: F })
//             .then((result1) => {
//                 if (result1) {
//                     const newUser = User({
//                         fullname: req.session.body.fullname,
//                         birthdate: req.session.body.birthdate,//json.toString(req.body.birthdate),
//                         email: req.session.body.email,
//                         password: hashedPassword,
//                         ID: req.session.body.id1,
//                         phonenumber: req.session.body.phonenumber,
//                         gender: req.session.body.gender,
//                         JID: "1"
//                     })
//                     flag = 2;
//                     newUser.save()
//                         .then((result) => {
//                             return res.redirect('/')
//                         })
//                         .catch((err) => {
//                             console.log(err)
//                         });
//                 }
//             });
//         if(flag == 1){
//         Nurse.findOne({ IDS: F })
//             .then((result2) => {
//                 if (result2) {
//                     const newUser = User({
//                         fullname: req.session.body.fullname,
//                         birthdate: req.session.body.birthdate,//json.toString(req.body.birthdate),
//                         email: req.session.body.email,
//                         password: hashedPassword,
//                         ID: req.session.body.id1,
//                         phonenumber: req.session.body.phonenumber,
//                         gender: req.session.body.gender,
//                         JID: "2"
//                     })
//                     newUser.save()
//                         .then((result) => {
//                            return res.redirect('/')
//                         })
//                         .catch((err) => {
//                             console.log(err)
//                         })
//                 }
//                 else {
//                     const newUser = User({
//                         fullname: req.session.body.fullname,
//                         birthdate: req.session.body.birthdate,//json.toString(req.body.birthdate),
//                         email: req.session.body.email,
//                         password: hashedPassword,
//                         ID: req.session.body.id1,
//                         phonenumber: req.session.body.phonenumber,
//                         gender: req.session.body.gender,
//                         JID: "3"
//                     })
//                     newUser.save()
//                         .then((result) => {
//                             return res.redirect('/')
//                         })
//                         .catch((err) => {
//                             console.log(err)
//                         })
//                 }
//             });
//         }
//     }
//     catch {
//         res.redirect('/register')
//     }
// });

// router.get('/login', (req, res) => {
//     res.render('login')
// })

// router.route('/login').post((req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     try {
//         User.findOne({ email :email })
//             .then((user) => {
//                 if (!user) { res.redirect('/error').json({ mssg: "User does not exist" }) }
//                 if(req.session.authenticated){
//                     res.json(req.session);
//                 }
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (err) {
//                         res.json({
//                             error: err
//                         })
//                     }
//                     req.session.authenticated = true;
//                     req.session.user = {
//                         email,password
//                     }
//                     if(user.JID == "1"){
//                         res.redirect('/doctor')
//                     }
//                     if(user.JID == "2"){
//                         res.redirect('/nurse')
//                     }
//                 })
//             })
//     }
//     catch {
//         res.redirect('/error')
//     }
// })


router.get('/', (req, res) => {
    res.render('HomePage')
})

router.get('/login', (req, res) => {
    res.render('HomePage')
})

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.collection('users').insertOne({
        fullname: req.body.fullname,
        birthdate: req.body.birthdate,//json.toString(req.body.birthdate),
        email: req.body.email,
        password: hashedPassword,
        ID: req.body.id1,
        phonenumber: req.body.phonenumber,
        gender: req.body.gender,
        JID: "/",
        notes:[]
    });
    // newUser.save()
    //     .then((result) => {
    //         res.redirect('/login')
    //         res.end();
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     });
});

router.use('/doctor', doctorRouter)
router.use('/nurse', nurseRouter)

module.exports = router;