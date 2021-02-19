var firstName = ""
var lastName = ""
var userName = ""
var email = ""
var password = ""
var password2 = ""
var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function validateEmail()
{
        console.log("focus out")
        email = document.getElementById("inputEmail").value
        if(email.match(mailformat))
        {
            console.log("valid")
            document.getElementById("inputEmail").classList.remove("is-invalid");
            document.getElementById("inputEmail").classList.add("is-valid");
        }
        else
        {
            console.log("invalid")
            document.getElementById("inputEmail").classList.remove("is-valid");
            document.getElementById("inputEmail").classList.add("is-invalid");
            document.getElementById("invalidMail").innerHTML = "Please provide a valid email"
        }
}

function validatePassword()
{
    password = document.getElementById("inputPassword").value
    password2 = document.getElementById("inputPassword2").value
    if(password !== password2)
    {
        document.getElementById("inputPassword").classList.remove("is-valid");
        document.getElementById("inputPassword").classList.add("is-invalid");
        document.getElementById("inputPassword2").classList.remove("is-valid");
        document.getElementById("inputPassword2").classList.add("is-invalid");
        document.getElementById("invalidpass2").innerHTML = "passwords do not match"
    }
    else
    {
        document.getElementById("inputPassword").classList.remove("is-invalid");
        document.getElementById("inputPassword").classList.add("is-valid");
        document.getElementById("inputPassword2").classList.remove("is-invalid");
        document.getElementById("inputPassword2").classList.add("is-valid");
    }
}

function validateAll()
{
    firstName = document.getElementById("inputname").value
    lastName = document.getElementById("inputname2").value
    userName = document.getElementById("inputusername").value
    email = document.getElementById("inputEmail").value
    password = document.getElementById("inputPassword").value
    password2 = document.getElementById("inputPassword2").value
    var listofInputs = {f:firstName, l:lastName, u:userName, e:email, p:password, p2:password2}
    
    for(var i in listofInputs)
    {
        console.log(i + " " + listofInputs[i])
    }
}