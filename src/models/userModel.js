const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
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


module.exports = new mongoose.model('userColloction',userSchema);