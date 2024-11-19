const res = require("express/lib/response");
const db = require("../config/db");
const bcrypt = require("bcrypt");

//Register new patient
exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    date_of_birth,
    gender,
    address,
  } = req.body;

  try {
    //check if the patient already exists
    const [existingPatient] = await db.query(
      "SELECT * FROM patients WHERE email = ?",
      [email]
    );
    if (existingPatient.length > 0) {
      return res
        .status(400)
        .json({ message: "Patient with this email already exists." });
    }

    //Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // insert the new patient into the database
    await db.query(
      "INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        date_of_birth,
        gender,
        address,
      ]
    );
    res.status(201).json({ message: "Patient registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//patients login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the patient exists
    const [patient] = await db.query("SELECT * FROM patients WHERE email = ?", [
      email,
    ]);
    if (patient.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //compare the password with the hashed password in the database
    const validPassword = await bcrypt.compare(
      password,
      patient[0].password_hash
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    //start a session and store the patient information
    req.session.patientId = patient[0].id;

    res.status(200).json({ message: "Login successful!", patient: patient[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Get all patients (admin only)
exports.getAllPatients = async (req, res) => {
  try {
    const [patients] = await db.query("SELECT * FROM patients");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

//update patient profile
exports.updatePatient = async (req, res) => {
  const patientId = req.params.id;
  const { first_name, last_name, phone, date_of_birth, gender, address } =
    req.body;

  try {
    await db.query(
      "UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?",
      [first_name, last_name, phone, date_of_birth, gender, address, patientId]
    );
    res.status(200).json({ message: "Patient profile update successfully" });
  } catch (error) {
    res.status(500).json({ message: "error updating patient profile", error });
  }
};

//Delete patient account
exports.deletePatient = async (req, res) => {
  const patientId = req.params.id;

  try {
    await db.query("DELETE FROM patients WHERE id = ?", [patientId]);
    res.status(200).json({ message: "Patient account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient account", error });
  }
};
