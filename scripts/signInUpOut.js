import model from "./model.js";

const $signUpBt = document.getElementById("signUpBt");                //SignUp button
const $signInBt = document.getElementById("signInBt");                //SignIn button

const modSignIn = document.getElementById("signInMod");                //SignIn modal
const modSignUp = document.getElementById("signUpMod");                //SignUp modal

const discModal = document.getElementById("disciplinaMod");            //Disciplina modal

const btNav = document.getElementById("userEntries");                  //SignUp e SignIn

$signInBt.onclick = () => signIn();
$signUpBt.onclick = () => signUp();

//Fecha qualquer modal que estiver aberto caso o usuario clique fora de um destes.
window.onclick = (event) => {
    if (event.target == modSignIn || event.target == modSignUp) {
        modSignIn.style.display = "none"
        modSignUp.style.display = "none"
    } else if (event.target == discModal) {
        discModal.style.display = "none";
    }
}

//Funcao que reune as informacoes inseridas pelo usuario sobre login e as envia para o backend por meio de um fetch 
async function signIn() {
    model.signIn(document.forms["signIn"])
    const jsonBody = JSON.stringify(model.signInToJson());

    const fetcher = await fetch("https://ucdb-plataform1.herokuapp.com/api/v1/auth/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: jsonBody
    })

    const responseTxt = await fetcher.text()

    if (!fetcher.ok) {
        const responseJson = await JSON.parse(responseTxt)
        alert(responseJson["message"] + "\nPor favor, tente novamente.")
        throw new Error("O login falhou");
    }

    alert("Usuário Logado com sucesso");
    modSignIn.style.display = "none";
    localStorage.setItem("userToken", responseTxt)
    localStorage.setItem("userEmail", model.signInToJson()["email"])

    aparecerDisconnect()
}


//Funcao que reune as informacoes inseridas pelo usuario sobre cadastro de usuario e as envia para o backend por meio de um fetch 
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

//Checagem se usuario esta logado a partir do token inserido no sistema durante o processo de login. 
//Esta checagem tem funcao de decidir o que ira exibir para o usuario, se as opcoes de login e cadastro, ou a opcao de desconectar do sistema
if (localStorage.getItem("userToken")) aparecerDisconnect()
else {
    aparecerLoginRegistrar()
}

//Cria e adiciona dinamicamente os botoes de login e cadastro no HTML da pagina
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

//Cria e adiciona em run time o botao de desconectar na pagina
function aparecerDisconnect() {
    const disconnectBt = document.createElement("button");

    disconnectBt.className = "header_bt"
    disconnectBt.id = "disconnectarBt"
    disconnectBt.innerText = "/desconectar"

    disconnectBt.onclick = function () {
        killAllChildren("#userEntries")
        aparecerLoginRegistrar()
        localStorage.removeItem("userToken")
        localStorage.removeItem("userEmail")
    }

    killAllChildren("#userEntries")

    btNav.appendChild(disconnectBt)
}

//Remove todo o conteudo (filhos) de um determiando container a partir de seu identificador passado como parametro para esta funcao
function killAllChildren(elemento) {
    let $discContainer = document.querySelector(elemento);
    if (!$discContainer) return;
    while ($discContainer.firstChild) {
        $discContainer.removeChild($discContainer.firstChild);
    }
}

export default model;