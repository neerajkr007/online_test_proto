const mongoose = require('mongoose')

const tests = new mongoose.Schema({
    testName:{
        type:String
    },
    description:{
        type:String
    },
    date:{
        type:String
    },
    startTime:{
        type:String
    },
    timeFrom:{
        type:String
    },
    timeTo:{
        type:String
    }
});



module.exports = Tests = mongoose.model('tests', tests);