

const mongoose = require("mongoose");

const Review =require('./review.js')

const listSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://i.pinimg.com/originals/cc/c1/c5/ccc1c5c5d52a2dbc1be00ccb81268e08.jpg",
      set: (v) => v === "" ? "https://i.pinimg.com/originals/cc/c1/c5/ccc1c5c5d52a2dbc1be00ccb81268e08.jpg" : v,
    }
  },
  price: Number,
  location: String,
  country: String,

  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"review"
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

listSchema.post('findOneAndDelete',async (e)=>{
if(e){
  await Review.deleteMany({_id :{$in : e.reviews}})
}})





const listing=mongoose.model('listing',listSchema);
module.exports=listing;