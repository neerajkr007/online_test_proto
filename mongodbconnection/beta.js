const mongoose = require('mongoose')

const beta = new mongoose.Schema({
    id:{
        type:String
    },
    token:{
        type:String
    }
});



module.exports = Beta = mongoose.model('beta', beta);