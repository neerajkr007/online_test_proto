
const socket = io.connect();

var userData;

function tryLogin()
{
    socket.emit("tryLogin", document.getElementById("input0").value, document.getElementById("input1").value);
}

function testi(){
    
    
    // document.getElementById("modal-body").innerHTML += '<div class="d-inline-flex spinner-grow text-secondary ml-3" role="status"><span class="sr-only">Loading...</span></div>'
    // setTimeout(() => {
    //     document.getElementById("modal-body").innerHTML += '<div class="d-inline-flex spinner-grow text-secondary ml-2" role="status"><span class="sr-only">Loading...</span></div>'
    //     }, 50);
    // setTimeout(() => {
    //     document.getElementById("modal-body").innerHTML += '<div class="d-inline-flex spinner-grow text-secondary ml-2" role="status"><span class="sr-only">Loading...</span></div>'
    //     }, 50);
}


function register(test){
    //console.log(userData[0])
    socket.emit("register", userData[0]._id)
    console.log(userData[0]._id)
    document.getElementById("modal-title").innerHTML = "Waiting";
    document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: x-large;">Registering...</p>';
    $('#modal').modal('toggle');
}

socket.on("LoggedIn", (data)=>{
    userData = data;
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
        document.getElementById("welcome-msg").innerHTML = 'Welcome, '+data[0].userName;
        document.getElementById("upcoming-tests").style.display = "flex";
    }
    if(data[0].tests.includes("beta"))
    {
        var myTestList = document.getElementById("tests")
        let but = document.createElement('button')
        but.setAttribute("id", "betaTest");
        but.setAttribute("class", "btn btn-outline-info");
        but.setAttribute("type", "button");
        but.onclick = ()=>{
            var d = new Date()
            if(d.getMonth() === 1 && d.getDate() === 21 && d.getHours() === 17 && d.getMinutes() <= 27 && d.getMinutes() >= 25)
            {
                location.href = "/betaTest"
            }
            else
            {
                document.getElementById("modal-title").innerHTML = "try later";
                document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">cant take this test right now. try on 21/02/21 between 5:00 - 5:10 PM</p>';
                $('#modal').modal('toggle');
            }
        }
        but.appendChild(document.createTextNode("Beta Test"))
        myTestList.appendChild(but);
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

socket.on("alreadyRegistered", ()=>{
    $('#modal').modal('toggle');
    setTimeout(() => {
        document.getElementById("modal-title").innerHTML = "Failed";
        document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">You are already Registered for this test</p>';
    }, 2000);
})

socket.on("registered", ()=>{
    $('#modal').modal('toggle');
    setTimeout(() => {
        document.getElementById("modal-title").innerHTML = "Success";
        document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">Successfully registered for beta test<br></p>';
    }, 2000);
    var myTestList = document.getElementById("tests")
        let but = document.createElement('button')
        but.setAttribute("id", "betaTest");
        but.setAttribute("class", "btn btn-outline-info");
        but.setAttribute("type", "button");
        but.onclick = ()=>{
            var d = new Date();
            if(d.getMonth() === 1 && d.getDate() === 21 && d.getHours() === 17 && d.getMinutes() <= 27 && d.getMinutes() >= 25)
            {
                location.href = "/betaTest"
            }
            else
            {
                document.getElementById("modal-title").innerHTML = "try later";
                document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">cant take this test right now. try on 21/02/21 between 5:00 - 5:10 PM</p>';
                $('#modal').modal('toggle');
            }
        }
        but.appendChild(document.createTextNode("Beta Test"))
        myTestList.appendChild(but);
})