//Deixa a string passada como parametro capitalizada (primeira letra em maiusculo e resto em minusculo)
function capitalize(string) {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Verifica se ao enviar uma request ao back-end o token de autorizacao é invalido
async function tokenExpirado(responseMessage) {
  const responseText = await responseMessage.text()
  const responseJson = await JSON.parse(responseText)

  if (responseJson["message"].startsWith("JWT expirada")) {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userEmail")
    alert("Token expirado, faça o login para continuar")
  }
}

//Botao que abre o modal de login
const modSignIn = document.getElementById("signInMod");

//Modal de disciplinas
const discModal = document.getElementById("disciplinaMod");


//Remove todo o conteudo (filhos) de um determiando container a partir de seu identificador passado como parametro para esta funcao
function killAllChildren(elemento) {
  let $discContainer = document.querySelector(elemento);
  if (!$discContainer) return;
  while ($discContainer.firstChild) {
    $discContainer.removeChild($discContainer.firstChild);
  }
}

//Checa se o usuario esta logado, caso negativo, o modal de login aparecera
const loggedInCheck = function () {
  if (localStorage.getItem("userToken") == null) {
    alert("Faça login para continuar")
    modSignIn.style.display = "flex";
    return true;
  }
}