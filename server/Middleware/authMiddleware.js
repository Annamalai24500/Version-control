const jsonwebtoken =require('jsonwebtoken');
const uploads = require('../')
module.exports = function (req,res,next){
    try{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.json({success:false,message:"Token missing pretty boy"});
    }
    const token = authHeader.split(" ")[1].trim();
    const decoded = jsonwebtoken.verify(token,process.env.secret_key);
    req.userId = decoded.userId;
    next();
    }catch(error){
        res.json({success:false,message:error.message});
    }
}