<template>
<main>
    <h1>{{header}}</h1>
    <div class="current">
        <div class="box"><div class="smallbox"></div><div class="up"></div><div class="down"></div><p class="center">70%</p></div>
        <div class="box"><div class="smallbox"></div><div class="upblue"></div><div class="downgreen"></div><p class="center">30%</p></div>
        <div class="box"><div class="smallbox"></div><div class="upred"></div><div class="downyellow"></div><p class="center">40%</p></div>
        <div class="box"><div class="smallbox"></div><div class="uporange"></div><div class="downmaroon"></div><p class="center">10%</p></div>
    </div>
    <br />
    <div class="text" v-for="text in startText" :key="text.key">
        <p class="start">{{text.paragraph}}</p>
    </div>
</main>
</template>

<script>
export default {
  name: 'Front',
  props: { },
  data() {
    return {
        author: "",
        test: "",
        startText: "",
        header: "",
    }
  },
  mounted() {
    this.getMe();
  },
  methods: {
    getMe() {
      let that = this;
      fetch("https://trade-express.guni.me/")
      .then(function(response) {
          return response.json();
      })
      .then(function(result) {
          // eslint-disable-next-line
          that.header = result[0]['header'];
          that.startText = result[0].description.map((item, index) => {
            return {
              key: index,
              paragraph: item
            };
          });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.current {
    width: 100%;
    justify-content: space-between;
    display: flex;
}

.box {
    background-color: white;
    width: 10%;
    height: 200px;
    margin: 2%;
}

.smallbox {
    height: 2%;
    background-color: #65737E;
    width: 30%;
    margin: 0 auto;
}

.up {
    background-color: black;
    height: 30%;
}

.down {
    background-color: red;
    height: 70%;
}

.upblue {
    background-color: black;
    height: 70%;
}

.downgreen {
    background-color: red;
    height: 30%;
}

.upred {
    background-color: black;
    height: 60%;
}

.downyellow {
    background-color: red;
    height: 40%;
}

.uporange {
    background-color: black;
    height: 90%;
}

.downmaroon {
    background-color: red;
    height: 10%;
}

.center {
    text-align: center;
    font-size: 0.7em;
}

p {
    font-size: 1em;
}

.start {
    padding-bottom: 13px;
}

@media screen and (max-width: 800px) {
    .box {
      width: 15%;
    }
}

@media screen and (max-width: 600px) {
    .box {
      width: 20%;
    }
}

</style>
