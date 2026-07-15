const mongoose = require("mongoose");

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
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required : true,
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
        maxlength: 200
    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder",
        minlength: 10,
        maxlength: 200
    },
    skills:{
        type: [String]
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;