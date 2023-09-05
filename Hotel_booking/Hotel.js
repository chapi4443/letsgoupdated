const mongoose = require('mongoose')
 


const HotelSchema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
price:{
    type: String,
    required: true,
    default:0
},
description:{
    type: String,
    required: [true, 'please provide a description'],
    maxlength:[1000, 'description cannot be empty']
},
image:{     
    type: String,
    default:    '/uploads/example.jpeg',

},
category:{
    type: String,
    required:[true, 'please provide product category'],

},
averageRating:{
    type: Number,
    default: 0,
},
numofReviews:{
    type: Number,
    default: 0,
},
address: {
        type: String,
        required: true
      },
      
available_rooms: { 
    type: Number,
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
  


}, 
{timestamps: true,toJSON: {virtuals: true}, toObject: {virtuals: true}}
) 

HotelSchema.virtual ('reviews',{
    ref: 'Review',
    localField: '_id',
    foreignField:'product',
    justOne: false,
    

})
HotelSchema.pre("remove", async function (next) {                        // remove  all reviews from the database and remove them from the database table 
  await this.model("Review").deleteMany({ product: this._id });
});




module.exports = mongoose.model('Hotel',HotelSchema);







