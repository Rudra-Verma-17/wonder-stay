const express =require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/asyncwrap.js');
const asyncwrap = require('../utils/asyncwrap.js')
const listing=require('../models/schema.js')
const {listingSchena,reviewSchema}=require('../schema.js');
const Review = require('../models/review.js'); // import Review
const ExpressError=require('../utils/expresserror.js')
const multer  = require('multer')
const {storage}=require('../cloudconfig.js');
const upload = multer({ storage })

const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404,errMsg);
  }
  else{
    next();
  }
}

const {isLoggedin, isOwner, isAuthor}=require('../middleware.js');
const { Cursor } = require('mongoose');
const listingController=require('../controller/listing')

router.get('/listing', listingController.index);

// ✅ Place this BEFORE the dynamic route
router.get('/listings/new', isLoggedin,listingController.renderNewform);

// 🔽 Then your dynamic ID-based route
router.get('/listings/:id', listingController.renderParticularList);

// POST Route to handle new listing creation
router.post("/listings/new", isLoggedin,upload.single('listing[image]'),wrapAsync(listingController.postNew));



// router.post("/listings/new",upload.single('listing[image]'),
//   (req,res)=>{
//     console.log(req.file.filename,req.file.path)
    
//   }
// );

router.get('/listings/:id/edit',isLoggedin,isOwner,listingController.updateform)

router.patch('/listings/:id', isLoggedin,isOwner, upload.single('listing[image]'),listingController.patchupdateform);
router.post('/listings/:id/review', isLoggedin, validateReview, listingController.postreview);
router.delete('/listings/:id', isLoggedin,isOwner,listingController.deletelist);
router.delete('/listings/:id/review/:reviewid',isLoggedin,isAuthor,asyncwrap(listingController.deletereview))



module.exports=router;