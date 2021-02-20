const express = require('express');
const app = express();
var http = require('http')
const serv = require('http').createServer(app);
const connectDB = require('./mongodbconnection/connection')
const Users = require('./mongodbconnection/users')


connectDB();
// let user = {};
// user.firstName = "chomu";
// user.lastName = "parsad";
// let userModel = new Users(user);
// userModel.save();
//Yj3ZfnXrwI11dFjM
//mongodb+srv://neeraj:<password>@cluster0.kjior.mongodb.net/myFirstDatabase?retryWrites=true&w=majority uri



app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
}); 

app.get('/admin.html', (req, res) =>
{
    res.sendFile(__dirname + '/admin.html');
    
}); 

app.get('/signup.html', (req, res) =>
{
    res.sendFile(__dirname + '/signup.html');
    
}); 


app.use(express.static(__dirname + '/public'));

serv.listen(process.env.PORT || 3000); 

var io = require('socket.io')(serv,{});

io.on('connection', function(socket){
    console.log("socket connected")
    socket.on("newSignUp", (data)=>{
        let user = {};
        user.firstName = data[0];
        user.lastName = data[1];
        user.userName = data[2];
        user.email = data[3];
        user.password = data[4];
        let userModel = new Users(user);
        userModel.save();
    })


});