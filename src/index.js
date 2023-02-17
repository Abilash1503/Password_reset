const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const bcrypt = require("bcryptjs");
const mongoose=require("mongoose")
const userDetails = require("./mongodb")
const port = process.env.PORT || 5000
app.use(express.json())
//mvar bcrypt = require('bcryptjs');
app.use(express.urlencoded({ extended: false }))
var crypto = require('crypto');
const tempelatePath = path.join(__dirname, '../template')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
app.set('view engine', 'ejs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET =  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/fp', (req, res) => {
    res.render('fp')
})


app.post('/signup', function(req,res){

    let signup = new userDetails({
        
        name : req.body.name,
        password : req.body.password,
        mail : req.body.mail,
        phone : req.body.phone
    })
    signup.save().then(function(savedData){
        console.log(savedData);
        alert("Successfully saved");
    }).catch(function(err){
        console.log(err)
    })
})
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 }
app.post('/login', function(req, res) {
   
    var mail = req.body.mail;
    var password = req.body.password;
    console.log(password);
    
    var data;
    if (mail != null && password!=null) {
        data = {
            mail: mail,
            //password:hashedPassword
        };
    }
    else {
        res.json({
            status: 0,
            message: "wrong"
        });
    }
    userDetails.findOne(data, function(err, user) {
        if (err) {
            res.json({
                status: 0,
                message: err
            });
        }
        if (!user) {
            res.json({
                status: 0,
                message: "not found"
            });
        }
      
        // var hash = bcrypt.hashSync(password, 10);
      
        // bcrypt.compare(password,hash).then(isMatch =>{
        //     if(isMatch){
        //        if(req.body.mail === "abilash907@gmail.com")
        //        {
        //         res.redirect('/admin')
        //        }
               else{
                 res.redirect('/home')
               }
            
            
            
        
        
    })
});
app.post("/link",async(req,res)=>{
    console.log("link");
        const { email } = req.body.mail;
        try {
          const oldUser = await userDetails.findOne({ email });
          if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
          }
          const secret = JWT_SECRET + oldUser.password;
          const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
          });
          const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "abilash907@gmail.com",
              pass: "icbgonchluvengiy",
            },
          });
      
          var mailOptions = {
            from: "abilash907@gmail.com",
            to: "reshma032002@gmail.com",
            subject: "Password Reset",
            text: link,
          };
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          console.log(link);
        } catch (error) {}
      });
      app.get("/reset-password/:id/:token", async (req, res) => {
        const { id, token } = req.params;
        console.log(req.params);
        const oldUser = await userDetails.findOne({ _id: id });
        if (!oldUser) {
          return res.json({ status: "User Not Exists!!" });
        }
        const secret = JWT_SECRET + oldUser.password;
        try {
          const verify = jwt.verify(token, secret);
          res.render("reset", { email: verify.email, status: "Not Verified" });
        } catch (error) {
          console.log(error);
          res.send("Not Verified");
        }
      });
      
      app.post("/reset-password/:id/:token", async (req, res) => {
        const { id, token } = req.params;
        const { password } = req.body;
      
        const oldUser = await userDetails.findOne({ _id: id });
        if (!oldUser) {
          return res.json({ status: "User Not Exists!!" });
        }
        const secret = JWT_SECRET + oldUser.password;
        try {
          const verify = jwt.verify(token, secret);
          const encryptedPassword = await bcrypt.hash(password, 10);
          await userDetails.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                password: encryptedPassword,
              },
            }
          );
      
          res.render("reset", { email: verify.email, status: "verified" });
        } catch (error) {
          console.log(error);
          res.json({ status: "Something Went Wrong" });
        }
      });
           
app.post('/updated', function(req, res) {
   
    var mail = req.body.mail;
    var pass = req.body.password;
    var cpass = req.body.cpassword;
 
    var data;
    if (mail != null) {
        data = {
            mail: mail,
           
        };
    }
    else {
        res.json({
            status: 0,
            message: err
        });
    }
    userDetails.findOneAndUpdate(data,{$set: {password: cpass}},{new: true}, function(err, user) {
        if (err) {
            res.json({
                status: 0,
                message: err
            });
        }
        if (!user) {
            res.json({
                status: 0,
                msg: "not found"
            });
        }
        // res.json({
        //     status: 1,
        //     id: user._id,
        //     message: " success"
            
        // });
        res.redirect("/");
     
        

    })
});
const movieschema =
mongoose.Schema({
    
    name : {
        type : String
    },
    oneline : {
        type : String
    },
    rating : {
        type : Number,
        
    }
    
})


const moviemodel = mongoose.model('movie',movieschema);

module.exports= {moviemodel};

const urlschema =
mongoose.Schema({
    clickcount : {
        type : Number,
        default : 0
    },
    longurl : {
        type : String
    },
    shorturl : {
        type : String
    }
    
})


const urlmodel = mongoose.model('urlShortener',urlschema);

module.exports= {urlmodel};

app.get('/home',function(req,res){
    let allurls = urlmodel.find().then((allurlsData) => {
        res.render('home', {
            allurlsData
        });
    }).catch(function(err){
        console.log(err);
    })
});
app.get('/admin',function(req,res){
    let allmovie = moviemodel.find().then(function (allmovieData) {
        res.render('admin', {
            allmovieData
        });
    }).catch(function(err){
        console.log(err);
    })
});
app.get('/:shortid',function(req,res){
   
    urlmodel.findOne({shorturl : req.params.shortid}).then(function(data){
        urlmodel.findByIdAndUpdate({_id: data.id},{$inc : {clickcount : 1}})
 
        .then(function(updateData){
            res.redirect(data.longurl);
            
        }).catch(function(err){
            console.log(err)
        })
        res.redirect(data.longurl);
    }).catch(function(err){
        console.log(err);
    })
})

app.get('/delete/:id',function(req,res){
  
        urlmodel.findByIdAndRemove({_id: req.params.id}).then(function(data){
            res.redirect('/home');
            
        }).catch(function(err){
            console.log(err)
        })
    })
app.post('/createurl',function(req,res){
    let Randomlink = Math.floor(Math.random()*10000)
    let newurlshort = new urlmodel({
        longurl : req.body.longurl,
        shorturl:Randomlink

    })
    newurlshort.save().then(function(savedData){
        console.log(savedData);
    }).catch(function(err){
        console.log(err)
    })
})
app.post('/admin',function(req,res){
    
    let newmovie = new moviemodel({
        name : req.body.name,
        oneline : req.body.oneline,
        rating : req.body.rating

    })
    newmovie.save().then(function(savedData1){
        console.log(savedData1);
    }).catch(function(err){
        console.log(err)
    })
})
// app.get('/deletemovie/:id',function(req,res){
    
//     moviemodel.findByIdAndRemove({_id: req.params.id}).then(function(data){
//         res.redirect('/admin');
        
//     }).catch(function(err){
//         console.log(err)
//     })
// })
//and if you have to create schema 

// var db_schema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         unique: true
//     },
// });
// // define this in your db.js
// var login_db = mongoose.model('your_db_name', db_schema);
// return function(req, res, next) {
//     req.app = login_db;
//     next();
// };

// app.post('/login', async (req, res) => {

//     try {
//         const check = await userDetails.findOne({ mail: req.body.mail })

//         if (check.password === req.body.password) {
//             res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
//         }

//         else {
//             res.send("incorrect password")
//         }


//     } 
    
//     catch (e) {

//         res.send("wrong details")
        

//     }


// })



app.listen(port, () => {
    console.log('port connected');
})