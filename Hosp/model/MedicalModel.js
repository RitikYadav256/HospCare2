const { getDB } = require('../utils/MangeData');

class MedicalModel {
  constructor(Medicine_Name, Price) {
    this.Medicine_Name = Medicine_Name;
    this.Price = Price;
  }

  static async fetchMedicine() {
    try {
      const DB = getDB();
      const Data = await DB.collection("Medicine").find({}).toArray();
      return Data;
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  }
  static async SaveMedicine({ Patient_Email_id, MedicDataForPatient }) {
    const DB = getDB();
    const result = await DB.collection("Patient").updateOne(
      { email: Patient_Email_id },
      { $push: { MedicDataForPatient: { $each: MedicDataForPatient } } }
    );
  }
}

module.exports = MedicalModel;
