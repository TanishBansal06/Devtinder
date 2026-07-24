const express = require("express");
const connectDB = require("./Config/database");
const cookieParser = require("cookie-parser");
 
const app = express();

app.use(express.json());//middleware to parse json
app.use(cookieParser());//middleware to parse cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");  
const userRouter = require("./routes/user");  

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);    
app.use("/", userRouter);    

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
