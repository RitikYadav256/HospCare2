const express = require("express");
const path = require("path");
const multer = require("multer");
const { getDB } = require("../utils/MangeData");

let Valid = false;
const Check = express.Router();
const relPath = path.join(__dirname, "../view");

// Array to store logged-in users
let UserCred = [];

// Middleware to parse form data
Check.use(express.urlencoded({ extended: true }));

// Multer Configuration for File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


// Handling Login Page
Check.get("/login", (req, res) => {
  res.sendFile(path.join(relPath, "Login.html"));
});

// Validating User Email and Password
Check.post("/login/validateMe", async (req, res) => {
  try {
    const MatchDB = getDB();
    const user = await MatchDB.collection("homes").findOne({ email: req.body.email });

    if (!user) {
      console.log("Not found user");
      return res.redirect("/SignUp");
    }

    if (user.password !== req.body.password) {
      return res.send(`<script>alert("Wrong Password"); window.location.href = "/login";</script>`);
    }

    Valid = true;


    if (!UserCred.includes(user.email)) {
      UserCred.push(user.email);
      UserCred.push(req.body.userType);
    }
    res.redirect("/");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Handling Signup with File Upload
Check.get("/SignUp", (req, res, next) => {
  res.render("SignUp");
})

Check.post("/signup/submit", upload.single("profilePic"), async (req, res) => {
  try {
    const setDB = getDB();

    // Validate category
    const allowedCollections = ["Doctor", "Patient", "Medical"];
    if (!allowedCollections.includes(req.body.category)) {
      return res.status(400).send("Invalid category.");
    }

    const userData = {
      name: req.body.name,
      DOB: req.body.DOB,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      speciality: req.body.speciality || null,
      timeSlot: req.body.timeSlot || null,
      medicalType: req.body.medicalType || null,
      password: req.body.password,
      profilePic: req.file ? req.file.filename : null,
      createdAt: new Date()
    };

    // Insert user into category-based collection
    await setDB.collection(req.body.category).insertOne(userData);

    // Store login credentials separately
    await setDB.collection("homes").insertOne({ email: req.body.email, password: req.body.password });

    res.send(`<script>alert("Signup successful!"); window.location.href = "/login";</script>`);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send("Error while registering user.");
  }
});

module.exports = { Check, UserCred };
