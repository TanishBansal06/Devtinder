const express = require("express");
const connectDB = require("./Config/database");
const User = require("./Models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const {validateLoginData} = require("./utils/validation");
const app = express();

app.use(express.json());//midleware

app.post("/signup", async (req, res) => {
    try {
    validateSignUpData(req);
    const {firstName,lastName,emailId,password} = req.body;
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

        const ispasswordCorrect = await bcrypt.compare(password, user.password);
        if(!ispasswordCorrect){
            throw new Error("Invalid password");
        }
        res.send("Login successful");
    }
    catch(err){
        res.status(400).send("Error in login:" + err.message);
    }
});

app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.send("No user found")
        } else {
            res.send(users)
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }

})

    app.get("/user", async (req, res) => {
        //getting user from body
        const userEmail = req.body.emailId;
        try {
            const users = await User.findOne({ emailId: userEmail })
            if (users.length === 0) {
                res.status(400).send("User not found")
            } else {

                // console.log(users)
                res.send(users)
            }
        }
        catch (err) {
            res.status(400).send("Something went wrong")
        }
    })

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const users = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully")

    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    const AllowedUpdates = ["password", "age", "photoUrl", "about" ,"skills"];
    const isUpdateAllowed = Object.keys(data).every((k)=> AllowedUpdates.includes(k));

    if (!isUpdateAllowed) {
        return res.status(400).send("Update not allowed");
    }
 
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "before" ,runValidators: true});//runvalidators is used to run the validators defined in the schema while updating the document
        console.log(user)
        res.send("User updated successfully")

    } catch (err) { 
        res.status(400).send("update failed" + err.message);
    }
})

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