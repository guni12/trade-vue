<template>
<main>
    <h2>Register here:</h2>
    <div class="login-text" >
        <form v-on:submit.prevent="getRegister">
          <!-- name -->
          <div class="field">
            <label class="label">Email</label><br />
            <input type="text" class="input" name="email" v-model="email">
          </div>

          <!-- password -->
          <div class="field">
            <label class="label">Password</label><br />
            <input type="password" class="input" name="pass" v-model="pass">
          </div>

          <!-- submit button -->
          <div class="field has-text-right">
            <button type="submit" class="button">Submit</button>
          </div>
        </form>
    </div>
    <p>{{ message }}</p>
</main>
</template>

<script>

export default {
    name: 'Register',
    props: { },
    data() {
        return {
            email: "",
            pass: "",
            message: ""
        }
    },
    mounted() {

    },
    methods: {
        getRegister() {
            let that = this;
            //var url = 'http://localhost:1337/register';
            var url = 'https://trade-express.guni.me/register';
            var userstring = 'email=' + that.email + '&password=' + that.pass;
            // eslint-disable-next-line
            console.log(userstring);
            return fetch(url, {
                method: "POST",
                body: userstring,
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
            }).then(function(response) {
                return response.json();
            })
            .then(function(result) {
                //console.log(result);
                if (result.errors) {
                    that.message = result.errors.detail;
                    // eslint-disable-next-line
                    console.log(result.errors);
                } else {
                    // eslint-disable-next-line
                    console.log(result.data);
                    window.location = '/login';
                }
            })
            .catch(function(e) {
                // eslint-disable-next-line
                console.log("error", e);
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-text {
    background-color: orange;
    padding: 1em;
    margin: 1em;
}
input {
    width: 100%;
    height: 3em;
    font-size: 1.2em;
    padding-left: 1em;
}
p {
    font-size: 1.5em;
}

.has-text-right {
    height: 5em;
}

.button {
    float: right;
    background-color: #FF5801;
    width: 10em;
    height: 4em;
    margin-top: 2em;
}

@media all and (max-width: 800px) {
    h2 {
        font-size: 4em;
    }
}

@media all and (max-width: 500px) {
    h2 {
        font-size: 3em; 
    }
}

</style>
