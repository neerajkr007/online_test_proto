

const socket = io.connect();
//var listofInputs = {firstName:"", lastName:"", userName:"", email:"", password:"", password2:""}
var listofInputs = new Array(6)
listofInputs = ["", "", "", "", "", ""];
var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function validateEmail()
{
        
        listofInputs[3] = document.getElementById("input3").value
        if(listofInputs[3].match(mailformat))
        {
            document.getElementById("input3").classList.remove("is-invalid");
            document.getElementById("input3").classList.add("is-valid");
        }
        else
        {
            document.getElementById("input3").classList.remove("is-valid");
            document.getElementById("input3").classList.add("is-invalid");
            document.getElementById("invalid3").innerHTML = "Please provide a valid email"
        }
}

function validatePassword()
{
    listofInputs[4] = document.getElementById("input4").value
    listofInputs[5] = document.getElementById("input5").value
    if(listofInputs[4] !== listofInputs[5])
    {
        document.getElementById("input4").classList.remove("is-valid");
        document.getElementById("input4").classList.add("is-invalid");
        document.getElementById("input5").classList.remove("is-valid");
        document.getElementById("input5").classList.add("is-invalid");
        document.getElementById("invalid5").innerHTML = "passwords do not match"
    }
    else if(listofInputs[4] != "")
    {
        document.getElementById("input4").classList.remove("is-invalid");
        document.getElementById("input4").classList.add("is-valid");
        document.getElementById("input5").classList.remove("is-invalid");
        document.getElementById("input5").classList.add("is-valid");
    }
}

function validateAll()
{
    let allGood = [false, false, false, false, false, false];
    for(var i = 0; i < listofInputs.length; i++)
    {
        listofInputs[i] = document.getElementById("input"+i).value
        if(listofInputs[i] == "")
        {
            document.getElementById("input"+i).classList.remove("is-valid")
            document.getElementById("input"+i).classList.add("is-invalid")
            document.getElementById("invalid"+i).innerHTML = "required"
            allGood[i] = false
        }
        else
        {
            document.getElementById("input"+i).classList.remove("is-invalid")
            document.getElementById("input"+i).classList.add("is-valid")
            document.getElementById("invalid"+i).innerHTML = ""
            allGood[i] = true
        }
        if(i == 3)
        {
            validateEmail();
        }
        if(i == 4 || i == 5)
        {
            validatePassword();
        }
    }
    for(let i in allGood)
    {
        if(!allGood[i])
        {
            return
        }
    }
    socket.emit("newSignUp", listofInputs);
    console.log("sent data to db");
}