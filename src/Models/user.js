const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema =  new mongoose.Schema({
    firstName: {
        type: String,
        required : true, 
        minlength: 4,
        maxlength: 20
    },
    lastName: {
        type: String,
        required : true,
    },
    emailId: {
        type: String,
        lowercase: true,
        required : true,
        unique: true,//mongodb automatically create because of unique or we can write index:true
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough"); 
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        validate(value){
            // or we can write !["male", "female", "other"].includes(value) 
            if(value !== "male" && value !== "female" && value !== "other"){    
                throw new Error("Invalid gender");
            }
    },
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        minlength: 10,
        maxlength: 200,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder",
        minlength: 10,
        maxlength: 200
    },
    skills:{
        type: [String],
        validate(value){
            if(value.length > 15){
                throw new Error("Skills should be less than 15");
            }
        }
    }
},
{
    timestamps: true
});

userSchema.index({firstName:1,lastName:1});

userSchema.methods.getJwt = async function(){//not use access arrow function because we need to use this keyword
  const user = this;
  const token = await jwt.sign({userId: user._id}, "DEV@Tinder$798", {expiresIn: "1d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordbyuser){
    const user = this;
    const isMatch = await bcrypt.compare(passwordbyuser, user.password);//not interchangeable because the first argument is the plain text password and the second argument is the hashed password
    return isMatch;
}

const User = mongoose.model("User", userSchema);
//mongoose automatically looks for the plural, lowercased version of your model name. 
//For example, if you use "User" for your model name, the corresponding collection name will be "users".

module.exports = User;