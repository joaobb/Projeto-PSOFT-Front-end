function validEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

validPasswd = passwd => passwd.length > 7;

// * TRANFORMAR EM MVC (OBJETIFICAR) * \\
function dataSignUp() {
  const $firstName = document.forms["signUp"]["firstName"].value;
  const $lastName = document.forms["signUp"]["lastName"].value;
  const $email = document.forms["signUp"]["email"].value;
  const $password = document.forms["signUp"]["password"].value;
  if ($firstName == "" || $lastName == "" || $email == "" || $password == "" || !validEmail($email) || !validPasswd($password)) {
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
  if ($email == "" || $password == "" || !validEmail($email) || !validPasswd($password)) {
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
  fetch("https://ucdb-plataform1.herokuapp.com/api/v1/auth/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: dataSignIn()
  }).then(response => {
    console.log(response)
    if (!response.ok) throw new Error("Registration failed");
    return response.text();
  }).then(data => {
    console.log(data)
    // localStorage.setItem("tk", data) 
    // alert(localStorage.getItem("tk"))
  });
  console.log("Logado");
}

function signup() {
  fetch("https://ucdb-plataform1.herokuapp.com/api/v1/users/", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: dataSignUp()
  })
    .then(response => {
      if (!response.ok) throw new Error("Registration failed");
      return response.text();
    })
    .then(data => alert("User was successfully registered"));
  console.log("Registrado");

  return false;
}




// * SIGNIN AND SIGNUP FETCHS END * \\

const modSignIn = document.getElementById("signInMod");                //SignIn button
const modSignUp = document.getElementById("signUpMod");                //SignUp button
const $discSearchBar = document.getElementById("discSearchBar");       //Discipline search bar
const $discBt = document.getElementsByClassName("discBt");             //Discipline button
var bufferTime = null;                                                 //Time to buffer user input on discipline search bar

document.getElementById("loginBt").onclick = () => {                   //Opens SignIn modal
  modSignIn.style.display = "block";
}

document.getElementById("registerBt").onclick = () => {                //Opens SignUp modal
  modSignUp.style.display = "block";
}

window.onclick = (event) => {                                          //Closes both modals if any of those are open
  if (event.target == modSignIn || event.target == modSignUp) {
    modSignIn.style.display = "none"
    modSignUp.style.display = "none"
  }
}

$discSearchBar.onkeyup = async function () {                           //Receaves user input on the discipline search bar
  if ($discSearchBar.value == "") {
    killAllChildren()
    return;
  }
  
  if (bufferTime != null) clearTimeout(bufferTime);                           //Restart the buffer if it is the first time being called
  bufferTime = setTimeout(await disciplineBtControler, 300);                  //Starts the buffer countdown, if the uses don't write anything new in 300ms, 
                                                                              //it will run the button creator function
}

$discBt.onclick = async function()  {                                  //Opens a modal with the discipline information
  console.log($discBt.id)
  // await perfilFetcher()
}

var disciplineBtControler = async function () {                        //Controls the discipline button creation

  const disciplineList = await disciplineFethcer()

  killAllChildren(); //:D

  disciplineList.forEach(discipline => {
    discButtonCreator(discipline["id"], discipline["nome"]);
  });
}

capitalize = function (string) {                                       //Capitalizes the arg string
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function killAllChildren() {                                           //Cleans disciplinas container
  let $discContainer = document.querySelector(".disciplinas-container");
  while ($discContainer.firstChild) {
    $discContainer.removeChild($discContainer.firstChild);
  }
}

// * DISCIPLINES SEARCH BAR RESULTS BEGIN * \\

function discButtonCreator(discId, discNome) {                         // Creates buttons based on the input and set its attributes
  let button = document.createElement("button");
  button.id = discId;
  button.innerText = (discId + " - " + capitalize(discNome));
  button.onclick = () => console.log(discId);
  button.className = "discBt";

  document.querySelector(".disciplinas-container").appendChild(button);
}

disciplineFethcer = async function () {                                //Fetches a discipline using a substring on the back-end using 
  const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/findSubjects/?substring=" + $discSearchBar.value.replace(/ /g, "%20");
  let fetcher = await fetch(requestUrl)
  if (!fetcher.ok) throw new Error("Discipline fetch failed");
  let discJson = await fetcher.json();

  return discJson;
}

perfilFetcher = async function (id) {                                  //Fetches for a perfil of a discipline using its id on the back-end
  const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/perfis/?id=" + id;

  let fetcher = await fetch(requestUrl)
  if (!fetcher.ok) throw new Error("Discipline perfil fetch failed");
  let perfilData = await fetcher.json();

  console.log(perfilData);
}
// * DISCIPLINES SEARCH BAR RESULTS END * \\