<template>
    <div id="app" class="app">
    <Nav />
        <router-view></router-view>
    </div>
</template>

<script>
import Nav from '@/components/Nav';
export default {
    name: 'app',
    components: {
      Nav
  }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html {
    font-size: 100%;
    font-family: 'Inter UI', sans-serif;
}
.app {
    width: 62em;
    max-width: 100%;
    margin: 0 auto;
    padding: 2em 3em 2em;
    color: #2B3A42;
    background-color: #EFF0F1;
}
h1 {
    font-size: 8em;
    font-weight: 100;
}
h2 {
    font-size: 6em;
    font-weight: 100;
}
p {
    font-size: 2em;
    font-weight: normal;
}
@media screen and (max-width: 600px) {
    .app {
        padding: 1em;
    }
}

@media screen and (max-width: 400px) {
    .app {
        padding: 0;
    }
}
</style>
