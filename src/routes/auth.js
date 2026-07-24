const express = require("express");
const {validateSignUpData} = require("../utils/validation");
const {validateLoginData} = require("../utils/validation");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login" , async (req,res) => {
    try{
       if(!validateLoginData(req)){
          throw new Error("Invalid credentials");
       }
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

authRouter.post("/logout", async (req,res) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid");
        }
        res.clearCookie("token", {expires: new Date(Date.now())} );
        res.send("Logout successful");
    }
    catch(err){
        res.status(400).send("Error in logout:" + err.message);
    }
}); 

module.exports = authRouter;