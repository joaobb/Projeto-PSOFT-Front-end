import model from "./model.js";

//Capitalizes the string
function capitalize(string) {                                       
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// * SIGNIN AND SIGNUP FETCHS END * \\

const modSignIn = document.getElementById("signInMod");                //SignIn button
const $discSearchBar = document.getElementById("discSearchBar");       //Discipline search bar
const $discBt = document.getElementsByClassName("discBt");             //Discipline button
const discModal = document.getElementById("disciplinaMod");
var bufferTime = null;                                                 //Time to buffer user input on discipline search bar

const loggedInCheck = function () {
  if (localStorage.getItem("userToken") == null) {
    alert("Faça login para continuar")
    modSignIn.style.display = "flex";
    return true;
  }
}

$discSearchBar.onkeyup = async function () {                           //Receaves user input on the discipline search bar
  if (!$discSearchBar.value) {
    killAllChildren("#discSearchBar")
    return;
  }

  if (bufferTime != null) clearTimeout(bufferTime);                           //Restart the buffer if it is the first time being called
  bufferTime = setTimeout(await disciplineBtControler, 300);                  //Starts the buffer countdown, if the uses don't write anything new in 300ms, 
  //it will run the button creator function
}

var disciplineBtControler = async function () {                        //Controls the discipline button creation
  if (!$discSearchBar.value) return
  const disciplineList = await disciplineFethcer()

  killAllChildren(".disciplinas-container"); //:D

  disciplineList.forEach(discipline => {
    discButtonCreator(discipline["id"], discipline["nome"]);
  });
}

function killAllChildren(elemento) {                                           //Cleans disciplinas container
  let $discContainer = document.querySelector(elemento);
  if (!$discContainer) return;
  while ($discContainer.firstChild) {
    $discContainer.removeChild($discContainer.firstChild);
  }
}

// * DISCIPLINES SEARCH BAR RESULTS BEGIN * \\

function discButtonCreator(discId, discNome) {                         // Creates buttons based on the input and set its attributes
  let button = document.createElement("button");
  button.id = discId;
  button.innerText = (discId + " - " + capitalize(discNome));
  button.onclick = () => {
    if (loggedInCheck()) return;
      perfilModController(discId);
    }
  button.className = "discBt";
  console.log(button.innerText);
  
  document.querySelector(".disciplinas-container").appendChild(button);
}

async function disciplineFethcer() {                                //Fetches a discipline using a substring on the back-end using 
  const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/findSubjects/?substring=" + $discSearchBar.value.replace(/ /g, "%20");
  let fetcher = await fetch(requestUrl)
  if (!fetcher.ok) throw new Error("Discipline fetch failed");
  let discJson = await fetcher.json();
  
  console.log(discJson);
  

  return discJson;
}

// * DISCIPLINES SEARCH BAR RESULTS END * \\


// * PERFIL BEGIN * \\


async function perfilModController(id) {
  killAllChildren("#comentariosContainer");
  disciplinaModal("", "");
  
  
  const perfilJson = await perfilFetcher(id);
  discModal.style.display = "block";
  
  disciplinaModal(perfilJson["id"], perfilJson["disciplina"], perfilJson["qtdLikes"])
  console.log(perfilJson["comentarios"]);

  mudarCorBotaoLike(perfilJson["flagLike"])

  perfilJson["comentarios"].forEach(comentario => {
    // comentarioCreator(comentario["usuario"]["firstName"] + " " + comentario["usuario"]["firstName"],
    comentarioCreator("nome",
      comentario["date"] + " " + comentario["hora"], comentario["comentario"]);
  });
}

function mudarCorBotaoLike (flag) {
  if (flag) document.getElementById("likeBt").style = "filter: invert(32%) sepia(95%) saturate(1073%) hue-rotate(103deg) brightness(95%) contrast(105%);"
  else document.getElementById("likeBt").style = ""
}

function disciplinaModal(idDisc, nomeDisc, numLikes) {
  document.querySelector("#nomeDisc").innerText = nomeDisc;
  const $likeInfo = document.querySelector("#likeInfo")

  killAllChildren("#likeInfo")

  const likeBt = document.createElement("input")
  likeBt.type = "image"
  likeBt.src = "like.svg"
  likeBt.id = "likeBt"
  likeBt.onclick = async () => {
    const likeUpdate = await curtirPerfil(idDisc)
    mudarCorBotaoLike(likeUpdate[0])

    document.querySelector("#likeNum").innerText = likeUpdate[1]
  }

  const likeCounter = document.createElement("p")
  likeCounter.id = "likeNum"
  likeCounter.innerText = numLikes;

  $likeInfo.append(likeBt, likeCounter)
}

function comentarioCreator(autor, data, comentario) {
  let comentarioDiv = document.createElement("div");
  comentarioDiv.className = "perfilComentario"

  comentarioDiv.innerHTML = `<div class="comentario">
  <div class="donoComentario">
      <p class="autor">` + autor + `</p>
      <p class="timeData">` + data + `</p>
  </div>
  ` + comentario + `
<br>
<input type="text" class="pure-input-rounded" id="subComentario" placeholder="Comentar">
</div>`
  document.querySelector("#comentariosContainer").appendChild(comentarioDiv);
}

async function perfilFetcher(id) {                                  //Fetches for a perfil of a discipline using its id on the back-end
  const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/getPerfil?id=" + id;

  let fetcher = await fetch(requestUrl)
  if (!fetcher.ok) throw new Error("Discipline perfil fetch failed");
  let perfilData = await fetcher.json();

  console.log(perfilData);

  return perfilData;
}

// const botaoLike = document.getElementById("likeBt")

async function curtirPerfil(id) {                                  //Fetches for a perfil of a discipline using its id on the back-end
  const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/like?id=" + id;
  const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
  console.log("kkk");
  
  const fetcher = await fetch(requestUrl, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json; charset=utf-8', 
    'authorization': 'Bearer ' + userToken}
  })

  if (!fetcher.ok) throw new Error(response);

  const responseTxt = await fetcher.text();
    
  const responseJson = await JSON.parse(responseTxt);
  
  return [responseJson["flagLike"], responseJson["qtdLikes"]]
    
};

export default model; 
// * PERFIL END * \\