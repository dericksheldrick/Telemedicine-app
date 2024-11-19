const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { patientAuth } = require("../middleware/authMiddleware");

//Route for patient registration
router.post("/register", patientController.register);

//Route for patient login
router.post("/login", patientController.login);

//route to check if patient is logged in
router.get("/check-login", patientAuth, (req, res) => {
  res.status(200).json({
    message: "Patient is logged in",
    patientId: req.session.patientId,
  });
});

//logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

//CRUD Operation for patients
router.get("/profile", patientAuth, patientController.getAllPatients); //get all patients(only admins)
//router.post("/appointments", patientAuth, patientController.bookAppointment);
router.put("/profile", patientAuth, patientController.updatePatient);
router.delete("/:Id", patientController.deletePatient); // delete patient account

module.exports = router;
