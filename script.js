function validEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return  regex.test(email);
}

validPasswd = passwd => passwd.length > 7;

// * TRANFORMAR EM MVC (OBJETIFICAR) * \\
function dataSignUp() {
  const $firstName = document.forms["signUp"]["firstName"].value;
  const $lastName = document.forms["signUp"]["lastName"].value;
  const $email = document.forms["signUp"]["email"].value;
  const $password = document.forms["signUp"]["password"].value;
  if ($firstName == "" || $lastName == "" || $email == "" || $password == "" || !emailValidator($email) || !passwdValidator($password)) {
    alert("Invalid input")
    throw new Error("Invalid input")
  }
   const req = {
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    password: $password
  }
  return JSON.stringify(req);
}

function dataSignIn() {
  const $email = document.forms["signIn"]["email"].value;
  const $password = document.forms["signIn"]["password"].value;
  if ($email == "" || $password == "" || !emailValidator($email) || !passwdValidator($password)) {
    alert("Invalid input")
    throw new Error("Invalid input")
  }
   const req = {
    email: $email,
    password: $password
  }
  return JSON.stringify(req);
}

// * TRANFORMAR EM MVC (OBJETIFICAR) * \\

// * SIGNIN AND SIGNUP FETCHS BEGIN * \\

function signin() {
  fetch("https://ucdb-plataform1.herokuapp.com/api/v1/auth/login",{
    method : "POST",
    headers :  {'Content-Type': 'application/json; charset=utf-8'},
    body : dataSignIn()
  }).then(response => {
    if(!response.ok) throw new Error("Registration failed");
    return response.text();
  }).then(data => alert(data));
  console.log("Logado");
}

function signup() {
  fetch("https://ucdb-plataform1.herokuapp.com/api/v1/users/", {
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    body: dataSignUp()
    })
  .then(response => {
    if(!response.ok) throw new Error("Registration failed");
    return response.text();
  })
  .then(data => alert("User was successfully registered"));
  console.log("Registrado");

  return false;
}

// * SIGNIN AND SIGNUP FETCHS END * \\

const modSignIn= document.getElementById("signInMod");
const modSignUp = document.getElementById("signUpMod");
const $discSearchBar = document.getElementById("discSearchBar");
const $discBt = document.getElementsByClassName("discBt");

$discBt.onclick = () => {
  console.log($discBt.id)
}

document.getElementById("loginBt").onclick = () => {
  modSignIn.style.display="block";
}

document.getElementById("registerBt").onclick = () => {
  modSignUp.style.display="block";
}

window.onclick = (event) => {
  if (event.target == modSignIn || event.target == modSignUp) {
    modSignIn.style.display = "none"
    modSignUp.style.display = "none"
  }
}

$discSearchBar.onkeyup = async function ()  {
  console.log($discSearchBar.value)
  if ($discSearchBar.value == "") {
    killAllChildren()
    return;
  } 
  await controler()
}

capitalize = function(string) {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// * DISCIPLINES SEARCH BAR RESULTS BEGIN * \\

function discButtonCreator (discId, discNome) { // Creates buttons based on the input
  let button = document.createElement("button");
  button.id = discId;
  button.innerText = (discId + " - " + capitalize(discNome));
  button.className = "discBt";
  
  document.querySelector(".disciplinas-container").appendChild(button);
}

function killAllChildren() {  //Cleans disciplinas container
  let $discContainer = document.querySelector(".disciplinas-container");
  while ($discContainer.firstChild) {
      $discContainer.removeChild($discContainer.firstChild);
  }
}

var controler = async function () {

  var discList = await discFethcer()

  killAllChildren(); //:D

  discList.forEach(discipline => {
      discButtonCreator(discipline["id"], discipline["nome"]);
  });
}

discFethcer = async function () {
  const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/findSubjects/?substring=" + $discSearchBar.value.replace(/ /g, "%20");
  let fetcher = await fetch(requestUrl)
  if(!fetcher.ok) throw new Error("Fetch failed");
  let discJson = await fetcher.json();
  return discJson;
}

// * DISCIPLINES SEARCH BAR RESULTS END * \\