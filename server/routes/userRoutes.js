const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware =require('../Middleware/authMiddleware');
const mongoose = require('mongoose');
const shortid = require('shortid');
const Group = require('../models/groupmodel');
require('dotenv').config();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id }, process.env.secret_key, {
      expiresIn: '2d',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.secret_key, {
      expiresIn: '2d',
    });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});
router.get('/get-current-user',authMiddleware,async(req,res)=>{
  try {
    const user = await User.findById(req.userId);
    if(!user){
      return res.json({success:false,message:'User not found'});
    }
    res.json({success:true,user:{_id:user._id,name:user.name,email:user.email,groups:user.groups || []}});
  } catch (error) {
    res.json({success:false,message:'Error fetching user data',error: error.message});
  }
});
router.post('/create-group', authMiddleware, async (req, res) => {
  try {

    const { groupName } = req.body;
    if (!groupName || groupName.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Group name is required' 
      });
    }
    const newGroup = new Group({
      name: groupName,
      members: [req.userId],
      owner: req.userId,
      groupId: shortid.generate()
    });
    const savedGroup = await newGroup.save();
    const user = await User.findById(req.userId);
    if (!user.groups) user.groups = [];
    user.groups.push({
      name: savedGroup.name,
      groupId: savedGroup.groupId
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: {
        name: savedGroup.name,
        groupId: savedGroup.groupId
      }
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating group"
    });
  }
});
router.post('/join-group', authMiddleware, async (req, res) => {
  try {
     console.log("Received join request for groupId:", req.body.groupId);
    console.log("Authenticated userId:", req.userId);
    const { groupId } = req.body;
    if (!groupId || groupId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Group ID is required"
      });
    }
    const group = await Group.findOne({ groupId });
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }
    if (group.members.includes(req.userId)) {
      return res.status(400).json({
        success: false,
        message: "You're already in this group"
      });
    }
    group.members.push(req.userId);
    console.log("Group before save:", group);
    await group.save();
    const user = await User.findById(req.userId);
    if (!user.groups) user.groups = [];
    user.groups.push({
      name: group.name,
      groupId: group.groupId
    });
    console.log("User before save:", user);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Successfully joined group",
      group: {
        name: group.name,
        groupId: group.groupId
      }
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({
      success: false,
      message: "Server error joining group"
    });
  }
});
router.delete('/leave-group/:groupId',authMiddleware,async(req,res)=>{
  try {
    const {groupId} = req.params;
    if(!groupId || groupId.trim()===''){
      return res.status(400).json({success:false,message:'Group ID is required'});
    }
    const user = await User.findById(req.userId);
    if(!user || !user.groups){
      return res.status(404).json({success:false,message:'User not found or no groups associated'});
    }
    const group = await Group.findOne({groupId});
    if(!group){
      return res.status(404).json({success:false,message:'Group not found'});
    }
    if(!group.members.includes(req.userId)){
      return res.status(400).json({success:false,message:"You're not a member of this group"});
    }
    if(!(group.owner.toString()===req.userId.toString())){
        group.members = group.members.filter(member => member.toString() !== req.userId.toString());
        await group.save();
        user.groups = user.groups.filter(g => g.groupId !== groupId);
        await user.save();
        return res.json({success:true,message:'Left group successfully'})
    }else{
      await Group.deleteOne({groupId:group.groupId});
      user.groups = user.groups.filter(g => g.groupId !== groupId);
      await user.save();
      return res.json({success:true,message:"Group deleted permanently"});
    }
  } catch (error) {
    res.json({success:false,message:'Error leaving group',error:error.message});
  }
});
module.exports = router;
