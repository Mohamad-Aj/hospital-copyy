const express = require('express');
const app = express();
var path = require('path');
var cons = require('consolidate');
const bodyParser = require("body-parser")
const User = require('./models/user')
const bcrypt = require('bcrypt');
const Doctor = require('./models/doctor')
const Nurse = require('./models/nurse')
const mongoose = require('mongoose');
const nurseRouter = require('./routes/nurse');
const indexRouter = require('./routes/index')
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const { json } = require('body-parser');
// const passport = require('passport');
const session = require('express-session')
const flash = require('express-flash');
const passport = require('passport');
require('./passport-config')(passport)

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// mongoose.set('strictQuery', true);





// view engine setup
// app.engine('html', cons.swig)
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }))
var db = mongoose.connection
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

// const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((result) => console.log('connected to db'))
//     .catch((err) => console.log(err));
// var db = mongoose.connection


// app.get('/register', (req, res) => {
//     res.render('register')
// })
let flag = 1;
let SSID = 0

app.post('/register', async (req, res) => {
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


// app.post('/login', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     try {
//         User.findOne({ email: email })
//             .then((user) => {
//                 if (!user) { res.redirect('/error').json({ mssg: "User does not exist" }) }
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (err) {
//                         res.json({
//                             error: err
//                         })
//                     }
//                     db.collection('doctors').findOne({ IDS: user.ID })
//                         .then((result) => {
//                             if(result) { res.redirect(`/doctor/${user.id}`)
//                         res.end()}

//                         });

//                     Nurse.findOne({ PDS: user.ID })
//                         .then((result) => {
//                             if (result) {
//                                 res.redirect('/nurse'); res.end()

//                             }else{
//                                 res.redirect('/patient'); res.end();
//                             }
//                         })

//                 })
//             })
//     }
//     catch {
//         res.redirect('/error')
//     }
// })


// app.get('/doctor/:id', (req, res) => {
//     const id = req.params.id;
//     res.render('doctor/Index', { id })
// })

app.use('/nurse', nurseRouter)
app.use('/', indexRouter)
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)


app.listen(3000)