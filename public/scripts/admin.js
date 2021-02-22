const socket = io.connect();
var listofInputs = new Array(5)
listofInputs = ["", "", "", "", ""];


function tryLogin()
{
    socket.emit("tryAdminLogin", document.getElementById("input0").value, document.getElementById("input1").value);
}

function start()
{
    document.getElementById("modal-title").innerHTML = "Alert";
    document.getElementById("modal-body").innerHTML = "are you sure you want to start BETA test ?";
    document.getElementById("modal-cancel").innerHTML = "Sure"
    document.getElementById("modal-cancel").onclick = ()=>{
        $('#modal').modal('toggle'); 
        console.log("test started")
        socket.emit("startTest");
    }
    $('#modal').modal('toggle'); 
}

function createTest()
{
    document.getElementById("testForm").style.display = "block";
}

function validateAll()
{
    let allGood = [false, false, false, false, false];
    for(var i = 0; i < listofInputs.length; i++)
    {
        listofInputs[i] = document.getElementById("input1"+i).value
        if(listofInputs[i] == "")
        {
            document.getElementById("input1"+i).classList.remove("is-valid")
            document.getElementById("input1"+i).classList.add("is-invalid")
            document.getElementById("invalid1"+i).innerHTML = "required"
            allGood[i] = false
        }
        else
        {
            document.getElementById("input1"+i).classList.remove("is-invalid")
            document.getElementById("input1"+i).classList.add("is-valid")
            document.getElementById("invalid1"+i).innerHTML = ""
            allGood[i] = true
        }
    }
    for(let i in allGood)
    {
        if(!allGood[i])
        {
            return
        }
    }
    socket.emit("newTest", listofInputs)
    document.getElementById("questionField").style.display = "block";
}

function placeTestCards(data)
{
    //data 0= name, 1= discription 2= isAdmin 3= date 4= time 5 = login time
    let testList = document.getElementById("tests")
    let div1 = document.createElement('div')
    div1.setAttribute("id", data[0])
    div1.setAttribute("class", "card mb-3")
    div1.setAttribute("style", "max-width: 18rem; background-color: #89F9D8")
    let div2 = document.createElement('div')
    div2.setAttribute("class", "card-header")
    div2.appendChild(document.createTextNode("Test"))
    let div3 = document.createElement('div')
    div3.setAttribute("class", "card-body")
    let h5 = document.createElement('h5')
    h5.setAttribute("class", "card-title")
    h5.appendChild(document.createTextNode(data[0]))
    let p1 = document.createElement('p')
    p1.setAttribute("class", "card-text")
    p1.appendChild(document.createTextNode(data[1]))
    let p2 = document.createElement('p')
    p2.setAttribute("class", "card-text")
    p2.appendChild(document.createTextNode("test date : "+data[3]))
    let p3 = document.createElement('p')
    p3.setAttribute("class", "card-text")
    p3.appendChild(document.createTextNode("test starts at : "+data[4]))
    let p4 = document.createElement('p')
    p4.setAttribute("class", "card-text")
    p4.appendChild(document.createTextNode("login after : "+data[5] + " no late entry would be allowed"))
    if(data[2])
    {
        let test = document.createElement('button')
        test.setAttribute("id", data[0])
        test.setAttribute("type", "button")
        test.setAttribute("class", "btn btn-outline-info test-right")
        test.onclick = ()=>{
            console.log("do something when clicked on upcoming test by admin")
        }
        test.appendChild(document.createTextNode(data[0]))
    }
    div3.appendChild(h5)
    div3.appendChild(p1)
    div3.appendChild(p2)
    div3.appendChild(p3)
    div3.appendChild(p4)
    div1.appendChild(div2)
    div1.appendChild(div3)
    testList.appendChild(div1)
}

var testId

function nextQuestion()
{
    if(document.getElementById("input30").value == "")
    {   
        document.getElementById("modal-title").innerHTML = "Alert";
        document.getElementById("modal-body").innerHTML = "Please dont leave the Question tab empty";
        $('#modal').modal('toggle');
    }
    else
    {
        let inputQuestion = []
        for(let i = 0; i<5; i++)
        {
            //if(document.getElementById("input3"+i).value != "")
             
            inputQuestion.push(document.getElementById("input3"+i).value)
        }
        inputQuestion.push(testId);
        socket.emit("inputQuestion", inputQuestion)
    }
}

function finish()
{
    testId = ""
}

socket.on("adminLoggedIn", (data, data1)=>{
    document.getElementById("input0").classList.remove("is-invalid");
    document.getElementById("input0").classList.add("is-valid");
    document.getElementById("input1").classList.remove("is-invalid");
    document.getElementById("input1").classList.add("is-valid");
    document.getElementById("invalid0").innerHTML = ""
    document.getElementById("invalid1").innerHTML = ""
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = "Successfully Logged In";
    $('#modal').modal('toggle');
    document.getElementById("modal-cancel").onclick = function(){
        document.getElementById("admin_login_form").style.display = "none";
        document.getElementById("welcome-msg").innerHTML = 'Welcome Admin, '+data[0].userName;   
        document.getElementById("upcoming-tests").style.display = "block"; 
    }
    for(let i = 0; i<data1.length; i++)
    {
        let cardDate = [data1[i].testName, "Description", true, data1[i].date, data1[i].startTime, data1[i].timeFrom]
        placeTestCards(cardDate)
    }
});

socket.on("adminLogInFailed", (data)=>{
    if(data == "email")
    {
        document.getElementById("input0").classList.remove("is-valid");
        document.getElementById("input0").classList.add("is-invalid");
        document.getElementById("invalid0").innerHTML = "bad credentials"
    }
    else if(data == "password")
    {
        document.getElementById("input1").classList.remove("is-valid");
        document.getElementById("input1").classList.add("is-invalid");
        document.getElementById("invalid1").innerHTML = "bad credentials"
    }
})



socket.on("testAdded", (id)=>{
    testId = id
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">Successfully created a new test<br>now add questions to it.</p>';
    $('#modal').modal('toggle');
    let cardDate = [document.getElementById("input10").value, "Description", true, document.getElementById("input11").value, document.getElementById("input12").value, document.getElementById("input13").value]
    placeTestCards(cardDate)
})

socket.on("testAlreadyExists", ()=>{
    document.getElementById("input10").classList.remove("is-valid")
    document.getElementById("input10").classList.add("is-invalid")
    document.getElementById("invalid10").innerHTML = "already exists"
    document.getElementById("modal-title").innerHTML = "Failed";
    document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">test with that name already exists</p>';
    $('#modal').modal('toggle');
})

socket.on("saved", ()=>{
    document.getElementById("modal-title").innerHTML = "success";
    document.getElementById("modal-body").innerHTML = "question saved";
    $('#modal').modal('toggle');
    for(let i = 0; i<5; i++)
        {
            document.getElementById("input3"+i).value = ""
        }
})