const express = require("express");
const {userauth} = require('../middlewares/auth')
const requestRouter = express.Router();
const ConnectionRequest = require('../Models/connectionRequest')
const User = require('../Models/user')

requestRouter.post("/request/send/:status/:touserId", userauth,async (req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.touserId;
        const status = req.params.status;

        if(toUserId.toString() === fromUserId.toString()){//toUserId===fromUserId this is wrong because one is string and one is object
            throw new Error("Invalid request");
        }

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type : " + status); 
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User not found");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId : toUserId ,toUserId : fromUserId}
            ],
        })

        if(existingConnectionRequest){
            throw new Error("connection request already exist");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status,
        })

        const data = await connectionRequest.save();
        res.json({
            message :  req.user.firstName+" "+status+" "+toUser.firstName,
            data,
        });
    }
    catch(err){
        res.status(400).send("Error in sending connection request:" + err.message);
    }
});

module.exports = requestRouter;