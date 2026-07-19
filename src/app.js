const express = require("express");
const connectDB = require("./Config/database");
const User = require("./Models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const {validateLoginData} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userauth} = require('./middlewares/auth')

const app = express();

app.use(express.json());//middleware to parse json
app.use(cookieParser());//middleware to parse cookies
app.use("/profile",userauth);

app.post("/signup", async (req, res) => {
    try {
    validateSignUpData(req);
    const {firstName,lastName,emailId,password,} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({firstName,lastName,emailId,password:hashedPassword});
    
        await user.save();
        res.send("User added successfully")

    } catch (err) {
        res.status(400).send("Error in saving the user:" + err.message)
    }
})

app.post("/login" , async (req,res) => {
    try{
       validateLoginData(req);
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId});

        if(!user){
            throw new Error("User not found");
        }

        const ispasswordCorrect = await user.validatePassword(password);
        if(!ispasswordCorrect){
            throw new Error("Invalid credentials");
        }
         
        const token = await user.getJwt(); 
        res.cookie("token", token , {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
        res.send("Login successful");
    }
    catch(err){
        res.status(400).send("Error in login:" + err.message);
    }
});

app.get("/profile", async (req,res) => {
    try{
        res.send("user profile: " + req.user);
    }
    catch(err){
        res.status(400).send("Error in getting profile:" + err.message);
    }
});

app.post("/sendConnectionRequest", userauth,async (req,res) => {
    try{
        res.send("Connection request sent successfully to user: ");
    }
    catch(err){
        res.status(400).send("Error in sending connection request:" + err.message);
    }
});

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");

    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.error(err);
  });

// git status
// git add .
// git commit -m "Implemented user authentication and validation for signup and login routes"
// git push origin main