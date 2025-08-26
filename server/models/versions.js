const mongoose = require('mongoose');
const path = require('path');
const versionSchema = mongoose.Schema({
    versionNumber: {
        type: Number,
        required: true,
        default: 1
    },
    description: {
        type: String,
        required: true,
        default: 'Initial version'
    },
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repo', 
        required: true
    },
    size: {
        type: Number,
        required: true,
        default: 0
    },
    storagePath: [{
        type: String,
        required: true
    }],
    parentVersion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Version',
        default: null
    },
    versionfiles: [{
        filename: String,
        contentType: String,
        size: Number,
        content: String,
        path: String
    }]
}, {
    timestamps: true
});
versionSchema.index({ repository: 1, versionNumber: 1 }, { unique: true });
module.exports = mongoose.model('Version', versionSchema);