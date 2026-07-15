const express = require("express");
const connectDB = require("./Config/database");
const User = require("./Models/user");

const app = express();

app.use(express.json());//midleware

app.post("/signup", async (req, res) => {
    const data = req.body;
    const user = new User(data)

    try {
        await user.save();
        res.send("User added successfully")

    } catch (err) {
        res.status(400).send("Error in saving the user:" + err.message)
    }
})

app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({})
        if (users.length === 0) {
            res.send("No user found")
        } else {
            console.log(users);
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

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "before" ,runvalidators: true});
        console.log(user)
        res.send("User updated successfully")

    } catch (err) {
        res.status(400).send("Something went wrong")
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
// git commit -m "Describe what you changed"
// git push origin main