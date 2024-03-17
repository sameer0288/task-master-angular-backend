const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://sameersheikh0288:sameer786@cluster0.b3rolqc.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (!err) console.log("Connected to DB");
    else throw err;
  }
);

module.exports = mongoose;
