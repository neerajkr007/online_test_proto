const mongoose = require('mongoose')

const questions = new mongoose.Schema({
    testId:{
        type:Array
    },
    question:{
        type:String
    },
    option1:{
        type:String
    },
    option2:{
        type:String
    },
    option3:{
        type:String
    },
    option4:{
        type:String
    }
});

module.exports = Questions = mongoose.model('questions', questions);