var listofInputs = {firstName:"", lastName:"", userName:"", email:"", password:"", password2:""}
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
    let j = 0;
    let allGood = false;
    for(var i in listofInputs)
    {
        listofInputs[i] = document.getElementById("input"+j).value
        if(listofInputs[i] == "")
        {
            document.getElementById("input"+j).classList.remove("is-valid")
            document.getElementById("input"+j).classList.add("is-invalid")
            document.getElementById("invalid"+j).innerHTML = "required"
            allGood = false
        }
        else
        {
            document.getElementById("input"+j).classList.remove("is-invalid")
            document.getElementById("input"+j).classList.add("is-valid")
            document.getElementById("invalid"+j).innerHTML = ""
            allGood = true
        }
        if(j == 3)
        {
            validateEmail();
        }
        if(j == 4 || j == 5)
        {
            validatePassword();
        }
        j++
        if(j == 6)
            j = 0
        if(allGood) 
        {
            //do stuff in db
        }
    }
}