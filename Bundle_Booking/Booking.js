const bookingSchema = new mongoose.Schema({
    booking_id: { type: Number, required: true, unique: true },
    customer_id: { type: Number },
    flight_id: { type: Number },
    hotel_id: { type: Number },
    booking_date: { type: Number },
    package_id: { type: Number },
    booking_status: { type: String },
    total_amount: { type: Number },
    payment_status: { type: String },
    check_in_date: { type: Date },
    check_out_date: { type: Date },
    departure_date: { type: Date },
    package_start_date: { type: Date },
    package_end_date: { type: Date },
    special_requests: { type: String },
    created_at: { type: Date },
    updated_at: { type: Date },
    number_travelers: { type: Number },
  },{timestamps:true},
  {
      collation:"booking"
  }
  )
  const booking =mongoose.model("booking",bookingSchema);
  module.exports =booking;