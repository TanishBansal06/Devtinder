const express = require("express");
const {userauth} = require('../middlewares/auth')
const profileRouter = express.Router();
const User = require("../Models/user");
const {validateEditProfileData} = require("../utils/validation");
const {validatepassword} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view",userauth, async (req,res) => {
    try{
        res.send("user profile: " + req.user);
    }
    catch(err){
        res.status(400).send("Error in getting profile:" + err.message);
    }
});

profileRouter.patch("/profile/edit",userauth, async (req,res) => {
    try {
        //console.log(req.user._id.toString(), req.params?.userId);
        if(!validateEditProfileData(req)){
            throw new Error("Update not allowed");
        }    
        const loggedInuser = req.user;
        const {_id} = loggedInuser;
        const data = req.body;
        const updatedUser = await User.findByIdAndUpdate({ _id }, data, {returnDocument: "after", runValidators: true});

// const user = req.user;

// Object.keys(data).forEach((key) => {
//     user[key] = data[key];            ---------> or we can do this
// });

// await user.save();

        res.json({message : `${loggedInuser.firstName} , your profile updated successfuly`,
            data : updatedUser,
    });
    }
    catch(err){
        res.status(400).send("Error in updating profile:" + err.message);
    }
});

profileRouter.patch("/profile/changepass",userauth, async (req,res) =>{
    try{
        if(!validatepassword(req)){
            throw new Error("Update not allowed");
        } 
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const loggedInuser = req.user;
        const {_id} = loggedInuser;
        const updatedUser = await User.findByIdAndUpdate({ _id }, {password : hashedPassword}, {returnDocument: "after", runValidators: true});//instead of returnDocument: "after" we cn write new:true
        res.send("password is updated to: " + password);
    }
    catch(error){
        res.status(400).send("Error in updating profile:" + error.message);
    }
});

module.exports = profileRouter;
