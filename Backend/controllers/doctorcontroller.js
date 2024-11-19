const db = require("../../Backend/config/db");

//adm a new doctor(admin only)
exports.addDoctor = async (req, res) => {
  const { first_name, last_name, specialization, email, phone, schedule } =
    req.body;

  try {
    await db.query(
      "INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, specialization, email, phone, schedule]
    );
    res.status(201).json({ message: "Doctor added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding doctor", error });
  }
};

//doctors login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for a doctor with the provided email
    const [doctor] = await db.query("SELECT * FROM doctors WHERE email = ?", [
      email,
    ]);

    // Check if no doctor is found
    if (doctor.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored password hash
    const validPassword = await bcrypt.compare(
      password,
      doctor[0].password_hash
    );

    // Check if the password is invalid
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Store the doctor's ID in the session
    req.session.doctorId = doctor[0].id;

    // Send a success response with the doctor's details
    res.status(200).json({ message: "Login successful!", doctor: doctor[0] });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server error", error });
  }
};

//Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const [doctor] = await db.query("SELECT * FROM doctors");
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "error fetching doctors", error });
  }
};

//Get a doctor by ID
exports.getDoctorById = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [doctor] = await db.query("SELECT * FROM doctors WHERE id = ?", [
      doctorId,
    ]);
    if (doctor.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor", error });
  }
};

//Update doctors profile
exports.updateDoctor = async (req, res) => {
  const doctorId = req.params.id;
  const { first_name, last_name, specialization, phone, schedule } = req.body;

  try {
    await db.query(
      "UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ?, schedule = ? WHERE id = ?",
      [first_name, last_name, specialization, phone, schedule, doctorId]
    );
    res.status(200).json({ message: "Doctor updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor", error });
  }
};
//delete a doctor from database
exports.deleteDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    await db.query("DELETE FROM doctors WHERE id = ?", [doctorId]);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ mesage: "error deleting doctor", error });
  }
};
