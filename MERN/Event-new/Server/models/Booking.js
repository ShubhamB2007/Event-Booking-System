const mongoose = require("mongoose");
 
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  eventId: { type:String, required: true },
  name:{type:String}, 
  image:{type:String},
  tickets: { type: Number, required: true }, 
  bookingId:{type:String, unique:true},
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  totalPrice: { type: Number, required: true }, 
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;