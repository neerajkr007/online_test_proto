
const socket = io.connect();



window.onunload = ()=>{socket.emit("logout", document.getElementById("input0").value, "")}

var userData;

function tryLogin()
{
    socket.emit("tryLogin", document.getElementById("input0").value, document.getElementById("input1").value);
}

function testi(){
}


function register(data){
    //console.log(userData[0])
    socket.emit("register", {id:userData[0]._id, d:data})
    // document.getElementById("modal-title").innerHTML = "Waiting";
    // document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: x-large;">Registering...</p>';
    // $('#modal').modal('toggle');
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

function placeTestCards(data)
{
    //data 0= name, 1= discription 2= isAdmin 3= date 4= time 5 = login time 6=tests 7= ismytests 8= attempted
    let testList = document.getElementById(data[6])
    let div1 = document.createElement('div')
    if(data[7])
        div1.setAttribute("id", data[0]+"1")
    else
        div1.setAttribute("id", data[0]+"0")
    div1.setAttribute("class", "card mb-3")
    if(data[7])
        div1.setAttribute("style", "max-width: 18rem; background-color: #AFF9CA")
    else
        div1.setAttribute("style", "max-width: 18rem; background-color: #FAFAA3")
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
    if(!data[2])
    {
        let test = document.createElement('button')
        test.setAttribute("id", "startTest")
        test.setAttribute("type", "button")
        test.setAttribute("class", "btn btn-outline-success col-md-6")
        if(data[7] && !data[8])
        {
            test.onclick = ()=>{
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                var d = new Date(),
                h = (d.getHours()<10?'0':'') + d.getHours(),
                m = (d.getMinutes()<10?'0':'') + d.getMinutes();
                var time = h + ':' + m;
                

                today = dd + '/' + mm + '/' + yyyy;
                let date = data[3];
                var token = getCookie("token"+userData[0]._id);
                socket.emit("currentMACTest", {testName:data[0], user:token})
                socket.on("currentMACTest", result=>{
                    if(result)
                    {
                        //if(date == today && data[5] <= time && data[4] >= time)
                        if(true)
                        {
                            var d = new Date();
                            d.setTime(d.getTime() + (12 * 60 * 60 * 1000));
                            var expires = "expires="+d.toUTCString();
                            document.cookie = "testName="+data[0]+ ";" + expires
                            document.cookie = "userId="+userData[0]._id+ ";" + expires
                            console.log(userData[0]._id)
                            let newUrl = "/"+data[0]
                            newUrl = newUrl.replaceAll(/ /g,"%20")
                            socket.emit("newUrl", newUrl)
                            socket.on("newUrl", (url)=>{
                                location.href = url
                            })
                        }
                        else if(data[4] < time)
                        {
                            document.getElementById("modal-title").innerHTML = "failed";
                            document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">you were late, cant attempt this test. try other tests if you like to </p>';
                            $('#modal').modal('toggle');
                        }
                        else
                        {
                            document.getElementById("modal-title").innerHTML = "try later";
                            document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">cant take this test right now. try on '+data[3]+' after '+data[5]+'</p>';
                            $('#modal').modal('toggle');
                        }
                    }
                    else
                    {
                        document.getElementById("modal-title").innerHTML = "Alert";
                        document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">cant take this test on this device either switch to registered device or create a ticket to change device permission'+'</p>';
                        $('#modal').modal('toggle');
                    }
                })
                
            }
            test.appendChild(document.createTextNode("Take Test"))
            div3.appendChild(test);
        }
        else if(!data[7])
        {
            test.onclick = ()=>{
                register(data);
            }
            test.appendChild(document.createTextNode("register"))
            div3.appendChild(test);
        }
               
        if(data[7] && !data[8])
        {
            let test2 = document.createElement('button')
            test2.setAttribute("id", "startTest2")
            test2.setAttribute("type", "button")
            test2.setAttribute("class", "btn btn-outline-danger col-md-5 offset-md-1")
            test2.appendChild(document.createTextNode("unregister"))
            test2.onclick = ()=>{
                socket.emit("unregister", {uid:userData[0]._id, testName:data[0]} )
            }
            div3.appendChild(test2);
        }
    }
    div1.appendChild(div2)
    div1.appendChild(div3)
    if(data[7] && data[8])
        {
            let but = document.createElement('button')
            but.setAttribute("class", "btn btn-danger col-md-12")
            but.disabled = true
            but.appendChild(document.createTextNode('Already Attempted !'))
            div3.appendChild(but);
        }
    testList.appendChild(div1)
}

function forgotpassword()
{
    socket.emit("forgotPassword", document.getElementById("input0").value)
}

socket.on("LoggedIn", (data, testsData, myTestsData)=>{
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
    for(let i = 0; i<testsData.length; i++)
    {
        let upcomingCardData = [testsData[i].testName, testsData[i].description, false, testsData[i].date, testsData[i].startTime, testsData[i].timeFrom, "tests", false]
        placeTestCards(upcomingCardData);
    }
    let attempted = false
    for(let i = 0; i<myTestsData.length; i++)
    {
        for(let j = 0; j < myTestsData[i].participants.length; j++){
            if(myTestsData[i].participants[j].pid == userData[0]._id)
            {
                attempted = myTestsData[i].participants[j].attempted
                break
            }
        }
        let myCardData = [myTestsData[i].testName, myTestsData[i].description, false, myTestsData[i].date, myTestsData[i].startTime, myTestsData[i].timeFrom, "myTests", true, attempted]
        placeTestCards(myCardData);       
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
    document.getElementById("modal-title").innerHTML = "Failed";
    document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">You are already Registered for this test</p>';
    $('#modal').modal('toggle');
})

socket.on("registered", (testsData, token)=>{
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = '<p class="d-inline-flex display-4" style="font-size: large;">Successfully registered for beta test<br></p>';
    $('#modal').modal('toggle');
    let myCardData = [testsData.testName, testsData.description, false, testsData.date, testsData.startTime, testsData.timeFrom, "myTests", true]
    placeTestCards(myCardData);
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "token"+userData[0]._id+"="+token+ ";" + expires
    //console.log("token"+userData[0]._id+"="+token)
})

var once2 = true

socket.on("alreadyLoggedIn", ()=>{
    document.getElementById("modal-title").innerHTML = "Failed";
    document.getElementById("modal-body").innerHTML = "already logged in on other device/browser tab";
    if(once2)
    {
        let footer = document.getElementsByClassName("modal-footer")[0]
        let useHere = document.createElement('button')
        useHere.setAttribute("id", "useHere")
        useHere.setAttribute("class", "btn btn-primary")
        useHere.appendChild(document.createTextNode('Use Here'))
        useHere.onclick = ()=>{
            socket.emit("logout", document.getElementById("input0").value, "")
            document.getElementById("useHere").style.display = "none"
        }
        useHere.setAttribute("data-dismiss", "modal")
        footer.appendChild(useHere)
        once2 = false
    }
    $('#modal').modal('toggle');
})

socket.on("unregister", (testName)=>{
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = "you have unregistered from this test";
    $('#modal').modal('toggle');
    document.getElementById(testName+"1").style.display = "none"
})

socket.on("emailSent", ()=>{
    document.getElementById("modal-title").innerHTML = "Success";
    document.getElementById("modal-body").innerHTML = "an email has been sent to the entered email";
    $('#modal').modal('toggle');
})

socket.on("forgotPasswordFailed", ()=>{
    document.getElementById("modal-title").innerHTML = "Failed";
    document.getElementById("modal-body").innerHTML = "this email is not registered with this website";
    $('#modal').modal('toggle');
})