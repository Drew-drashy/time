const mongoose=require('mongoose');
const projectSchema=new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    description:{
        String
    },
    assignedEmployees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    center:{
        latitude: Number,
        longitude: Number,
    },
    radius:{
        type:Number
    },
    workingHours: String,
    status:{type:String,enum:['ongoing','completed'], default:'ongoing'},

},{timestamps:true});

module.exports=mongoose.model('Project',projectSchema);