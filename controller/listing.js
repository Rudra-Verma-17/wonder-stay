
const express =require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/asyncwrap.js');
const asyncwrap = require('../utils/asyncwrap.js')
const listing=require('../models/schema.js')
const {listingSchema,reviewSchema}=require('../schema.js');
const Review = require('../models/review.js'); // import Review
const ExpressError=require('../utils/expresserror.js')
const mbxgeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const access_token=process.env.map_token;
const geocodingClient=access_token ? mbxgeocoding({accessToken:access_token}) : null;

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

module.exports.index=async (req, res) => {
  try {
    // wait for the query to complete
    const allData = await listing.find({});
    if(!allData){
 req.flash('error','Listing not available!');
 res.render('/listing');
    }
   
    res.render('./listings/index.ejs',{allData,title: "All listings" });
      
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).send('Server error');
  }
}


module.exports.renderNewform=(req, res) => {
    res.render('./listings/create.ejs',{title: "Create New"});
}

module.exports.renderParticularList=async (req, res) => {
  const { id } = req.params;
  const list = await listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
  if (!list) {
    return res.status(404).render('./listings/error.ejs', { title: 'Listing not found' });
  }

  let coordinates = null;
  if (geocodingClient && list.location && list.country) {
    const response = await geocodingClient.forwardGeocode({
      query: `${list.location},${list.country}`,
      limit: 1,
    }).send();
    coordinates = response.body.features[0]?.geometry?.coordinates || null;
  }

  res.render('./listings/show.ejs', { list, title: "View", coordinates });
}

module.exports.postNew=async (req, res,next) => {
    const { error } = listingSchema.validate({ listing: req.body });
    if (error) {
      throw new ExpressError(400, error.details.map((detail) => detail.message).join(', '));
    }

    if (!req.file) {
      throw new ExpressError(400, 'An image is required.');
    }

    let filename=req.file.filename;
    let url=req.file.path;
    const listingData = new listing(req.body);
    listingData.owner=req.user._id;
    listingData.image={filename,url}
    await listingData.save();
    req.flash('success','New Listing Created!')
    res.redirect("/listing"); 

}

module.exports.updateform=async (req,res)=>{
  let {id}=req.params;
  let list=await listing.findById(id);
 
  res.render('./listings/edit.ejs',{list,title: "Edit"});
}


module.exports.patchupdateform = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the existing listing
    let list = await listing.findByIdAndUpdate(id, req.body, { new: true });

    // Check if a file is uploaded
    if (req.file) {
      let filename = req.file.filename;
      let url = req.file.path;
      list.image = { filename, url };
      await list.save();
    }

    req.flash('success', 'Listing updated successfully!');
    return res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error('Error updating listing:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.status(500).send('Failed to update listing.');
  }
};


module.exports.postreview=async (req, res) => {
  const { id } = req.params;
  const list = await listing.findById(id); 
  
  if (!list) {
    return res.status(404).send('Listing not found');
  }

  // ✅ Attach author before creating
  const reviewData = { ...req.body.review, author: req.user._id };
  const newReview = await Review.create(reviewData); 

  list.reviews.push(newReview._id); 
  await list.save();

  req.flash('success', 'New Review Added!');
  res.redirect(`/listings/${id}`);
}

module.exports.deletelist=async (req, res) => {
  const { id } = req.params;

  try {
    let list=await listing.findById(id);
    if(!list) {
      return res.status(404).render('./listings/error.ejs', { title: 'Listing not found' });
    }
    if(!list.owner || !list.owner.equals(res.locals.currUser._id)){
      req.flash('error',"you don't have permission to delete");
      return res.redirect(`/listings/${id}`);
    }
    await listing.findByIdAndDelete(id);  
   req.flash('success','Listing Deleted!')
    
    res.redirect('/listing');            // ✅ Make sure this matches your route
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).send("Failed to delete listing");
  }
}


module.exports.deletereview=async (req,res)=>{
  let {id,reviewid}=req.params;
  // console.log(id,reviewid)
  await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
  await Review.findByIdAndDelete(reviewid);
  req.flash('success','Review Delete!')
  res.redirect(`/listings/${id}`);
}