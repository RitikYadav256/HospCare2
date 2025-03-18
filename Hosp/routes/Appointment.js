const express = require("express");
const Appointment = express.Router();
const { getDB } = require("../utils/MangeData");
const { ObjectId } = require("mongodb");
const { fetchUser } = require("../model/Patient");

// Middleware
Appointment.use(express.urlencoded({ extended: true }));

// Route: Get all appointments
Appointment.get("/Appointment", async (req, res, next) => {
  try {
    const { Patientemail } = req.query;
    console.log("Fetching appointments for:", Patientemail);
    const DB = getDB();
    const PatientAppointment = await DB.collection("Appointment").find({ doctoremail: Patientemail }).toArray();
    console.log(PatientAppointment);
    res.render("Appointment", { All: PatientAppointment });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send("Error fetching appointment data.");
  }
});

// Route: Cancel an appointment
Appointment.get("/Appointment/cancle", async (req, res, next) => {
  const { Patient_id } = req.query;

  if (!Patient_id) {
    return res.status(400).send("Patient ID is required");
  }

  try {
    const DB = getDB();
    const result = await DB.collection("Appointment").deleteOne({ _id: new ObjectId(Patient_id) });

    if (result.deletedCount > 0) {
      console.log(`Deleted appointment: ${Patient_id}`);
      res.redirect("/");
    } else {
      console.log(`No appointment found for ID: ${Patient_id}`);
      res.status(404).send("Appointment not found");
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).send("Internal server error.");
  }
});

// Route: Book an appointment
Appointment.get("/Appointment/book", async (req, res, next) => {
  try {
    const { doctoremail, PatientEmail } = req.query;
    const type = "Patient";

    if (!doctoremail || !PatientEmail) {
      return res.status(400).send("Doctor email and Patient email are required.");
    }



    // Fetch patient info
    const PatientInfoForAppointment = await fetchUser({ email: PatientEmail, category: type });

    if (!PatientInfoForAppointment) {
      return res.status(404).send("Patient not found.");
    }

    // Add timestamp
    const now = new Date();
    PatientInfoForAppointment.appointmentTime = now.toISOString();

    console.log("Patient Info:", PatientInfoForAppointment);

    // Insert into database after checking for duplicate
    const db = getDB();
    const existingAppointment = await db.collection("Appointment").findOne({ _id: PatientInfoForAppointment._id });

    if (!existingAppointment) {
      await db.collection("Appointment").insertOne({
        _id: PatientInfoForAppointment._id,
        doctoremail: doctoremail,
        name: PatientInfoForAppointment.name,
        address: PatientInfoForAppointment.address,
        phone: PatientInfoForAppointment.phone,
        email: PatientInfoForAppointment.email,
        DOB: PatientInfoForAppointment.DOB,
        appointmentTime: now.toISOString(),
      });

      return res.send(`<script>alert("Appointment Booked with ${doctoremail}"); window.location.href = "/";</script>`);
    } else {
      return res.send(`<script>alert("You already have an appointment with ${doctoremail}"); window.location.href = "/";</script>`);
    }

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send("Internal server error.");
  }
});


module.exports = Appointment;
