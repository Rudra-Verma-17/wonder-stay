if(process.env.NODE_ENV!='production'){
  require('dotenv').config();

}
const express=require('express')
const mongoose=require('mongoose')
const app=express()
async function main() {
    await mongoose.connect(process.env.mongo_url);
}
// 'mongodb://127.0.0.1/wonder'
// const signup=require('../routes/user.js')

const path=require('path')
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
const port =8080;
app.use(express.urlencoded({ extended: true }));
const ejs_mate=require('ejs-mate');
app.engine('ejs',ejs_mate);
app.use(express.static(path.join(__dirname,'/public')));
main().then((res)=>{
    console.log('connected');
}).catch((e)=>console.log(e));

const session=require('express-session')
const MongoStore = require('connect-mongo');


const store=MongoStore.create({
  mongoUrl:process.env.mongo_url,
  crypto:{
    secret:'mysecretcode'
  },
  touchAfter:24*3600,

})

store.on("error",(e)=>{
  console.log('error in mongo session',e)
})
const sessionOption={
  store,
  secret:'mysuperscretcode',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}
app.use(session(sessionOption))
const flash=require('connect-flash')
app.use(flash());

const User=require('./models/user.js')
const passport=require('passport'); //this for password
const localStrategy=require('passport-local');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




const methodOverride = require('method-override');
const { execPath } = require('process')

// Add this before your routes
app.use(methodOverride('_method'));
const address=require('./routes/listings.js');
const signup=require('./routes/user.js');

app.listen(port,()=>{
    console.log('server is ready at http://localhost:8080');
})

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next();


})
app.use('/demouser',async (req,res)=>{
  let fakeUser=new User({
    email:'student@gmail.com',
    username:'delta-student'
  });

 let registerUser=await User.register(fakeUser,'helloworld');
res.send(registerUser);
})


app.get('/', (req, res) => {
  res.render('listings/home', { title: "Home" });
});




app.use('/',address);
app.use('/',signup);


// app.all('*',(req,res,next)=>{
//   next(new ExpressError(404,'page not found'));
// })
app.use((er,req,res,next)=>{
  let {status=500,message='something happens wrong'}=er;
res.render("./listings/error.ejs",{title:'error page'})
  
  // res.status(status).send(message);
})

app.use((req,res,next)=>{
  // res.send('page not found');
  res.render("./listings/error.ejs",{title:'error page'})
})
