const express = require("express");

const app = express();
const {adminauth,userauth} = require("./middlewares/auth");
app.use("/admin",adminauth);

app.get("/user/login",(req,res,next)=>{
    res.send("User Login Route");
});

app.get("/user",userauth,(req,res,next)=>{
    res.send("User Route");
});

app.get("/admin/getallrequest",(req,res,next)=>{
    res.send("Get All Request Route");
});

app.get("/admin/deleteuser",(req,res,next)=>{
    res.send("Delete User Route");
});

app.listen(7777,()=>{
    console.log("Server is running on port 7777");
});


// git status
// git add .
// git commit -m "Describe what you changed"
// git push origin main