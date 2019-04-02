# trade-vue

trade-vue is a frontend application for a trading platform.

It is built on [Vue.js](https://cli.vuejs.org/), a fast growing, modern framework which utilizes a virtual DOM and provides reactive and composable view components. Applications created with Vue are lightweight and have a very good performance. Behind the scenes Vue codebase is now written using TypeScript, which leads to less bugs and improves readability and speed. Vue is compact, has very good documentation, provides a neat command line interface via vue cli, allows you to get up and running really fast and is popular by startup teams.

**trade-vue together with socket and backend**

This platform was created (together with [trade-socket](https://github.com/guni12/trade-socket) and [trade-express](https://github.com/guni12/trade-express)) as my final project at [Blekinge Tekniska Högskola](https://www.bth.se/eng/) for the course Ramverk2. The real-time application microserver keeps track of prices and assets for each member, and the backend application handles secure login services and some text content.

### **`package.json`** shows a number of utilized plugins from node-modules.

| Plugin | USED FOR |
| ------ | ------ |
| @amcharts/amcharts4 | Version 4 used for this application is written in TypeScript. Some of their graphs were, at trade-vue's creation-time (Mars 2019) not yet converted from v3 to 4, but most of them were. For coding, three different syntaxes are provided: TypeScript / ES6, JavaScript, or JSON. The documentation helps with integration in chosen framework, besides great tutorials to get going. |
| socket.io | Enables real-time, bidirectional and event-based communication between the browser and the server. It provides auto-reconnection support together with secure connections in the precense of proxies, firewalls etc. |
| vue-router | Supports vue framework with easy route and path handling. |

### The **`devDependencies`** plugins contains testing modules.

Vue has great automatic development support, where mistakes in codepatterns can be corrected on the fly. `selenium-webdriver` together with `mocha`creates foundation for local testing.

### The Selenium suit is testing the following:

1. Test if web-page title is correct.

2. Test link to 'Join' and see if path and H2 is correct.

3. Test to go to protected page and end up at login.

4. Reach login-page via xpath and test color on button.

5. Login with credentials, take screenshot, click for new page, take screenshot and check header.

6. Go to Front-page, take screenshot and check path and header.
