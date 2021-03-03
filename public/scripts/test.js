socket = io.connect()

var currentId = ""
var totalQuestions = 0
var marked = []
var testName = ""
var userId = ""

function loadTest()
{
    if(!document.getElementById("iAgree").checked)
    {
        document.getElementById("modal-title").innerHTML = "Alert";
        document.getElementById("modal-body").innerHTML = "Please agree to instructions before Starting test";
        $('#modal').modal('toggle');
        return
    }
    document.getElementById("instructions").style.display = "none"
    document.getElementById("testPage").style.display = "flex"
    distributeQuestions()
}

function distributeQuestions()
{
    testName = getCookie("testName");
    socket.emit("getQuestions", testName)
    userId = getCookie("userId");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function placeQuestion(data)
{
    document.getElementById("question").innerHTML = ""
    let mainUl = document.getElementById("question");
    let mainLi = document.createElement('li')
    mainLi.setAttribute("id", data[0])
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
            
            optionLi.onclick = ()=>{
                for(let i = 0; i < optionsUl.children.length; i++)
                {
                    optionsUl.children[i].style.backgroundColor = "gray";
                }
                optionLi.style.backgroundColor = "black"
                let btnId = document.getElementsByClassName('btn-warning')[0].id
                document.getElementsByClassName('btn-warning')[0].classList.remove("btn-warning")
                document.getElementById(btnId).classList.remove("btn-outline-success")
                document.getElementById(btnId).classList.add("btn-success")
                for(let i = 0; i < totalQuestions; i++)
                {
                    if(marked[i].questionId == mainLi.id)
                    {   
                        //if(!marked[i].marked)
                        {
                            marked[i].marked = true
                            for(let j = 0; j < 4; j++)
                            {
                                if(optionsUl.children[j] == optionLi)
                                {
                                    marked[i].option = j;
                                    break
                                }
                            }
                            break;
                        }
                    }
                }
            }

            option.appendChild(document.createTextNode(data[(i+2)]))
            optionLi.appendChild(option)
            optionsUl.appendChild(optionLi)
        }
    }
    for(let i = 0; i < totalQuestions; i++)
            {
                if(marked[i].questionId == mainLi.id)
                {   
                    if(marked[i].marked)
                    {
                        for(let j = 0; j < 4; j++)
                        {
                            if(j == marked[i].option)
                            {
                                optionsUl.children[j].style.backgroundColor = "black"
                                break
                            }
                        }
                        break;
                    }
                }
            }

    mainLi.appendChild(question)
    mainLi.appendChild(optionsUl)
    mainUl.appendChild(mainLi)
}

function submit()
{
    document.getElementById("modal-title").innerHTML = "Alert";
    document.getElementById("modal-body").innerHTML = "are you syre you want to submit the test ?";
    document.getElementById("modal-sec").style.display = "block"
    document.getElementById("modal-sec").onclick = ()=>{
        submitTest();
    }
    $('#modal').modal('toggle');
}

function submitTest()
{
    socket.emit("submission", {marked:marked, uid:userId, testName:testName})
}

socket.on("getQuestions", questions=>{
    totalQuestions = questions.length
    let once = true
    for(let i = 0; i < questions.length; i++)
    {
        let obj = {}
        obj.marked = false
        obj.option = -1
        obj.questionId = questions[i]._id
        marked.push(obj);
    }

    //console.log(marked)

    document.getElementById("flagButton").onclick = ()=>{
        if(document.getElementsByClassName("btn-warning")[0] != undefined) 
        {
            console.log(document.getElementsByClassName("btn-warning")[0])
            document.getElementsByClassName("btn-warning")[0].id
            document.getElementsByClassName("btn-warning")[0].setAttribute("class", "btn btn-danger")
            //document.getElementsByClassName("btn-warning")[0].setAttribute("class", "btn btn-warning")
            //once2 = true
            document.getElementById("flagButton").innerHTML = "unflag"
        }
        else
        {
            document.getElementById(currentId).setAttribute("class", "btn btn-warning")
        }
        
    }
    
    
    placeQuestion([questions[0]._id, questions[0].question, questions[0].option1, questions[0].option2, questions[0].option3, questions[0].option4])
    let questionList = document.getElementById("questionsList")
    
    
    for(let i = 0; i < Math.ceil(questions.length/5); i++)
    {
        let row = document.createElement('div')
        row.setAttribute("class", "row pl-3 pr-3 pt-2 d-flex justify-content-around")
        row.setAttribute("id", "questionListRow"+i)
        for(let j = 0; j < 5; j++)
        {
            if(((5*i) + j)<questions.length)
            {   
                let button = document.createElement('button')
                button.setAttribute("id", "question"+((5*i) + j))
                button.setAttribute("class", "btn btn-outline-success")  // mr-auto
                button.appendChild(document.createTextNode(((5*i) + j + 1)))
                button.onclick = ()=>{
                    currentId = "question"+((5*i) + j)
                    placeQuestion([questions[((5*i) + j)]._id, questions[((5*i) + j)].question, questions[((5*i) + j)].option1, questions[((5*i) + j)].option2, questions[((5*i) + j)].option3, questions[((5*i) + j)].option4])
                    if(!document.getElementById("question"+((5*i) + j)).classList.contains("btn-danger") && !document.getElementById("question"+((5*i) + j)).classList.contains("btn-success"))
                    {
                        document.getElementById("flagButton").innerHTML = "flag"
                        document.getElementById("question"+((5*i) + j)).classList.add("btn-warning")
                        document.getElementById("question"+((5*i) + j)).classList.remove("btn-outline-success")
                    }
                    else if(document.getElementById("question"+((5*i) + j)).classList.contains("btn-danger"))
                    {
                        document.getElementById("flagButton").innerHTML = "unflag"
                    }
                    for(let k = 0; k < questions.length; k++)
                    {
                        if(k != ((5*i) + j) && !document.getElementById("question"+k).classList.contains("btn-danger") && !document.getElementById("question"+k).classList.contains("btn-success"))
                        {
                            document.getElementById("question"+k).classList.add("btn-outline-success")
                            document.getElementById("question"+k).classList.remove("btn-warning")
                        }
                    }
                }
                row.appendChild(button)
            }
            else
            {
                continue
            }
        }
        questionList.appendChild(row)
        if(once)
        {
            document.getElementById("question0").setAttribute("class", "btn btn-warning")
            once = false
        }
    }
})

socket.on("submitted", ()=>{
    setTimeout(() => {
        document.getElementById("modal-title").innerHTML = "Success";
        document.getElementById("modal-body").innerHTML = 
        '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">'+
            '<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>'+
            '<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>'+
        '</svg>'+
        '<br>'+
        '<p class="text-center display-4">Successfully submitted the test</p>';

        document.getElementById("modal-sec").style.display = "none"
        document.getElementById("modal-sec").onclick = null
        $('#modal').modal('toggle');
    }, 500);
    
})


