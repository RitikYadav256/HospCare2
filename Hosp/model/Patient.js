const { getDB } = require("../utils/MangeData");
const { ObjectId } = require("mongodb");

class User {
  // Fetch user inf based on email & category
  static async fetchUser({ email, category }) {
    try {
      const db = getDB();
      console.log(email, category);
      const user = await db.collection(category).findOne({ email: email });

      if (!user) {
        console.log("Patient not found.");
        return null;
      }

      console.log("Patient Info:", user);

      return {
        id: user._id,
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        DOB: user.DOB,
        category: user.category,
        profilePic: user.profilePic
      };

    } catch (error) {
      console.error("Error fetching patient info:", error);
      return null;
    }
  }

  // Fetch all appointments for a patient
  static async fetchAllAppointment(Email) {
    try {
      const db = getDB();

      const DocEmail = Email.email;
      console.log("Finding appoint for ", DocEmail);
      const appointments = await db.collection("Appointment").find({ doctoremail: DocEmail }).toArray();
      return appointments.map(app => ({
        id: app._id,
        doctoremail: app.doctoremail,
        PatientName: app.name,
        PatientAddress: app.address,
        PatientEmail: app.email,
        PatientDOB: app.DOB,
        appointmentTime: app.appointmentTime
      }));

    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }

  // Book an appointment for a patient
  static async bookAppointment(patientEmail, doctorEmail) {
    try {
      const db = getDB();
      const patient = await this.fetchUserInfo(patientEmail);

      if (!patient) {
        throw new Error("Patient not found.");
      }

      // Check for duplicate appointment
      const existingAppointment = await db.collection("Appointment").findOne({
        email: patientEmail,
        doctoremail: doctorEmail
      });

      if (existingAppointment) {
        throw new Error("Appointment already exists with this doctor.");
      }

      // Insert new appointment
      const newAppointment = {
        _id: new ObjectId(),
        doctoremail: doctorEmail,
        name: patient.name,
        address: patient.address,
        phone: patient.phone,
        email: patient.email,
        DOB: patient.DOB,
        appointmentTime: new Date().toISOString()
      };

      await db.collection("Appointment").insertOne(newAppointment);
      return newAppointment;

    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  }
}

module.exports = User;
