const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true},
  password: { type: String,default:""  },
  birthday: { type: String, default:"" },
});

module.exports = mongoose.model("User", UserSchema);
   