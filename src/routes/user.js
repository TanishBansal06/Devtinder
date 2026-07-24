const express = require("express");
const {userauth} = require("../middlewares/auth");
const ConnectionRequest = require("../Models/connectionRequest");
const userRouter = express.Router();

const User_Safe_Data = "firstName lastName photoUrl gender age skills ";

userRouter.get("/user/connections", userauth , async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find(
            {$or : [
                {toUserId : loggedInUser._id, status : "accepted"},
                {fromUserId : loggedInUser._id, status : "accepted"}
            ],
            }).populate("fromUserId",User_Safe_Data)
              .populate("toUserId",User_Safe_Data);
        if(connectionRequests.length === 0){
            throw new Error("No user found");
        }

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
    });

        res.json({
            message: "Connection fetched successfully",
            data: data
        });
    }
    catch(err){
        res.status(400).send("Error in fetching connection : " + err.message);
    }
});

userRouter.get("/user/requests/rececived", userauth , async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find(
            {toUserId : loggedInUser._id,
            status : "interested"
        // }).populate("fromUserId",["firstName","lastName"]);
        }).populate("fromUserId","firstName lastName photoUrl gender age");
        if(connectionRequests.length === 0){
            throw new Error("No user found");
        }

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        });
    }
    catch(err){
        res.status(400).send("Error in fetching connectionRequests : " + err.message);
    }
});

module.exports = userRouter;