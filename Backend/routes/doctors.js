const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { adminAuth } = require("../middleware/authMiddleware");

//routes to check if admin is logged in
router.get("/check-login", adminAuth, (req, res) => {
  res
    .status(200)
    .json({ message: "admin is logged in ", adminId: req.session.adminId });
});

//routes for doctors
router.post("/login", doctorController.login);
router.post("/add", adminAuth, doctorController.addDoctor);
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/:id", adminAuth, doctorController.updateDoctor);
router.delete("/:id", adminAuth, doctorController.deleteDoctor);

module.exports = router;
