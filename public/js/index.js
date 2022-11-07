console.log("in script");

async function registeruser(e) {
    // stop the regular form submission
    e.preventDefault();

    // get the data from input box in form and embed in object
    const user = document.getElementById("username_r");
    const pass = document.getElementById("password_r");

    const newuser = {
        username: user.value,
        password: pass.value
    }
    // clear input box
    user.value="";
    pass.value="";

    // set up and make asynchronous POST to API endpoint
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(newuser)
    };
    await fetch("/users/register", settings);
    hidereg();
};

async function loginuser(e) {
    // stop the regular form submission
    e.preventDefault();

    // get the data from input box in form and embed in object
    const user = document.getElementById("username_l");
    const pass = document.getElementById("password_l");

    const newuser = {
        username: user.value,
        password: pass.value
    }
    // clear input box
    user.value="";
    pass.value="";

    // set up and make asynchronous POST to API endpoint
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(newuser)
    };
    hidelogin();

    let response = await fetch("/users/login", settings);
    let content = await response.json();
    return content;
};

function logout(){
    document.getElementById("token").innerHTML="NOT FOUND";
    document.getElementById("loggedinuser").innerHTML="Not logged in";
    sessionStorage.removeItem('token');
}

async function getSecretData(){
    //token = document.getElementById("token").innerHTML;
    token = sessionStorage.token;
    const settings = {
        method: 'GET',
        headers: {
            'Authorization': token
        },
    };
    let response = await fetch("/users/protected", settings);
    if (response.status == 401) {
        return "You are not authorised to view this data";
    } else {
        let content = await response.json();
        return content;
    }
}

async function saveToken(data){
    const token = data.token;
    document.getElementById("token").innerHTML=token;
    sessionStorage.token = token;
    document.getElementById("loggedinuser").innerHTML="Logged in as " + data.username;

}

async function showSecretData(data){
    if(data.msg)
        document.getElementById("secretdata").innerHTML = data.msg;
    else    
        document.getElementById("secretdata").innerHTML = data;
}



function showreg(){
    document.getElementById("registration").style.display="block";
}

function showlogin(){
    document.getElementById("login").style.display="block";
}

function hidereg(){
    document.getElementById("registration").style.display="none";
}

function hidelogin(){
    document.getElementById("login").style.display="none";
}


window.onload = function(){
   
    document.getElementById("registrationform").addEventListener('submit', async(e) => {
        registeruser(e);
    });

    document.getElementById("loginform").addEventListener('submit', async(e) => {
        loginuser(e)
            .then(data => saveToken(data));
    });

    document.getElementById("reglink").onclick = showreg;

    document.getElementById("loginlink").onclick = showlogin;

    document.getElementById("logoutlink").onclick = logout;

    document.getElementById("secretlink").addEventListener('click', async(e) => {
        getSecretData(e)
            .then(data => showSecretData(data));
    });

    hidereg();
    hidelogin();


}