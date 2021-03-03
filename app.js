const express = require('express');
const app = express();
const serv = require('http').createServer(app);
//const connectDB = require('./mongodbconnection/connection')
const Users = require('./mongodbconnection/users')
const Admin = require('./mongodbconnection/admin')
const Tests = require('./mongodbconnection/tests')
const Questions = require('./mongodbconnection/questions')


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vashisthneeraj06',
    pass: 'P@86*&nbx'
  }
});



const mongoose = require('mongoose');
const { find } = require('./mongodbconnection/users');
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

app.get('/test', (req, res) =>
{
    res.sendFile(__dirname + '/test.html');
    
}); 


app.use(express.static(__dirname + '/public'));

serv.listen(process.env.PORT || 3000); 

function Token() {
    length = 32;
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


var SOCKET = {
    _socket: this,
    email: "",
    isAdmin: false
}

function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

    return array;
}

var SOCKET_LIST = []

var io = require('socket.io')(serv,{});

io.on('connection', function(socket){
    console.log("socket connected")

    SOCKET = socket
    SOCKET_LIST[socket.id] = SOCKET;


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
                        if(data[0].alreadyLoggedIn)
                        {
                            socket.emit("alreadyLoggedIn")
                            return
                        }
                        if(data[0].password == pass)
                        {
                            data[0].alreadyLoggedIn = true
                            await data[0].save()
                            SOCKET.email = data[0].email
                            SOCKET.isAdmin = true
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
                        if(data[0].alreadyLoggedIn)
                        {
                            socket.emit("alreadyLoggedIn")
                            return
                        }
                        if(data[0].password == pass)
                        {
                            data[0].alreadyLoggedIn = true
                            await data[0].save()
                            SOCKET.email = data[0].email
                            SOCKET.isAdmin = false
                            //console.log(SOCKET_LIST)
                            let testsList = [];
                            testsList = data[0].tests
                            let myTestsData = [];
                            for(let i = 0; i < testsList.length; i++)
                            {
                                myTestsData[i] = await Tests.findOne({"testName":testsList[i].testName})

                            }
                            let testData = await Tests.find({})
                            socket.emit("LoggedIn", data, testData, myTestsData);
                            socket.on("currentMACTest", async (d)=>{
                                let a = await Users.findOne({"email":data[0].email})
                                for(let i = 0; i < a.tests.length; i++)
                                {
                                    if(a.tests[i].testName == d.testName)
                                    {
                                        if(a.tests[i].validMacs == d.user)
                                        {
                                            socket.emit("currentMACTest",true)
                                        }
                                        else
                                        {
                                            socket.emit("currentMACTest",false)
                                        }
                                    }
                                }
                            })
                            
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
                for(let i = 0; i < data[0].participants.length; i++)
                {
                    if(data[0].participants[i].pid == registerData.id){
                        socket.emit("alreadyRegistered")
                        return
                    }
                }
                let obj = {}
                obj.pid = registerData.id
                obj.attempted = false
                data[0].participants.push(obj)
                await data[0].save()
                let user = await Users.findOne({"_id": registerData.id})
                user.tests.push({"testName": registerData.d[0]})
                let token = Token();
                user.tests[(user.tests.length - 1)].validMacs.push(token)
                await user.save(async ()=>{
                     let testio = await Tests.find({"testName":registerData.d[0]})
                     //console.log(data)
                    socket.emit("registered", testio[0], token)
                })
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
                    let testData = {noofquestions:[]}
                    testData.testName = _testData[0];
                    testData.date = _testData[1];
                    testData.startTime = _testData[2];
                    testData.timeFrom = _testData[3];
                    testData.description = _testData[4];
                    testData.noofquestions.push(_testData[5])
                    testData.noofquestions.push(_testData[6])
                    testData.noofquestions.push(_testData[7])
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
        q.questionType = inputQuestion[5];
        q.ans = inputQuestion[6]
        let d = new Questions(q);
        await d.save()
        socket.emit("saved");
    })

    socket.on("showQuestions", async (index, type)=>{
        if(index == 3){
            let questions = await Questions.find({})
            socket.emit("showQuestions", questions, type)
        }
        else{
            let questions = await Questions.find({"questionType":index})
            socket.emit("showQuestions", questions, type)
        }
    })

    socket.on("updateQuestion", async (Qid)=>{
        let question = await Questions.findOne({"_id":Qid})
        socket.emit("updateQuestion", question)
    })

    socket.on("updateValues", async (val)=>{
        let question = await Questions.findOne({"_id":val.qid})
        if(val.n[0] != "")
        {
            question.question = val.n[0];
        }
        if(val.n[1] != "")
        {
            question.option1 = val.n[1];
        }
        if(val.n[2] != "")
        {
            question.option2 = val.n[2];
        }
        if(val.n[3] != "")
        {
            question.option3 = val.n[3];
        }
        if(val.n[4] != "")
        {
            question.option4 = val.n[4];
        }
        if(val.n[6] != "")
        {
            question.questionType = val.n[6];
        }
        if(val.n[5] != "")
        {
            question.ans = val.n[5];
        }
        await question.save(()=>{
            socket.emit("updated")
        });
    })

    socket.on("deleteQuestion", async (qid)=>{
        await Questions.findOneAndDelete({"_id":qid});
        socket.emit("deleted");
    })

    socket.on("noOfParticipants", async (tName)=>{
        let test = await Tests.findOne({"testName": tName}) 
        console.log(test.participants.length)
        socket.emit("noOfParticipants", test.participants.length)
    })

    socket.on("numberOfQuestion", async (id)=>{
        let listofQuestions = await Questions.find({"questionType": id})
        socket.emit("numberOfQuestion", id, listofQuestions.length)
    })

    socket.on("logout", async (id, t)=>{
        if(t == "admin")
        {
            let admin = await Admin.findOne({"email":id})
            if(admin != null && admin.alreadyLoggedIn)
            {
                admin.alreadyLoggedIn = false
                await admin.save();
            }
        }
        else
        {
            let user = await Users.findOne({"email":id})
            if(user != null && user.alreadyLoggedIn)
            {
                user.alreadyLoggedIn = false
                await user.save();
            }
        }
    })

    socket.on("unregister", async(d)=>{
        let test = await Tests.findOne({"testName":d.testName})
        //console.log(test)
        index = test.participants.indexOf(d.uid)
        test.participants.splice(index, 1)
        let user = await Users.findOne({"_id":d.uid})
        for(let i = 0; i < user.tests.length; i++)
        {
            if(user.tests[i].testName == d.testName)
            {
                user.tests.splice(i, 1)
                await test.save();
                await user.save();
                socket.emit("unregister", d.testName)
                return
            }
        }
    })

    socket.on("checkNoOfQuestions", async (d)=>{
        let n = await Questions.find({"questionType":d.i})
        if(n.length < d.j)
        {
            //console.log("n<d " + n.length +" "+d.j)
            socket.emit("allGood", false, d.i);
        }
        else
        {
            socket.emit("allGood", true, d.i);
        }
    })

    socket.on("newUrl", d=>{
        //console.log(d)
        app.get(d, (req, res) =>
        {
            res.sendFile(__dirname + '/test.html');
        }); 
        socket.emit("newUrl", d)
    })

    socket.on("getQuestions", async (testName)=>{
        let test = await Tests.findOne({"testName":testName})
        let rns = []
        let noofquestions = []
        let n = 0
        for(let j = 0; j < 3; j++)
        {
            for(let i = 0; i < test.noofquestions[j]; i++)
            {
                rns.push(n)
                noofquestions.push = ""
                n++;
            }
        }
        n = 0
        let randomArray = shuffle(rns)
        for(let i = 0; i < 3; i++)
        {
            let question = await Questions.find({"questionType":String(i)})
            for(let j = 0; j < test.noofquestions[i] ; j++)
            {
                noofquestions[randomArray[n]] = question[j]
                noofquestions[randomArray[n]].ans = "lol"
                n++
            }
        }
        socket.emit("getQuestions", noofquestions)
    })

    socket.on("submission", async (d)=>{
        //console.log(d)
        let user = await Users.findOne({"_id":d.uid})
        for(let i = 0; i < user.tests.length; i++)
        {
            if(user.tests[i].testName == d.testName)
            {
                for(let j = 0; j < d.marked.length; j++)
                {
                    if(d.marked[j].marked)
                    {
                        user.tests[i].submission.push(d.marked[j])
                    }
                }
                await user.save()
                socket.emit("submitted")
                break
            }
        }
    })

    socket.on("attempted", async (d)=>{
        let test = await Tests.findOne({"testName": d.tname})
        for(let i = 0; i < test.participants.length; i++)
        {
            if(test.participants[i].pid == d.uid)
            {
                test.participants[i].attempted = true
                await test.save()
                break
            }
        }
    })

    socket.on("forgotPassword", async (email)=>{
        let user = await Users.findOne({"email":email})
        if(user == null)
        {
            socket.emit("forgotPasswordFailed")
            return
        }
        let pass = user.password
        let mailOptions = {
            from: 'vashisthnk621@gmail.com',
            to: email,
            subject: 'Your password for onlinetest-prototype account',
            text: 'your password was - '+pass
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) 
            {
              console.log(error);
            } 
            else 
            {
                socket.emit("emailSent")
                console.log('Email sent: ' + info.response);
            }
          });
    })

    socket.on("disconnect", async ()=>{
        try{
            if(SOCKET_LIST[socket.id].isAdmin)
            {
                let admin = await Admin.findOne({"email":SOCKET_LIST[socket.id].email})
                if(admin.alreadyLoggedIn)
                {
                    admin.alreadyLoggedIn = false
                    await admin.save();
                }
            }
            else
            {
                let user = await Users.findOne({"email":SOCKET_LIST[socket.id].email})
                if(user.alreadyLoggedIn)
                {
                    user.alreadyLoggedIn = false
                    await user.save();
                }
            }
        }
        catch(e)
        {

        }
        console.log("socket disconnected")
    })

});

