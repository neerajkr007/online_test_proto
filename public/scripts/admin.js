const socket = io.connect();
var listofInputs = new Array(5)
listofInputs = ["", "", "", "", ""];


function tryLogin()
{
    socket.emit("tryAdminLogin", document.getElementById("input0").value, document.getElementById("input1").value);
}

window.onunload = ()=>{socket.emit("logout")}

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
}

function placeTestCards(data)
{
    //data 0= name, 1= discription 2= isAdmin 3= date 4= time 5 = login time
    let testList = document.getElementById("tests")
    let div1 = document.createElement('div')
    div1.setAttribute("id", data[0])
    div1.setAttribute("class", "card mb-3")
    div1.setAttribute("style", "max-width: 18rem; background-color: #AFF9CA")
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
    div3.appendChild(h5)
    div3.appendChild(p1)
    div3.appendChild(p2)
    div3.appendChild(p3)
    div3.appendChild(p4)
    div1.appendChild(div2)
    div1.appendChild(div3)
    if(data[2])
    {
        let test = document.createElement('button')
        let newLink=data[0].replace(/\s+/g, '')
        test.setAttribute("id", newLink+"details")
        test.setAttribute("type", "button")
        test.setAttribute("class", "btn btn-outline-info")
        test.onclick = ()=>{
            //document.getElementById(newLink+"Participants").style.display = "block";
            socket.emit("noOfParticipants", data[0])
        }
        test.appendChild(document.createTextNode('view details'))
        div1.appendChild(test);
        let participants = document.createElement('div')
        participants.setAttribute("id", newLink+"Participants")
        participants.setAttribute("style", "display:none;")
        participants.appendChild(document.createTextNode('no. of Participants :'))
        div1.appendChild(participants)
        socket.on("noOfParticipants", n=>{
            let participants2 = document.createElement('div')
            participants2.setAttribute("id", newLink+"num")
            participants2.setAttribute("style", "display:none;")
            participants2.setAttribute("class", "text-center")
            participants2.appendChild(document.createTextNode(n))
            div1.appendChild(participants2)
            $("#"+newLink+"Participants").slideDown("slow");
            $("#"+newLink+"num").slideDown("slow");
        })
        
        
    }
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
        for(var i = 5; i < 8; i++)
        {
            if(document.getElementById("input3"+i).checked)
            {
                inputQuestion.push((i-5))
                inputQuestion.push(document.getElementById("input38").value)
                socket.emit("inputQuestion", inputQuestion)
                return
            }
        }
        document.getElementById("modal-title").innerHTML = "Alert";
        document.getElementById("modal-body").innerHTML = "Please choose a difficulty";
        $('#modal').modal('toggle');
    }
}

function finish()
{
    testId = ""
}

function placeQuestion(data)
{
    // 0=id, 1=q, 2-5=o 6= 
    let mainUl = document.getElementById("questions"+data[0]);
    let mainLi = document.createElement('li')
    mainLi.setAttribute("class", "list-group-item")
    mainLi.setAttribute("style", "max-width: 80vw;")
    let question = document.createElement('p')
    question.appendChild(document.createTextNode(data[1]))
    let optionsUl = document.createElement('ul')
    optionsUl.setAttribute("class", "list-group")
    for(let i = 0; i<4;i++)
    {
        if(data[(i+2)] != "")
        {
            let optionLi = document.createElement("li")
            optionLi.setAttribute("class", "list-group-item option_Style hov text-white")
            optionLi.setAttribute("style", "max-width: 200px;")
            let option = document.createElement('p')
            option.appendChild(document.createTextNode(data[(i+2)]))
            optionLi.appendChild(option)
            optionsUl.appendChild(optionLi)
        }
    }

    mainLi.appendChild(question)
    mainLi.appendChild(optionsUl)
    let optionLi2 = document.createElement("li")
    optionLi2.setAttribute("class", "list-group-item option_Style hov text-white mb-3")
    optionLi2.setAttribute("style", "max-width: 200px;")
    let option2 = document.createElement('p')
    option2.appendChild(document.createTextNode(data[(Number(data[7]) + 1)]))
    let label = document.createElement('p')
    label.appendChild(document.createTextNode('correct Answer :'))
    label.setAttribute("class", "mt-5 mb-2")
    optionLi2.appendChild(option2)
    optionsUl.appendChild(label)
    optionsUl.appendChild(optionLi2)
    if(data[0] != 0)
    {
        let button = document.createElement('button')
        button.setAttribute("class", "btn btn-outline-success mt-2 offset-md-10")
        button.onclick = ()=>{
            document.getElementById("updateSearch").style.display = "none"
            socket.emit("updateQuestion", data[6]);
        }
        button.appendChild(document.createTextNode("Update"))
        let button2 = document.createElement('button')
        button2.setAttribute("class", "btn btn-outline-danger mt-2 ml-2")
        button2.onclick = ()=>{
            document.getElementById("updateSearch").style.display = "none"
            socket.emit("deleteQuestion", data[6]);
        }
        button2.appendChild(document.createTextNode("Delete"))
        mainLi.appendChild(button);
        mainLi.appendChild(button2);
    }
    mainUl.appendChild(mainLi)
}

function slide(id){
    if(document.getElementById(id).style.display == "none"){
        //$("#viewQuestionsOptions").slideDown("slow");
        document.getElementById(id).style.display = "block"
    }
    else{
        //$("#viewQuestionsOptions").slideUp("slow");
        document.getElementById(id).style.display = "none"
    }
}

function slide2(id){
    if(document.getElementById(id).style.display == "block"){
        document.getElementById(id).style.display = "none"
    }
}

function showQuestions(index)
{
    //if(document.getElementById("questions").style.display == "none")
    {
        document.getElementById("questions").style.display = "block"
        socket.emit("showQuestions", index, 0);
    }
    // else
    // {
    //     document.getElementById("questions").style.display = "none"
    // }
    
}

function updateList()
{
    document.getElementById("updateSearch").style.display = "block"
    socket.emit("showQuestions", 3, 1);
}

let once = [0, 1, 2];

function numberOfQuestion(id)
{
    if(once.includes(id))
    {
        let index = once.indexOf(id);
        once.splice(index, 1)
        socket.emit("numberOfQuestion", id)
    }
}

function setNumberOfQuestions(id, n)
{
    // set questions from here
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
        document.getElementById("questionBank").style.display = "block";
    }
    for(let i = 0; i<data1.length; i++)
    {
        let cardDate = [data1[i].testName, data1[i].description, true, data1[i].date, data1[i].startTime, data1[i].timeFrom]
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
    let cardDate = [document.getElementById("input10").value, document.getElementById("input14").value, true, document.getElementById("input11").value, document.getElementById("input12").value, document.getElementById("input13").value]
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

socket.on("showQuestions", (questions, type)=>{
    document.getElementById("questions"+type).innerHTML = ""
    for(let i in questions)
    {
        let questionData = [type, questions[i].question, questions[i].option1, questions[i].option2, questions[i].option3, questions[i].option4, questions[i]._id, questions[i].ans]
        //console.log(questionData[(Number(questionData[7]) + 2)])
        placeQuestion(questionData)
    }
})

socket.on("updateQuestion", (question)=>{
    let ogValues = [];
    let newValues = [];
    document.getElementById("questionUpdateField").style.display = "block"
    ogValues[0] = document.getElementById("input40").value = question.question;
    ogValues[1] = document.getElementById("input41").value = question.option1;
    ogValues[2] = document.getElementById("input42").value = question.option2;
    ogValues[3] = document.getElementById("input43").value = question.option3;
    ogValues[4] = document.getElementById("input44").value = question.option4;
    ogValues[6] = question.questionType;
    ogValues[5] = document.getElementById("input45").value = question.ans;
    if(question.questionType == "0")
    {
        document.getElementById("input46").checked = true;
    }
    else if(question.questionType == "1")
    {
        document.getElementById("input47").checked = true;
    }
    else if(question.questionType == "2")
    {
        document.getElementById("input48").checked = true;
    }
    document.getElementById("updateButton").onclick = ()=>{
        for(let i = 0; i < 6; i++)
        {
            if(document.getElementById("input4"+i).value != ogValues[i])
            {
                newValues[i] = document.getElementById("input4"+i).value;
            }
            else
            {
                newValues[i] = ""
            }
        }
        for(var i = 6; i < 9; i++)
        {
            if(document.getElementById("input4"+i).checked && ogValues[6] != (i-6))
            {
                newValues[6] = String(i-6)
                socket.emit("updateValues", {n:newValues, qid:question._id})
                return
            }
            else
            {
                newValues[6] = ""
            }
        }
        socket.emit("updateValues", {n:newValues, qid:question._id})
    }
})

socket.on("updated", ()=>{
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = "Successfully Updated the question";
    $('#modal').modal('toggle');
    document.getElementById("questionUpdateField").style.display = "none"
    updateList();
})

socket.on("deleted", ()=>{
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = "Successfully deleted the question";
    $('#modal').modal('toggle');
    updateList();
})

socket.on("numberOfQuestion", (id, n)=>{
    let dropdown = document.getElementById("dropdown"+id)
    for(let i = 0; i < n; i++)
    {
        let p = document.createElement("p")
        //p.setAttribute("id", "dropdownId"+id+i)
        p.setAttribute("class", "dropdown-item dropdownItems")
        p.setAttribute("style", "padding:0; margin:0; padding-left: 20px")
        p.onclick = ()=>{
            setNumberOfQuestions(id, i);
        }
        p.appendChild(document.createTextNode((i+1)))
        dropdown.appendChild(p)
    }
})

socket.on("alreadyLoggedIn", ()=>{
    document.getElementById("modal-title").innerHTML = "Failed";
    document.getElementById("modal-body").innerHTML = "already logged in on other device/browser tab";
    $('#modal').modal('toggle');
})