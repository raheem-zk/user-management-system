const mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({

    email:{
        type:String,
        require:true,
        unique: true
    },
    password:{
        type:String,
        require:true,
    },
    admin:{
        type:Number,
        require:true
    }
});

module.exports = mongoose.model('adminCollection',adminSchema);