const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db')
const Nurse = require('../models/nurse')


// const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((result) => console.log('connected to db'))
//     .catch((err) => console.log(err));


// var db = mongoose.connection
// mongoose.set('strictQuery', true);

// router.get('/' , (req,res)=>{
//     res.render('nurse/Index')
// })


router.route('/register').get((req, res) => {
    res.render('nurse/register')
})

router.get('/login', (req, res) => {
    res.render('nurse/login')
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('nurse/Index', { id: id })
})



router.route('/login').post( async (req, res) => {
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
                    Nurse.findOne({ PDS: user.ID })
                        .then((result) => {
                            if(result) { res.redirect(`/nurse/${user.id}`)
                        res.end()}
                        else{
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


router.route('/LogOut').post((req,res)=>{
    console.log('loggin out')
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
})


module.exports = router;