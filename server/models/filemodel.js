const mongoose = require('mongoose');
const fileSchema = mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    originalname:{
        type:String,
        required:true
    },
    mimetype:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    uploaddate:{
        type:Date,
        default: Date.now
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
},{
    timestamps:true
});
module.exports = mongoose.model('File',fileSchema);