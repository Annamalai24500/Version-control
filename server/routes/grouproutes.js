const express = require('express');
const router = express.Router();
const Group = require('../models/groupmodel');
const authMiddleware = require('../Middleware/authMiddleware');
router.get('/get-groups',authMiddleware,async(req,res)=>{
    try {
        const groups =await Group.find();
        if(!groups){
            return res.json({success:false,message:"No groups found"});
        }
        res.json({success:true,groups:groups});
    } catch (error) {
        res.json({success:false,message:"Error fetching groups",error:error.message});
    }
});
router.get('/get-current-group/:groupId',authMiddleware,async(req,res)=>{
    try {
            const groupId = req.params.groupId;
            const group =await Group.findOne({groupId});
            if(!group){
                return res.json({success:false,message:"Group does not exist lmao"});
            }
            res.json({success:true,group,message:"Group found successfully"});
    } catch (error) {
        res.json({success:false,message:"Erroe getting current group lmao"})
    }
});
module.exports = router