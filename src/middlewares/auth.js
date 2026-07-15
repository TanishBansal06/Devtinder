const adminauth = (req, res, next) => {  
    console.log("Admin Auth Middleware");
    const token = "xyz";
    const istokenvalid = token === "xyz";
    if(istokenvalid){
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

const userauth = (req, res, next) => {
    console.log("User Auth Middleware");  
    const token = "xyz";
    const istokenvalid = token === "xyz";
    if(istokenvalid){
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};
module.exports = {adminauth,userauth}