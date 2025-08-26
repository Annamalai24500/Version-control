const express = require('express');
const router = express.Router();
const fs = require('fs');
const Repo = require('../models/repos');
const Group = require('../models/groupmodel');
const Version = require('../models/versions');
const authMiddleware = require('../Middleware/authMiddleware');
const { multipleUpload } = require('../Middleware/multer');
const mongoose = require('mongoose');
router.post(
  '/create-repository/:groupId',
  authMiddleware,
  multipleUpload,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { name, description } = req.body;
      const { groupId } = req.params;
      if (!name || !description) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ success: false, message: 'All fields are required' });
      }
      const group = await Group.findOne({ groupId }).session(session);
      if (!group) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: 'Group not found' });
      }
      const repoExists = await Repo.findOne({ 
        name, 
        group: group._id 
      }).session(session);
      if (repoExists) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ success: false, message: 'Repository with this name already exists in the group' });
      }
      const files = req.files.map((file) => {
        let content;
        try {
          content = fs.readFileSync(file.path, 'utf-8');
        } catch {
          content = 'Could not read file';
        }
        return {
          filename: file.originalname,
          contentType: file.mimetype,
          size: file.size,
          content,
          path: file.path
        };
      });
      const repo = await Repo.create([{
        name,
        description,
        group: group._id,
        repofiles: files,
        fileCount: files.length
      }], { session });
      const version = await Version.create([{
        versionNumber: 1,
        description: 'Initial version',
        repository: repo[0]._id,
        size: files.reduce((total, f) => total + f.size, 0),
        storagePath: files.map((f) => f.path),
        parentVersion: null,
        versionfiles: files,
      }], { session });
      await Repo.findByIdAndUpdate(
        repo[0]._id,
        { currentVersion: version[0]._id },
        { session }
      );
      await Group.findByIdAndUpdate(
        group._id,
        { 
          $push: { repos: repo[0]._id },
          $inc: { usedStorage: version[0].size }
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      res.json({
        success: true,
        message: 'Repository created successfully',
        repo: repo[0],
        version: version[0]
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({
        success: false,
        message: `Error creating repository: ${error.message}`,
      });
    }
  }
);
router.get('/get-repositories/:groupId', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ groupId: req.params.groupId })
      .populate({
        path: 'repos',
        populate: {
          path: 'currentVersion',
          select: 'versionNumber description'
        }
      });
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: 'Group not found' });
    }
    res.json({
      success: true,
      repositories: group.repos,
      message: group.repos.length
        ? 'Repositories found'
        : 'No repositories yet',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching repositories: ${error.message}`,
    });
  }
});
router.get('/get-repository/:groupId/:repoId', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ groupId: req.params.groupId });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const repository = await Repo.findOne({ 
      _id: req.params.repoId, 
      group: group._id 
    })
    .populate('currentVersion')
    .populate({
      path: 'group',
      select: 'name groupId'
    });
    if (!repository) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    const versions = await Version.find({ repository: repository._id })
      .select('versionNumber description size createdAt')
      .sort({ versionNumber: -1 });

    res.json({ 
      success: true, 
      repository: {
        ...repository.toObject(),
        versions
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `Error fetching repository: ${error.message}` 
    });
  }
});
router.delete('/delete-repository/:groupId/:repoId', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const group = await Group.findOne({ groupId: req.params.groupId }).session(session);
    if (!group) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
    const repository = await Repo.findOne({ 
      _id: req.params.repoId, 
      group: group._id 
    }).session(session);
    if (!repository) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Repository not found' 
      });
    }
    const versions = await Version.find({ 
      repository: repository._id 
    }).session(session);
    const totalSize = versions.reduce((sum, version) => sum + version.size, 0);
    await Group.findByIdAndUpdate(
      group._id,
      { 
        $pull: { repos: repository._id },
        $inc: { usedStorage: -totalSize }
      },
      { session }
    );
    await Version.deleteMany({ 
      repository: repository._id 
    }).session(session);
    await Repo.findByIdAndDelete(repository._id).session(session);
    await session.commitTransaction();
    session.endSession();
    res.json({ 
      success: true, 
      message: 'Repository deleted successfully' 
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ 
      success: false, 
      message: `Error deleting repository: ${error.message}` 
    });
  }
});
router.put('/update-repository/:groupId/:repoId', authMiddleware, multipleUpload, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, description, versionDescription } = req.body;
    const { groupId, repoId } = req.params;

    if (!name || !description) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'Name and description are required' 
      });
    }

    const group = await Group.findOne({ groupId }).session(session);
    if (!group) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }

    const repo = await Repo.findOne({ 
      _id: repoId, 
      group: group._id 
    }).session(session);
    
    if (!repo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Repository not found' 
      });
    }
    if (name !== repo.name) {
      const repoWithSameName = await Repo.findOne({ 
        name, 
        group: group._id,
        _id: { $ne: repoId }
      }).session(session);
      
      if (repoWithSameName) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          success: false, 
          message: 'Another repository with this name already exists in the group' 
        });
      }
    }

    const files = req.files?.map(file => {
      let content;
      try {
        content = fs.readFileSync(file.path, 'utf-8');
      } catch {
        content = 'Could not read file';
      }
      return {
        filename: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        content,
        path: file.path
      };
    }) || [];
    repo.name = name;
    repo.description = description;
    if (files.length > 0) {
      const existingFilesMap = new Map();
      repo.repofiles.forEach(file => {
        existingFilesMap.set(file.filename, file);
      });
      const newFilesMap = new Map();
      files.forEach(file => {
        newFilesMap.set(file.filename, file);
      });
      const mergedFiles = [];
      repo.repofiles.forEach(existingFile => {
        if (!newFilesMap.has(existingFile.filename)) {
          mergedFiles.push(existingFile);
        }
      });
      files.forEach(newFile => {
        mergedFiles.push(newFile);
      });
      repo.repofiles = mergedFiles;
      repo.fileCount = mergedFiles.length;
      const latestVersion = await Version.findOne({ 
        repository: repo._id 
      })
      .sort({ versionNumber: -1 })
      .session(session);
      const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
      const newVersion = await Version.create([{
        versionNumber: newVersionNumber,
        description: versionDescription || `Update for ${name}`,
        repository: repo._id,
        size: mergedFiles.reduce((total, f) => total + f.size, 0),
        storagePath: mergedFiles.map(f => f.path),
        parentVersion: repo.currentVersion,
        versionfiles: mergedFiles
      }], { session });
      repo.currentVersion = newVersion[0]._id;
      const oldTotalSize = repo.repofiles.reduce((total, f) => total + f.size, 0);
      const newTotalSize = mergedFiles.reduce((total, f) => total + f.size, 0);
      const storageDifference = newTotalSize - oldTotalSize;
      await Group.findByIdAndUpdate(
        group._id,
        { 
          $inc: { usedStorage: storageDifference }
        },
        { session }
      );
    }
    await repo.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.json({
      success: true,
      message: 'Repository updated successfully',
      repo
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: `Error updating repository: ${error.message}`
    });
  }
});

module.exports = router;