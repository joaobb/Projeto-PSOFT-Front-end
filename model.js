const model = {
    "$firstName" : null,
    "$lastName"  : null,
    "$email"     : null,
    "$password"  : null,

    validEmail: function validEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
      
    validPasswd: function validPasswd(passwd) {
        return (passwd.length > 7)
    },

    signUp: function signUp(form) {
        this.$firstName = form["firstName"].value;
         this.$lastName = form["lastName"].value;
            this.$email = form["email"].value;
         this.$password = form["password"].value;

        if (!this.$firstName || !this.$lastName) {
            alert("Nome inserido invalido!\nPor favor verifique-os e tente novamente.");
            throw new Error("Nome inserido invalido!\nPor favor verifique-os e tente novamente.");
        }
        else if (!this.validEmail(this.$email)) {
            alert("Email inserido invalido!\nPor favor verifique-o e tente novamente.");
            throw new Error("Email inserido invalido!\nPor favor verifique-o e tente novamente.");
        }

        else if (!this.validPasswd(this.$password)) {
            alert("Senha inserida invalida!\nTamanho minimo de 8 caracteres.\nPor favor verifique-a e tente novamente.");
            throw new Error("Senha inserida invalida!\nTamanho minimo de 8 caracteres.\nPor favor verifique-a e tente novamente.");
        }
    },

    signIn: function signIn(form) {
           this.$email = form["email"].value;
        this.$password = form["password"].value;

        console.log(form["email"].value);
        console.log(this.$password);
        

        if (!this.validEmail(this.$email)) {
            alert("Email inserido invalido!\nPor favor verifique-o e tente novamente.");
            throw new Error("Email inserido invalido!\nPor favor verifique-o e tente novamente.");
        }

        else if (!this.validPasswd(this.$password)) {
            alert("Senha inserida invalida!\nPor favor verifique-a e tente novamente.");
            throw new Error("Senha inserida invalida!\nPor favor verifique-a e tente novamente.");
        }
    },

    signUpToJson: function signUpToJson() {
        return  {
            firstName: this.$firstName,
            lastName:  this.$lastName,
            email:     this.$email,
            password:  this.$password
        }
    },

    signInToJson: function signInToJson() {
        return  {
            email:     this.$email,
            password:  this.$password
        }
    },
};

export default model; 