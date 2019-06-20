function emailValidator(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return  regex.test(email);
}

passwdValidator = passwd => passwd.length > 7;

validEmail = (email, element) => document.getElementById("emailVality" + element).innerText = emailValidator(email) ? "Valid Email" : "Invalid Email";
validPasswd = (passwd, element) => document.getElementById("passwdVality" + element).innerText = passwdValidator(passwd) ? "Valid Password" : "Invalid Password";

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

const modSignIn= document.getElementById("signInMod");
const modSignUp = document.getElementById("signUpMod");
const discSearchBar = document.getElementById("discSearchBar");

discSearchBar.onkeyup = () => {
  //Do a fetch with the input value and filter subjects
  console.log("ainda nn sei nem procurar " + discSearchBar.value + " :D")
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