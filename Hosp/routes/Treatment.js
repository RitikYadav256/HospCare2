const express = require('express');
const { fetchUser } = require('../model/Patient');
const Treatment = express.Router();
const MedicineModel = require('../model/MedicalModel');

Treatment.get("/Treatment", async (req, res, next) => {
  try {
    const { Patientemail, Doctoremail } = req.query;

    console.log("Doctor email:", Doctoremail, "Patient email:", Patientemail);

    const PatientDetails = await fetchUser({ email: Patientemail, category: "Patient" });
    const Medicines = await MedicineModel.fetchMedicine();

    res.render("Treatment", { Details: PatientDetails, AllMedicine: Medicines, Doctoremail });
  } catch (error) {
    console.error("Error in Doing treatment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Treatment.get("/Treatment/SubmitMedicalInfo", async (req, res) => {
  try {
    if (!req.query.MedicData) {
      return res.status(400).json({ error: "Missing MedicData in request" });
    }

    let medicData;
    try {
      medicData = JSON.parse(decodeURIComponent(req.query.MedicData));
    } catch (parseError) {
      console.error("Error parsing MedicData:", parseError);
      return res.status(400).json({ error: "Invalid MedicData format" });
    }

    const DoctoremailFor = req.query.Doctoremail;
    console.log("Doctor Email for Medicine:", DoctoremailFor);

    if (!medicData.PatientEmailFor || !Array.isArray(medicData.formattedMedicData)) {
      return res.status(400).json({ error: "Invalid or missing MedicData fields" });
    }

    const Patient_Email_id = medicData.PatientEmailFor;
    const MedicDataForPatient = medicData.formattedMedicData;

    const saveResult = await MedicineModel.SaveMedicine({ Patient_Email_id, MedicDataForPatient });

    if (!saveResult) {
      return res.status(500).json({ error: "Failed to save medical data" });
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = Treatment;
