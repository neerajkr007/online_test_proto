const socket = io.connect();

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

socket.on("adminLoggedIn", (data)=>{
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