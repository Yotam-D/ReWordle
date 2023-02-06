let userIn = document.getElementById('InputUser')
let passwordIn = document.getElementById('InputPassword')
let wrnMsg = document.getElementById('AlertError')
let userInfo ={};

async function postOnLogin(e){
    e.preventDefault()
    const data = {username: userIn.value, password: passwordIn.value};
    // await fetch('http://localhost:5000/login', {
    await fetch('/login', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    })
    .then(response => {
        return response.json();
    })
    //response from server is res.status: 'valid user'/'invalid user'
    .then(res => {
        if (res.status == 'valid user') {
            userInfo = {userState: "valid_user"}
            console.log("valid user")
            document.forms[0].submit();
        }
        else{
            wrnMsg.innerHTML = "invalid user or password";
        }
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

