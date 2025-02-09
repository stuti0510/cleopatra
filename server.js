require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport=require("passport");
const session=require("express-session");
const cors = require("cors");
require("./config/passport");

const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cors());

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false} 
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));


app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    