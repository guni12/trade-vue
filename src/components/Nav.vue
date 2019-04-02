<template>
<nav class="nav">
    <ul class="container">
        <li><router-link to="/">Front</router-link></li>
        <li><router-link to="/current">Current</router-link></li>
        <li class="join"><router-link to="/register">Join</router-link></li>
        <!--<li><router-link to="/login">Login</router-link></li>-->
        <li v-if='isNotAuth' @click="login"><span v-if='isNotAuth'>Login</span></li>
        <li v-if='isAuth' @click="logout"><span v-if='isAuth'>LogOut</span></li>
    </ul>
</nav>
</template>

<script>

export default {
    name: 'Nav',
    props: { },
    data() {
        return {
            isAuth: false,
            isNotAuth: false
        }
    },
    mounted() {
        this.isAuthenticated();
    },
    methods: {
        login: function () {
            window.location = '/current';
        },
        logout: function () {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.isAuthenticated();
            window.location = '/login';
        },
        isAuthenticated: function() {
            if (localStorage.getItem('token')) {
                this.isAuth = true;
            } else {
                this.isNotAuth = true;
            }
        },
    },
    computed: {
        showNav() {
            var res = this.isAuthenticated();
            // eslint-disable-next-line
            console.log("computed", res);
            return res;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav {
    min-height: 50px;
    background-image: linear-gradient(to right, #753A88 , #C72C60);
    margin: 0 auto;
}

ul.container {
    display: flex;
    padding-bottom: 10px;
}

li {
    display: inline;
    margin-right: 1em;
    padding-top: 10px;
}

li a, li span {
    text-decoration: none;
    color: #FF5801;
    font-size: 1.4em;
    padding-left: 10px;
}

li a:hover {
    text-decoration: underline;
}

.container > li {
    flex: 1;
}

@media all and (max-width: 600px) {
    .container {
        flex-wrap: wrap;
    }

    .container > li {
        flex-basis: 50%;
    }
}

@media all and (max-width: 400px) {
  .container > li {
    flex-basis: 100%;
  }
  .search {
    order: 1;
  }
}


</style>
