const express = require("express");

const app = express();



app.use("/hello/2", (req, res) => {
    res.send("Hel");
});
app.use("/hello", (req, res) => {
    res.send("Hello from the server from /hellow");
});
app.use("/",(req,res)=>{
    res.send("Hello form the server");
});

app.listen(7777,()=>{
    console.log("Server is running on port 7777");
});
app.listen(8000,()=>{
    console.log("Server is running on port 8000");
});