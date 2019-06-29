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

        if (!this.$firstName || !this.$lastName || !this.validEmail(this.$email) || !this.validPasswd(this.$password)) {
            alert("Invalid input");
            throw new Error("Invalid input");
        }
    },

    signIn: function signIn(form) {
           this.$email = form["email"].value;
        this.$password = form["password"].value;

        console.log(form["email"].value);
        console.log(this.$password);
        

        if (!this.validEmail(this.$email) || !this.validPasswd(this.$password)) {
            alert("Invalid input");
            throw new Error("Invalid input");
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