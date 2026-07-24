const validator = require("validator");
const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName || !emailId || !password){
        throw new Error("All fields are required");
    }
    else if(validator.isEmail(emailId) === false){
        throw new Error("Invalid email");
    }
    else if(validator.isStrongPassword(password) === false){
        throw new Error("Password is not strong enough");
    }
}

const validateLoginData =  (req)=>{
    const {emailId, password} = req.body;
    if(validator.isEmail(emailId) === false){
        throw new Error("Invalid email");
    }
    return true;
}

const validateEditProfileData = (req) => {
    const data = req.body;
    if (data.photoUrl && !validator.isURL(data.photoUrl)) {
        throw new Error("Invalid Photo URL");
    }
    const AllowedUpdates = ["age", "photoUrl", "about" ,"skills","gender"];
    const isUpdateAllowed = Object.keys(data).every((k)=> AllowedUpdates.includes(k));
    if (!isUpdateAllowed) {
        throw new Error("Update not allowed");
    }
    return isUpdateAllowed;
}

const validatepassword = (req) => {
    const {password} = req.body;
    const AllowedUpdates = ["password"];
    if(validator.isStrongPassword(password) === false){
        throw new Error("Password is not strong enough");
    }
    const isUpdateAllowed = Object.keys(req.body).every((k)=> AllowedUpdates.includes(k));
    if (!isUpdateAllowed) {
        throw new Error("Update not allowed");
    }
    return isUpdateAllowed;
}

module.exports = {validateSignUpData, validateLoginData, validateEditProfileData, validatepassword};