const express = require("express");
const {userauth} = require("../middlewares/auth");
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user");
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

userRouter.get("/feed", userauth , async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50:limit;
        const skip = (page-1)*limit;
        // find all connectionrequest send or receive
        const connectionRequests = await ConnectionRequest.find(
            {$or : [
            {toUserId : loggedInUser._id},
            {fromUserId : loggedInUser._id}
        ]  
        }).select("fromUserId toUserId");
        // .populate("fromUserId","firstName")
        // .populate("toUserId","firstName")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        //console.log(hideUsersFromFeed);

        const users = await User.find({
            $and : [
            {_id : { $nin : Array.from(hideUsersFromFeed)}},
            {_id : { $ne : loggedInUser._id}},//if the user has not make any connection req then it will not present in hideUsersFromFeed
            ],
        }).select(User_Safe_Data).skip(skip).limit(limit);

        res.json({
            message : "Users in the feed",
            data : users
        })
    }
    catch(err){
        res.status(400).send("User not fount : " + err.message);
    }
});

module.exports = userRouter;