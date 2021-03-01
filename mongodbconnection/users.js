const mongoose = require('mongoose')

const user = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    userName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }, 
    tests:[{
        testName:{
            type:String
        },
        validMacs:{
            type:Array
        }
    }],
    alreadyLoggedIn:{
        type:Boolean
    }
});

module.exports = User = mongoose.model('user', user);