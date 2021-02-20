
const socket = io.connect();

function tryLogin()
{
    socket.emit("tryLogin", document.getElementById("input0").value, document.getElementById("input1").value);
}

socket.on("LoggedIn", (data)=>{
    console.log(data)
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
        document.getElementById("login_form").style.display = "none";
        document.getElementsByClassName("container")[0].innerHTML += '<div class="text-center mt-10"><h3 class="mt-10 display-4">Welcome, '+data[0].userName+'</h3></div>'
    }
});

socket.on("LogInFailed", (data)=>{
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