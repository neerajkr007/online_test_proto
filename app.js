const express = require('express');
const app = express();
const serv = require('http').createServer(app);
//const connectDB = require('./mongodbconnection/connection')
const Users = require('./mongodbconnection/users')
const Admin = require('./mongodbconnection/admin')
const Beta = require('./mongodbconnection/beta')
const Tests = require('./mongodbconnection/tests')
const Questions = require('./mongodbconnection/questions')
var testSchemas = {}

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
        mongoose.set('useFindAndModify', false);
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
            async function(err, data) {
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
                            let testsData = await Tests.find({})
                            socket.emit("adminLoggedIn", data, testsData);
                        }
                        else
                            socket.emit("adminLogInFailed", "password");
                    }
                }
        });
    })


    socket.on("tryLogin", async (email, pass)=>{
        let id;
        await Users.find({"email":email}, 
            async function(err, data) {
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
                            id = data[0]._id
                            let testsData = await Tests.find({})
                            let testio = await Users.find({"_id":id}, 'tests')
                            console.log(testio)
                            socket.emit("LoggedIn", data, testsData, testio[0].tests);
                        }
                        else
                            socket.emit("LogInFailed", "password");
                    }
                }
        });
    })


    socket.on("register", async (registerData)=>{
        await Tests.find({"testName":registerData.d[0]}, 
        async function(err, data){
            if(err)
            {
                console.log(err);
            }
            else
            {
                if(data[0].participants.includes(registerData.id))
                {
                    socket.emit("alreadyRegistered")
                }
                else
                {
                    data[0].participants.push(registerData.id)
                    await data[0].save(()=>{
                        Users.findOne({"_id": registerData.id}, 
                        async (err, data)=>{
                            //console.log(data)
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                data.tests.push(registerData.d[0])
                                await data.save(async ()=>{
                                    let testio = await Tests.find({"testName":registerData.d[0]})
                                    //console.log(data)
                                    socket.emit("registered", testio[0])
                                    console.log(testio[0])
                                })
                            }
                        })
                    //     Users.findOneAndUpdate({"_id": registerData.id}, 
                    //     {$addToSet: {'tests': {"testName": registerData.d[0], "description": registerData.d[1], "date": registerData.d[3], "startTime": registerData.d[4], "timeFrom": registerData.d[5]}}}, 
                    //     {new: true}, async (err, result) => {
                    //         let testio = await Users.find({"_id":registerData.id}, 'tests')
                    //         socket.emit("registered", testio[0].tests)
                    // })
                    })
                    
                }
            }
        })
        
    })

    
    socket.on("newTest", async (_testData)=>{
        await Tests.find({"testName":_testData[0]},
        async function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                if(data.length == 0)
                {
                    let testData = {}
                    testData.testName = _testData[0];
                    testData.date = _testData[1];
                    testData.startTime = _testData[2];
                    testData.timeFrom = _testData[3];
                    testData.timeTo = _testData[4];
                    let tests = new Tests(testData);
                    await tests.save(function(err, data)
                    {
                        socket.emit("testAdded", data._id)
                    });
                }
                else
                {
                    socket.emit("testAlreadyExists")
                }
            }
        })
    })

    socket.on("inputQuestion", async (inputQuestion)=>{
        let q = {}
        q.question = inputQuestion[0];
        q.option1 = inputQuestion[1];
        q.option2 = inputQuestion[2];
        q.option3 = inputQuestion[3];
        q.option4 = inputQuestion[4];
        let d = new Questions(q);
        await d.save(async function(err, data){
            await Questions.findOneAndUpdate(
                { "_id": data._id }, 
                { $addToSet: { "testId":  inputQuestion[5]} },
                {new: true}, function(err, data){
                    socket.emit("saved");
                }
            );
        });
    })


    socket.on("disconnect", ()=>{
        console.log("socket disconnected")
    })

});

