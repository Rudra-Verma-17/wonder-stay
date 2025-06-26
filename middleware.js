const listing=require('./models/schema')
const Review = require('./models/review'); 
module.exports.isLoggedin =(req,res,next)=>{
  // console.log(req.user);
  
    if(!req.isAuthenticated()) {
      req.session.redirecturl=req.originalUrl;
  req.flash('error', 'you must be logged in to used!');
  return res.redirect('/login'); // or wherever your login page is
}

  next();

}


module.exports.saveURl = (req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
  }
  next();
};


module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params; // ✅ Get ID from params
    const list = await listing.findById(id);

    // ✅ Check ownership
    if (!list || !list.owner.equals(res.locals.currUser._id)) {
      req.flash('error', 'You don’t have permission.');
      return res.redirect(`/listings/${id}`);
    }

    next(); // ✅ Continue if permission passes
  } catch (err) {
    console.error('Error in isOwner middleware:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/listings'); // Fallback if there's an error
  }
};





module.exports.isAuthor = async (req, res, next) => {
  try {
    const { id,reviewid } = req.params; // ✅ Get ID from params
    const review = await Review.findById(reviewid);

    // ✅ Check ownership
    if (!review || !review.author.equals(res.locals.currUser._id)) {
      req.flash('error', 'You are not the owner.');
      return res.redirect(`/listings/${id}`);
    }

    next(); // ✅ Continue if permission passes
  } catch (err) {
    console.error('Error in isOwner middleware:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/listings'); // Fallback if there's an error
  }
};