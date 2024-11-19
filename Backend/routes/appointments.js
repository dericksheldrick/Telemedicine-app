const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { patientAuth } = require("../middleware/authMiddleware");

// appointment routes
router.post("/book", patientAuth, appointmentController.bookAppointment); //booking
router.get("/", patientAuth, appointmentController.getAllAppointments); //All Appointment
router.put("/:id", patientAuth, appointmentController.updateAppointment); //updating schedule
router.delete("/:id", patientAuth, appointmentController.deleteAppointment);

module.exports = router;
