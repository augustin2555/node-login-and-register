const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({}));

mongoose.connect(
  "mongodb+srv://admin:MTY17ZehCeq6MUxY@cluster0.oyys1ne.mongodb.net/login_register?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//Routes

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Succesfully", user: user });
      } else {
        res.send({ message: "Password did not matcth" });
      }
    } else {
      res.send({ message: "User not Registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Succesfully Registered,Please Login now !" });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("Be started at port 9002");
});
