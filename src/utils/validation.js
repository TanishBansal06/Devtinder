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
}

module.exports = {validateSignUpData, validateLoginData};