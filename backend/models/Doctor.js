const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true }, 
  status: { type: String, default: 'Available' },
  availability: { type: String, default: "Available" }, 
  mobile: { type: String }
});

module.exports = mongoose.model('Doctor', doctorSchema);
