const express = require('express');
const app = express();
var path = require('path');
var cons = require('consolidate');
const bodyParser = require("body-parser")
const User = require('./models/user')
const bcrypt = require('bcrypt');
const Doctor = require('./models/doctor')
const allDoctor = require('./models/allDoctor');
const Nurse = require('./models/nurse')
const mongoose = require('mongoose');
const nurseRouter = require('./routes/nurse');
const indexRouter = require('./routes/index')
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const { json } = require('body-parser');
const sessions = require('express-session')
const flash = require('express-flash');
const passport = require('passport');
const cookie = require('cookie-parser');
require('./passport-config')(passport)
let alert = require('alert'); 
const cookieParser = require('cookie-parser');


var methodOverride = require("method-override");
app.use(methodOverride("_method"))

//
let session
app.use(cookieParser());

app.use(express.json())


const oneDay = 1000*60*60*24
app.use(sessions({
    secret: 'secret',
    cookie:{maxAge:oneDay},
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))

const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));
var db = mongoose.connection

db.on("error",console.error.bind(console,"connection error: "));
db.once("open",function(){
    console.log("connected successfully")
})

app.get('/',(req,res)=>{
    session = req.session
    res.render('HomePage')
    res.statusCode = 200;
})


app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login404', (req, res) => {
    res.render('login404')
})


app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.collection('users').insertOne({
        fullname: req.body.fullname,
        birthdate: req.body.birthdate,
        email: req.body.email,
        password: hashedPassword,
        ID: req.body.id1,
        phonenumber: req.body.phonenumber,
        gender: req.body.gender,
        JID: "/",
        notes:[],
        appointments:[],
        patients:[]
    })
    Doctor.findOne({IDS:req.body.id1})
    .then((result)=>{
        if(result){
        db.collection('alldoctors').insertOne({Name:req.body.fullname, email:req.body.email})
    }
    })
    Nurse.findOne({PDS:req.body.id1})
    .then((result1)=>{
        if(result1){
        db.collection('alldoctors').insertOne({Name:req.body.fullname,email:req.body.email})
    }
    })
    res.redirect('/HomePage');
});

app.post('/forgetpassword', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if(req.body.password != req.body.confirm){
        res.redirect('/forgetpassword')
    }
    db.collection('users').findOne({email: req.body.email})
    .then((user)=>{
        if(user){
            db.collection('users').updateOne({email:req.body.email},{
                $set:{
                    password:hashedPassword
                }
            })
        }
    })
    res.redirect('/HomePage')

});

app.get('/HomePage', (req, res) => {
    res.render('HomePage')
})

app.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword')
})

app.post('/HomePage',(req,res)=>{
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
})


app.use('/nurse', nurseRouter)
app.use('/', indexRouter)
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)


app.listen(3000)

module.exports = {app,session,sessions,cookieParser,db};