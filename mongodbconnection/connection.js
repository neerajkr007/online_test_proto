const mongoose = require('mongoose');
const URI = "mongodb+srv://neeraj:Yj3ZfnXrwI11dFjM@cluster0.kjior.mongodb.net/Users?retryWrites=true&w=majority"
const connectDB = async ()=>{
    // await mongoose.connect(URI, {
    //     useNewUrlParser: true, 
    //     useUnifiedTopology: true 
    // });
    // console.log("db connected")
};

module.exports = connectDB;