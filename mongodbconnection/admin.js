const mongoose = require('mongoose')

const admin = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    },
    userName:{
        type:String
    }
});



module.exports = Admin = mongoose.model('admin', admin, 'admins');

