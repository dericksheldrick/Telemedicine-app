const path = require("path");
const express = require("express");
const session = require("express-session");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const cors = require("cors");

const app = express();
const port = 3000;

//middleware
app.use(express.json()); //parse incoming json data
app.use(
  session({
    secret: "telemedicine_database-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//static frontend file
app.use(express.static(path.join(__dirname, "../Frontend")));
app.use(cors({ origin: "http://127.0.0.1:8080", credentials: true }));

//Routes
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
