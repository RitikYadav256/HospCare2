const { MongoClient } = require("mongodb");

const mongoUrl = "mongodb+srv://ritik:8287617808@ritikyadav.9q3yt.mongodb.net/?retryWrites=true&w=majority&appName=RitikYadav";

let _db;
const mongoConnect = (callback) => {
  
  MongoClient.connect(mongoUrl)
    .then(client => {
      console.log("Connected to MongoDB");
      callback(client);
      _db=client.db('Hosp_db');
    })
    .catch(error => {
      console.error("Error while connecting to MongoDB:", error);
    });
};

const getDB=()=>{
  if(!_db){
    throw new error("not connected");
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB=getDB;