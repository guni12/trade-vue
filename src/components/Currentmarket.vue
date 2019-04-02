<template>
  <div class="container">
    <div class="content">
      <div class="panel panel-primary">
        <h3>Status: {{connStatus}}</h3>
        <br /><br />

        <div class="panel-body">
          <div class="table">
          <table>
            <tbody>
              <tr>
                <th class="th">Where</th>
                <th class="th">Amp</th>
                <th class="th">Price (Sek)</th>
                <th class="th">Time</th>
              </tr>

              <tr>
                <td>{{tableDist.name}}</td>
                <td class="center">{{tableDist.perc}}</td>
                <td class="center">{{tableDist.price}}</td>
                <td class="center">{{tableDist.time}} {{tableDist.date}}</td>
              </tr>
            </tbody>
          </table>
        </div> <!-- table -->

      <br /><br />

        <div class="total">
          <div class="coleft">
            <div id="gauge_net"></div>
          </div>
          <div class="coright">

          <div class="info">
          <table>
            <tbody>
              <tr><td class="info">Email:</td><td class="info">{{ tradeObj.email }}</td></tr>
              <tr><td class="info">Last bought:</td><td class="info">{{ tradeObj.buy }}</td></tr>
              <tr><td class="info">Last sold:</td><td class="info">{{ tradeObj.sell }}</td></tr>
              <tr><td class="info">Account:</td><td class="info">{{ tradeObj.depa }}</td></tr>
              <tr><td class="info">Last transaction time:</td><td class="info">{{ tradeObj.time }} {{ tradeObj.date }}</td></tr>
          </tbody></table></div>
          </div>
          <div class="coleft">
            <div id="gauge_car"></div>
          </div>
          <div class="coright">
            <form v-on:submit.prevent="aFunction">
              <div class="field">
                <select v-model="selected">
                  <option>Insert Sek</option>
                  <option>0</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <br />

                <select v-model="selected2">
                  <option>Buy Ampere</option>
                  <option>0</option>
                  <option>2</option>
                  <option>4</option>
                  <option>6</option>
                  <option>8</option>
                  <option>10</option>
                </select>
                <br />

                <select v-model="selected3">
                  <option>Sell Ampere</option>
                  <option>0</option>
                  <option>2</option>
                  <option>4</option>
                  <option>6</option>
                  <option>8</option>
                  <option>10</option>
                </select>
                <br />

                <button type="submit" class="button">Submit</button>
              </div>
            </form>
          </div>
        </div>

        <div class="actions">
          <div v-if="!isConnected">
            <button class="md-fab" v-on:click="startSocket()">
              Click to start
            </button>
          </div>
          <div v-if="isConnected">
            <button class="md-fab" v-on:click="disconnect()">
              Click to stop
            </button>
          </div>
        </div>

        </div><!-- panel-body-->
      </div><!-- panel-primary -->
    </div><!-- content -->
  </div><!-- container -->
</template>

<script>
import io from 'socket.io-client';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

var c_gauge;
var n_gauge;

export default {
  name: 'Current',
  props: { },

  data () {
    return {
      tableDist: {},
      tableCar: {},
      tradeObj: {},
      labelList: [],

      isConnected: false,
      connStatus: "Disconnected",
      startText: "",
      c_axis: null,
      c_hand: null,
      c_label: null,
      c_legend: null,
      cr0: null,
      cr1: null,
      cr2: null,

      n_axis: null,
      n_hand: null,
      n_label: null,
      n_legend: null,
      nr0: null,
      nr1: null,
      nr2: null,

      selected: 'Insert Sek',
      selected2: 'Buy Ampere',
      selected3: 'Sell Ampere',

      user: null,
      socket: null,
    }
  },
  mounted() {
    this.openSocketListeners();
    this.initGauge();
    this.getInfo();
  },
  watch: {
  },
  created: function () {
  },

    methods: {
    startSocket() {
      this.socket.open();
      this.isConnected = true;
      this.connStatus = "Connected";
    },

    getInfo() {
      this.socket.on('private trade', (data) => {
        if (data.res.length > 0) {
          let res = data.res[0];
          this.tradeObj = {
            insert: res.insert,
            buy: res.buy,
            sell: res.sell,
            date: res.date,
            time: res.time,
            email: res.email,
            uid: res.uid,
            intotal: res.intotal,
            depa: res.depa
          };
          // eslint-disable-next-line
          //console.log(this.tradeObj);
        }
      });
    },

    aFunction() {
      let uid = this.user['user']['id'];
      let email = this.user['user']['email'];
      let insert = this.selected > 0 ? this.selected : 0;
      let buy = this.selected2 > 0 ? this.selected2 : 0;
      let sell = this.selected3 > 0 ? this.selected3 : 0;
      let date = new Date();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var time = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      date = date.toLocaleDateString();

      if (this.isConnected) {
        this.socket.emit('trade', {'uid': uid, 'email': email, 'insert': insert, 'buy': buy, 'sell': sell, 'date': date, 'time': time});
      }
      // eslint-disable-next-line
      console.log(this.selected, this.selected2, this.selected3);
      this.selected = 'Insert Sek';
      this.selected2 = 'Buy Ampere';
      this.selected3 = 'Sell Ampere';
    },

    makeGaugeAxis(gauge, axis, min, max, r1, r2, range0, range1, range2, col1, col2, col3) {
      axis = gauge.xAxes.push(new am4charts.ValueAxis());
      axis.min = min;
      axis.max = max;
      axis.strictMinMax = true;

      axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      axis.renderer.grid.template.strokeOpacity = 0.3;

      gauge.colors.list = [
      am4core.color("#1BA68D"),
          am4core.color("#E7DA4F"),
          am4core.color("#E77624"),
          am4core.color("#DF3520"),
          am4core.color("#64297B"),
          am4core.color("#232555"),
          am4core.color("#e5e5e5"),
          am4core.color("#6794dc"),
          am4core.color("#6771dc")
      ];

      range0 = axis.axisRanges.create();
      range0.value = 0;
      range0.endValue = r1;
      range0.axisFill.fillOpacity = 1;
      range0.axisFill.fill = gauge.colors.getIndex(col1);
      range0.axisFill.zIndex = - 1;

      range1 = axis.axisRanges.create();
      range1.value = r1;
      range1.endValue = r2;
      range1.axisFill.fillOpacity = 1;
      range1.axisFill.fill = gauge.colors.getIndex(col2);
      range1.axisFill.zIndex = -1;

      range2 = axis.axisRanges.create();
      range2.value = r2;
      range2.endValue = max;
      range2.axisFill.fillOpacity = 1;
      range2.axisFill.fill = gauge.colors.getIndex(col3);
      range2.axisFill.zIndex = -1;
    },

    makeGaugeLabel(ll) {
      ll[0].parent = ll[1].chartContainer;
      ll[0].x = am4core.percent(ll[2]);
      ll[0].background.stroke = ll[1].colors.getIndex(ll[3]);
      ll[0].fill = ll[1].colors.getIndex(ll[4]);
      ll[0].text = "0";
    },

    makeGaugeLegend(gl) {
      gl[0].y = am4core.percent(7);
      gl[0].verticalCenter = "bottom";
      gl[0].parent = gl[3].chartContainer;
      gl[0].data = [{
        "name": gl[1],
        "fill": gl[3].colors.getIndex(gl[2])
      }];
    },

    lListInit() {
      this.labelList.template.isMeasured = false;
      this.labelList.template.background.strokeWidth = 2;
      this.labelList.template.fontSize = 25;
      this.labelList.template.padding(10, 20, 10, 20);
      this.labelList.template.y = am4core.percent(40);
      this.labelList.template.horizontalCenter = "middle";
    },

    am4themes_myTheme(target) {
      if (target instanceof am4core.ColorSet) {
        target.list = [
          am4core.color("#2776BD"),
          am4core.color("#00A1D0"),
          am4core.color("#00C195"),
          am4core.color("#7ED321"),
          am4core.color("#A8C600"),
          am4core.color("#C9B600"),
          am4core.color("#E3A600"),
          am4core.color("#F7941E"),
          am4core.color("#FC7149")
        ];
      }
    },

    initGauge() {
      n_gauge = am4core.create("gauge_net", am4charts.GaugeChart);
      n_gauge.hiddenState.properties.opacity = 0;
      n_gauge.innerRadius = -30;
      this.makeGaugeAxis(n_gauge, this.n_axis, 0, 1200, 800, 1000, this.nr0, this.nr1, this.nr2, 0, 1, 3);
      this.n_hand = n_gauge.hands.push(new am4charts.ClockHand());

      c_gauge = am4core.create("gauge_car", am4charts.GaugeChart);
      c_gauge.hiddenState.properties.opacity = 0;
      c_gauge.innerRadius = -30;
      this.makeGaugeAxis(c_gauge, this.c_axis, 0, 100, 40, 80, this.cr0, this.cr1, this.cr2, 3, 1, 0);
      this.c_hand = c_gauge.hands.push(new am4charts.ClockHand());

      this.labelList = new am4core.ListTemplate(new am4core.Label());
      this.lListInit();

      this.n_label = this.labelList.create();
      let n_list = [this.n_label, n_gauge, 60, 3, 3];
      this.makeGaugeLabel(n_list);

      this.n_legend = new am4charts.Legend();
      let n_l = [this.n_legend, "Electrical Station, 100 households", 3, n_gauge];
      this.makeGaugeLegend(n_l);

      this.c_label = this.labelList.create();
      let c_list = [this.c_label, c_gauge, 60, 0, 0];
      this.makeGaugeLabel(c_list);

      this.c_legend = new am4charts.Legend();
      let c_l = [this.c_legend, "Your Car Battery", 0, c_gauge];
      this.makeGaugeLegend(c_l);
    },


    openSocketListeners() {
      this.user = JSON.parse(localStorage.getItem('user'));
      let uid = this.user['user']['id'];
      let uemail= this.user['user']['email'];

      this.socket = io.connect("https://trade-socket.guni.me", {
        query: {
          userid: uid,
          email: uemail
        }
      });
      /*
      this.socket = io.connect("http://localhost:3200", {
        query: {
          userid: uid,
          email: uemail
        }
      });*/


      this.socket.on('connect', () => {
        this.connStatus = "Connected";
        this.isConnected = true;
      });

      this.socket.on('private', (data) => {
      // eslint-disable-next-line
        console.log(data);
      });

      this.socket.on('user left', function(data) {
      // eslint-disable-next-line
        console.log(data);
      });

      this.socket.on('user joined', function(data) {
      // eslint-disable-next-line
        console.log(data);
      });

      this.socket.on('login', function(data) {
      // eslint-disable-next-line
        console.log(data);
      });

      this.socket.on('disconnect', () => {
        this.connStatus = "Disconnected";
        this.isConnected = false;
        // eslint-disable-next-line
        console.log("Disconnected");
      });

      this.socket.on('dist', (message) => {
        this.isConnected = true;
        this.connStatus = "Connected";
        this.tableDist = {
          name: message.name,
          perc: message.perc * 10,
          time: message.time,
          date: message.date,
          price: message.price
        }
        this.n_hand.showValue(parseFloat(message.perc) * 10, 1000, am4core.ease.cubicOut);
        this.n_label.text = Math.round(this.n_hand.value);
      });

      this.socket.on('car', (message) => {
        this.isConnected = true;
        this.connStatus = "Connected";
        this.tableCar = {
          name: message.name,
          perc: message.perc,
          time: message.time,
          date: message.date
        }
        this.c_hand.showValue(parseFloat(message.perc), 1000, am4core.ease.cubicOut);
        this.c_label.text = Math.round(this.c_hand.value);
        // eslint-disable-next-line
        //console.log(this.tableCar, this.c_hand.value, this.c_label.text);
      });
    },

    disconnect: function () {
      this.socket.disconnect();
      this.isConnected = false;
      this.connStatus = "Disconnected";
    },

    cancelAutoUpdate: function() {
      clearInterval(this.timer)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
table {
    width: 100%;
    margin-bottom: 20px;
    font-size: 1.5em;
}

.th {
    width: 15%;
    border-bottom: 1px solid white;
    padding-bottom: 3px;
}
/*
"#1BA68D"),
          am4core.color("#E7DA4F"),
          am4core.color("#E77624"),
          am4core.color("#DF3520"),
          am4core.color("#64297B"),
          am4core.color("#232555"),
          am4core.color("#e5e5e5"),
          am4core.color("#6794dc"),
          am4core.color("#6771dc")
          */
.th-small {
    width: 10%;
}
.th-large {
    width: 30%;
}
.right {
    text-align: right;
}
.center {
    text-align: center;
}
td {
    border-right: 1px solid black;
    padding-right: 10px;
}


#gauge_car, #gauge_net {
    width: 100%;
    height: 250px;
}

.total {
    display: flex;
    width: 100%;
    flex-flow: row wrap;
    justify-content: space-around;
}

.coleft, .coright {
    width: 50%;
    flex-direction: column;
    justify-content: space-around;
    font-size: 0.5em;
}

form {
    font-size: 1.5em;
}

select, button {
    font-size: 1.5em;
    padding: 3px;
    margin: 5px;
}

button {
    background-color: #67B7DC;
}

.info {
    font-size: 1.5em;
}

td.info {
    padding: 7px;
    font-size: 1em;
    border-right: none;
}

@media screen and (max-width: 600px) {
    .table {
      font-size: 0.7em;
    }
    .coleft, .coright {
      width: 100%;
    }
}

@media all and (max-width: 400px) {
  .table {
    font-size: 0.5em;
  }
  .info {
    font-size: 1em;
  }
}
</style>
