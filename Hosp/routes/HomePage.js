const express = require("express");
const HomeRouter = express.Router();
const { UserCred } = require("../routes/Authenticate");
const User = require("../model/Patient");
const Docter = require("../model/DoctorModel");

HomeRouter.get("/", async (req, res, next) => {
  try {
    if (!UserCred || UserCred.length < 2) {
      console.error("No logged-in users found.");
      return res.send(
        `<script>alert("You are Logged Out, Please Log In!"); window.location.href = "/login";</script>`
      );
    }

    // Extract the last login credentials
    const loggedInEmail = UserCred[UserCred.length - 2];
    const profession = UserCred[UserCred.length - 1];
    // Fetch user details from the database
    const allAppointments = await User.fetchAllAppointment({ email: loggedInEmail });

    const userDetails = await User.fetchUser({ email: loggedInEmail, category: profession });

    if (!userDetails) {
      console.error("User details not found in the database.");
      return res.send(
        `<script>alert("User not found! Please log in again."); window.location.href = "/login";</script>`
      );
    }

    const allDoctors = await Docter.fetchAllDoctors();

    res.render("Index", { user: userDetails, docter: allDoctors, Timetable: allAppointments });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = HomeRouter;
