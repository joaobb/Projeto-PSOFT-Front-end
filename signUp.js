function auth() {
    const $firstName = document.forms["signUp"]["primeiroNome"]
    const $lastName = document.forms["signUp"]["ultimoNome"]
    const $email = document.forms["signUp"]["email"]
    const $password = document.forms["signUp"]["senha"]
    console.log(document.forms["signUp"]);
    if ($firstName == "" || $lastName == "" || $email == "" || $password ==  "") {
      alert("deu merda")
      console.log("ERROR: Empty camp");
      return false;    
    }
    console.log("SignedUp")

    fetch("http://api-ucdb.herokuapp.com/api/v1/users/", {
      method: 'POST',
      body: {
        primeiroNome: $firstName, 
        $ultimoNome: $lastName, 
        email: $email, 
        senha: $password
        }
      })
    .then(response => {
      if(!response.ok)
          throw new Error("não foi possível completar cadastro");

      return response.text();
    })
    .then(data => alert(data));
    return true;
}