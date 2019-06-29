import model from "./model.js";

const $signUpBt = document.getElementById("signUpBt");                //SignIn button
const $signInBt = document.getElementById("signInBt");                //SignIn button

const modSignIn = document.getElementById("signInMod");                //SignIn button
const modSignUp = document.getElementById("signUpMod");                //SignUp button

const discModal = document.getElementById("disciplinaMod");

const btNav = document.getElementById("userEntries")

$signInBt.onclick = () => signIn();
$signUpBt.onclick = () => signUp();


window.onclick = (event) => {                                          //Closes both modals if any of those are open
    if (event.target == modSignIn || event.target == modSignUp) {
        modSignIn.style.display = "none"
        modSignUp.style.display = "none"
    } else if (event.target == discModal) {
        discModal.style.display = "none";
    }
}


function signIn() {
    model.signIn(document.forms["signIn"])
    const jsonBody = JSON.stringify(model.signInToJson());
    console.log(jsonBody);
    
    fetch("https://ucdb-plataform1.herokuapp.com/api/v1/auth/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: jsonBody
    }).then(response => {
        if (!response.ok) {
            console.log("ERROR: " + response.text());
            throw new Error("O login falhou");
        }
        
        return response.text();
    }).then(responseTxt => {
        alert("Usuário Logado com sucesso");
        modSignIn.style.display = "none";
        localStorage.setItem("userToken", responseTxt)
        aparecerDisconnect()
    });
    
    return true;
}

function signUp() {
    model.signUp(document.forms["signUp"])
    const jsonBody = JSON.stringify(model.signUpToJson());

    fetch("https://ucdb-plataform1.herokuapp.com/api/v1/users/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: jsonBody
    })
        .then(response => {
        
            if (!response.ok) {
                console.log("ERROR: " + response.text());
                throw new Error("O cadastro falhou");
            }

            return response.text();
        }).then(data => {            
            alert("Usuário cadastrado com sucesso!")
            modSignUp.style.display = "none";
        });

    return true;
}

if (localStorage.getItem("userToken")) aparecerDisconnect()
else {
    aparecerLoginRegistrar()
}

function aparecerLoginRegistrar() {
    const loginBt = document.createElement("li")
    loginBt.innerHTML = '<button class="header_bt" id="loginBt">/entrar</button>'
    loginBt.onclick = () => modSignIn.style.display = "flex";
    
    const registrarBt = document.createElement("li")
    registrarBt.innerHTML = '<button class="header_bt" id="registerBt">/registrar</button>'
    registrarBt.onclick = () => modSignUp.style.display = "flex";

    btNav.append(loginBt)
    btNav.append(registrarBt)
}

function aparecerDisconnect() {
    const disconnectBt = document.createElement("button");

    disconnectBt.className = "header_bt"
    disconnectBt.id = "disconnectarBt"
    disconnectBt.innerText = "/desconectar"

    disconnectBt.onclick = function() {
        killAllChildren("#userEntries")
        aparecerLoginRegistrar() 
        localStorage.removeItem("userToken")
    }
    
    killAllChildren("#userEntries")

    btNav.appendChild(disconnectBt)
}

function killAllChildren(elemento) {                                           //Cleans disciplinas container
    let $discContainer = document.querySelector(elemento);
    if (!$discContainer) return;
    while ($discContainer.firstChild) {
      $discContainer.removeChild($discContainer.firstChild);
    }
}

