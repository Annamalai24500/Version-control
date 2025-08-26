const express = require('express');
const router = express.Router();
const Repo = require('../models/repos');
const authMiddleware = require('../Middleware/authMiddleware');
const { multipleUpload } = require('../Middleware/multer');
const Version = require('../models/versions');
const Group = require('../models/groupmodel');
router.get('/get-version/:groupId/:repoId/:versionId', authMiddleware, async (req, res) => {
    try {
        const { groupId, repoId, versionId } = req.params;
        if (!groupId || !repoId || !versionId) {
            return res.status(400).json({ success: false, message: "Group ID, Repo ID and Version ID are required" });
        }
        const group = await Group.findOne({ groupId });
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }
        const repo = await Repo.findOne({ _id: repoId, group: group._id });
        if (!repo) {
            return res.status(404).json({ success: false, message: "Repository not found" });
        }
        const version = await Version.findOne({ _id: versionId, repository: repo._id });
        if (!version) {
            return res.status(404).json({ success: false, message: "Version not found" });
        }
        res.json({ success: true, version, message: "Version fetched successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching version", error: error.message });
    }
});
router.get('/get-versions/:groupId/:repoId', authMiddleware, async (req, res) => {
    try {
        const { groupId, repoId } = req.params;
        if (!groupId || !repoId) {
            return res.status(400).json({ success: false, message: "Group ID and Repo Id are required" });
        }

        const group = await Group.findOne({ groupId });
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        const repo = await Repo.findOne({ _id: repoId, group: group._id });
        if (!repo) {
            return res.status(404).json({ success: false, message: "Repository not found" });
        }

        const versions = await Version.find({ repository: repo._id });
        if (!versions.length) {
            return res.status(404).json({ success: false, message: "No versions found for this repository" });
        }

        res.json({ success: true, versions, message: "Versions fetched successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching versions", error: error.message });
    }
});

module.exports = router;
