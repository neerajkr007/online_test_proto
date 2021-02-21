const express = require('express');
const app = express();
const serv = require('http').createServer(app);
//const connectDB = require('./mongodbconnection/connection')
const Users = require('./mongodbconnection/users')
const Admin = require('./mongodbconnection/admin')
const Beta = require('./mongodbconnection/beta')

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

app.get('/index', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
}); 

app.get('/admin', (req, res) =>
{
    res.sendFile(__dirname + '/admin.html');
    
}); 

app.get('/signup', (req, res) =>
{
    res.sendFile(__dirname + '/signup.html');
    
}); 

app.get('/signin', (req, res) =>
{
    res.sendFile(__dirname + '/signin.html');
    
}); 

app.get('/betaTest', (req, res) =>
{
    res.sendFile(__dirname + '/betaTest.html');
    
}); 



app.use(express.static(__dirname + '/public'));

serv.listen(process.env.PORT || 3000); 

function Token() {
    length = 16;
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

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


    socket.on("register", async (id)=>{
        await Beta.find({"id":id},
        async function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                if(data.length == 0){
                    let i = {};
                    i.id = id;
                    i.token = Token();
                    let beta = new Beta(i);
                    await beta.save();
                    socket.emit("registered")
                    Users.findOneAndUpdate({"_id": id}, 
                        {$push: {'tests': "beta"}}, 
                        {new: true}, (err, result) => {
                        //
                    })
                }
                else
                {
                    socket.emit("alreadyRegistered")
                }
            }
        });
        
    })


    socket.on("disconnect", ()=>{
        console.log("socket disconnected")
    })

});

