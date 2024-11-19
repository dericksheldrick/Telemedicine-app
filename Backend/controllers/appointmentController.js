const res = require("express/lib/response");
const db = require("../../Backend/config/db");

//Book an appointment
exports.bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time } =
    req.body;

  try {
    //checking doctor's availability
    const [doctor] = await db.query("SELECT * FROM doctors WHERE id = ?", [
      doctor_id,
    ]);
    if (!doctor.length) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Insert the appointment into database
    await db.query(
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
      [patient_id, doctor_id, appointment_date, appointment_time, "scheduled"]
    );

    res.status(201).json({ message: "Appointment Added successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .json({ message: "Error booking Appointment", error: error.message });
  }
};

//Get all appointment
exports.getAllAppointments = async (req, res) => {
  const patient_id = req.session.patientId;

  try {
    const [appointments] = await db.query(
      "SELECT * FROM appointments WHERE patient_id = ?",
      [patient_id]
    );
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ message: "error  fetching appointments", error: error.message });
  }
};

//Update an appointment

exports.updateAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id, 10);
  const { appointment_date, appointment_time, status } = req.body;

  try {
    // update the appointment time, date or status
    const [result] = await db.query(
      "UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ? WHERE id = ? ",
      [appointment_date, appointment_time, status, appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "error updating appointment", error });
  }
};
// Delete appointment
exports.deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM appointments WHERE id = ?", [
      appointmentId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "error canceling appointment", error });
  }
};
