const express = require("express");
const {userauth} = require('../middlewares/auth')
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userauth,async (req,res) => {
    try{
        const user = req.user;
        res.send(user.firstName + " has sent a connection request");
    }
    catch(err){
        res.status(400).send("Error in sending connection request:" + err.message);
    }
});

module.exports = requestRouter;