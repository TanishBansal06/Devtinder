const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",//reference to the user collection
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",//reference to the user collection
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored","interested","accepted","rejected"],
            message : `{value} is incorrect status type` 
        }
    }
},
{
    timestamps : true
});

connectionRequestSchema.index({fromUserId : 1, toUserId : 1});

connectionRequestSchema.pre("save", async function(){
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){//toUserId===fromUserId this is wrong because one is string and one is object
            throw new Error("Invalid request");
        }
})

module.exports = mongoose.model("connectionRequest", connectionRequestSchema);;