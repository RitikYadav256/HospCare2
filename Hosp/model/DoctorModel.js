const { getDB } = require('../utils/MangeData');

class Doctor {
  constructor(id, name, address, email, phone, category, speciality,timeSlot, medicalType, password, profilePic, createdAt) {
    this._id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.category = category;
    this.speciality = speciality;
    this.timeSlot=timeSlot;
    this.medicalType = medicalType;
    this.password = password;
    this.profilePic = profilePic;
    this.createdAt = createdAt || new Date();
  }

  // Fetch all doctors from the database
  static async fetchAllDoctors() {
    try {
      const db = getDB();
      const allDoctors = await db.collection("Doctor").find({}).toArray(); 
      console.log(allDoctors.profilePic);
      return allDoctors.map(user => new Doctor(
        user._id,
        user.name,
        user.address,
        user.email,
        user.phone,
        user.category,
        user.speciality,
        user.timeSlot,
        user.medicalType,
        user.password,
        user.profilePic,
        user.createdAt
      ));
      
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return []; 
    }
  }
}

module.exports = Doctor;
