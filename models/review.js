const mongoose =require('mongoose')

const ReviewScehma=new mongoose.Schema({
    comment:String,
    rating:{
        type:String,
        min:1,
        max:5
    },

    createdAt:{
            type:Date,
            default:Date.now()
    },
    author:{
         type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    }

})


module.exports =mongoose.model('review',ReviewScehma);