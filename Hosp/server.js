//Core module
const express = require('express');
const path = require('path');
//Our module
const app = express();
const Port = 3004;
const HomeRouter = require('./routes/HomePage');
const { Check } = require('./routes/Authenticate');
const Appointment = require('./routes/Appointment');
const Treatment = require('./routes/Treatment');
const { mongoConnect } = require('./utils/MangeData');
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use('/', HomeRouter);
app.use('/', Check);
app.use('/', Appointment);
app.use('/', Treatment);

mongoConnect(client => {
  app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
  });
})
