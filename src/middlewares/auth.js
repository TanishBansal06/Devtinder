const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userauth = async (req, res, next) => {
    // read the token form thr req cookies
    // validate the token
    // find the user
    try{
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token is not valid");
    }
    const decodeobj = await jwt.verify(token,"DEV@Tinder$798"); 
    const {userId} = decodeobj;
    const user = await User.findById(userId);
    if(!user){
       throw new Error("User not found");
    }
    req.user = user;
    next();
}
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
};
module.exports = {userauth}
