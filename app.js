const express = require("express");

const app = express();


app.use("/user",(req,res,next)=>{
    console.log("User route is working");
    // res.send("User is found");
    next();
},
(req,res,next)=>{
    console.log("User route2 is working");
    // res.send("User is found2");
    next();
    },
(req,res,next)=>{
    console.log("User route2 is working");
    res.send("User is found3");
    });

app.listen(7777,()=>{
    console.log("Server is running on port 7777");
});
