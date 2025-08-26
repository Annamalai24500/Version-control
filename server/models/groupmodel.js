const mongoose = require('mongoose');
const shortid = require('shortid');
const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    groupId: {
        type: String,
        required: true,
        default: shortid.generate,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    storageQuota: {
        type: Number,
        default: 100 * 1024 * 1024
    },
    usedStorage: {
        type: Number,
        default: 0
    },
    repos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repo'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);