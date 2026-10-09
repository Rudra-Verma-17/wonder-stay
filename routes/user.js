const express =require('express')
const router=express.Router();
const User=require('../models/user.js');
const passport = require('passport');
const { saveURl } = require('../middleware.js');

router.get('/signup', (req, res) => {
  res.render('./users/signup.ejs',{title: "Create New"});
});


router.post('/signup', async(req, res,next) => {
  try{
    let {username,email,password}=req.body;
  let createuser=new User({username,email});
  await User.register(createuser,password);
  req.login(createuser,(e)=>{
  if(e){
    
   return next(e)
  }

  req.flash('success','Successfully register!')

res.redirect("/listing");

  })
  

  }
  catch(e){
    req.flash('error',e.message);
    res.redirect('/signup');
  }
});


router.get('/login',(req,res)=>{
    res.render('./users/login.ejs',{title:"Login"});
})



router.post(
  '/login',
  saveURl,
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  async (req, res) => {
    req.flash('success', 'Successfully Login!');
    res.redirect(res.locals.redirecturl || '/'); // default if undefined
  }
);


router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash('success','You are Logout');
        res.redirect('/listing');
    })
})









module.exports=router;