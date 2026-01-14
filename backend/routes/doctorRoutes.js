const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); // Path check kar lena

// 1. Get All Doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Add New Doctor (Updated to include 'availability')
router.post('/add', async (req, res) => {
  // Frontend se 'availability' bhi aa sakta hai ya 'status'
  const { name, specialty, mobile, status, availability } = req.body;
  
  // Jo bhi value aayi ho, use final status maan lenge
  const finalStatus = availability || status || "Available";

  try {
    const newDoctor = new Doctor({ 
      name, 
      specialty, 
      mobile, 
      status: finalStatus,        // Dono jagah same value save karenge
      availability: finalStatus 
    });
    
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Update Doctor Status (THE MAIN FIX 🛠️)
router.put('/:id/status', async (req, res) => {
  try {
    // Check karein ki Frontend ne 'availability' bheja hai ya 'status'
    // Hum dono ko accept karenge taaki error na aaye
    const newStatus = req.body.availability || req.body.status;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id, 
      { 
        status: newStatus,       // Status column update
        availability: newStatus  // Availability column update (Sync)
      }, 
      { new: true } // Return the updated document
    );

    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err); // Server console me error print karega
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete Doctor
router.delete('/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;