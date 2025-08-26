const mongoose = require('mongoose');
const repoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    currentVersion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Version',
        default: null
    },
    fileCount: {
        type: Number,
        default: 0
    },
    repofiles: [
        {
            filename: String,
            contentType: String,
            size: Number,
            content: String,
            path: String
        }
    ]
}, {
    timestamps: true
});
repoSchema.index({ name: 1, group: 1 }, { unique: true });
module.exports = mongoose.model('Repo', repoSchema);