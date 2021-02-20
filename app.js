const express = require('express');
const app = express();
const serv = require('http').createServer(app);
//const connectDB = require('./mongodbconnection/connection')
const Users = require('./mongodbconnection/users')
const Admin = require('./mongodbconnection/admin')

const mongoose = require('mongoose');
//const connectDB = require('./mongodbconnection/connection');
const URI = "mongodb+srv://neeraj:Yj3ZfnXrwI11dFjM@cluster0.kjior.mongodb.net/Users?retryWrites=true&w=majority"
const connection = async ()=>{
    await mongoose.connect(
    URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true },
    function(err){
        if (err){
            console.log(err)
            return
        }
        console.log("db connected")
    });
}
connection();


//connectDB();
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

app.get('/signin.html', (req, res) =>
{
    res.sendFile(__dirname + '/signin.html');
    
}); 


app.use(express.static(__dirname + '/public'));

serv.listen(process.env.PORT || 3000); 

var io = require('socket.io')(serv,{});

io.on('connection', function(socket){
    console.log("socket connected")
    socket.on("newSignUp", async (data)=>{
        let user = {};
        user.firstName = data[0];
        user.lastName = data[1];
        user.userName = data[2];
        user.email = data[3];
        user.password = data[4];
        let userModel = new Users(user);
        await userModel.save();
        socket.emit("signupComplete")
    })

    socket.on("tryAdminLogin", async (email, pass)=>{
        Admin.find({"email":email}, 
            function(err, data) {
                if(err){
                    console.log(err);
                }
                else{
                    if(data.length == 0){
                        socket.emit("adminLogInFailed", "email");
                        return
                    }
                    else
                    {
                        if(data[0].password == pass)
                        {
                            socket.emit("adminLoggedIn", data);
                        }
                        else
                            socket.emit("adminLogInFailed", "password");
                    }
                }
        });
    })

    socket.on("tryLogin", async (email, pass)=>{
        await Users.find({"email":email}, 
            function(err, data) {
                if(err){
                    console.log(err);
                }
                else{
                    if(data.length == 0){
                        socket.emit("LogInFailed", "email");
                        return
                    }
                    else
                    {
                        if(data[0].password == pass)
                        {
                            socket.emit("LoggedIn", data);
                        }
                        else
                            socket.emit("LogInFailed", "password");
                    }
                }
        });
    })

    socket.on("disconnect", ()=>{
        console.log("socket disconnected")
    })

});

