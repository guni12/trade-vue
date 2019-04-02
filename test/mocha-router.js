/**
 * Test for getting started with Selenium.
 */
"use strict";

const fs = require('fs');
const assert = require("assert");
const test = require("selenium-webdriver/testing");
const webdriver = require("selenium-webdriver");
const By = webdriver.By;

let browser;

// Does not work with WSL!! Use cygwin

// Test suite
test.describe("Frontend-Vue", function() {
    test.beforeEach(function(done) {
        this.timeout(50000);
        browser = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome()).build();
        //browser.manage().setTimeouts( { implicit: 1000 } )

        browser.get("http://localhost:8088");
        done();
    });

    test.afterEach(function(done) {
        //browser.sleep(1000);
        browser.quit();
        done();
    });

    function goToNavLink(target) {
        browser.findElement(By.linkText(target)).then(function(element) {
            element.click();
        });
    }


    function matchUrl(target) {
        browser.getCurrentUrl().then(function(url) {
            assert.ok(url.endsWith("/" + target));
        });
    }


    function assertH1(target) {
        browser.findElement(By.css("h1")).then(function(element) {
            element.getText().then(function(text) {
                console.log("h1: ", text);
                assert.equal(text, target);
            });
        });
    }


    function assertH2(target) {
        browser.findElement(By.css("h2")).then(function(element) {
            element.getText().then(function(text) {
                console.log("h2: ", text);
                assert.equal(text, target);
            });
        });
    }


    function assertContains(target, sel) {
        let l = target.length;
        browser.findElement(By.css(sel)).then(function(element) {
            element.getText().then(function(text) {
                let sub = text.substring(0, l);
                assert.equal(sub, target);
            });
        });
    }


    function saveScreenshot(filename) {
        return browser.takeScreenshot().then(function(data) {
            fs.writeFile(filename, data.replace(/^data:image\/png;base64,/,''), 'base64', function(err) {
                if(err) throw err;
            });
        });
        done();
    }


    // Test case
    test.it("1. Test title", function(done) {
        let promise = browser.getTitle();

        promise.then(function(title) {
            console.log("title: ", title);
            assert.equal(title, "trade-vue");
        });

        done();
    });


    test.it("2. Test go to Join", function(done) {
        goToNavLink("Join");

        // get h2 text
        assertH2("Register here:");
        matchUrl("register");

        done();
    });


    test.it("3. Test to go to protected page", function(done) {
        goToNavLink("Current");

        // get h2 text
        assertH2("Login here:");
        matchUrl("login");

        done();
    });

    test.it("4. Test color on login background-color", function(done) {
        browser.findElement(By.xpath("//span")).click();

        // operator buttons background color
        browser.findElement(By.tagName("button"))
        .then(function(displayElement) {
            displayElement.getCssValue("background-color")
            .then(function(bgColor) {
                browser.sleep(500);
                assert.equal(bgColor, "rgba(255, 88, 1, 1)");
            })
        });

        done();
    });

    test.it("5. Test to login", function(done) {
        this.timeout(4000);
        browser.findElement(By.xpath("//span")).click();
        var form = browser.findElement(By.css('form'));
        var element1 = form.findElement(By.css('input[name=email]'));
        var element2 = form.findElement(By.css('input[name=pass]'));
        var button = form.findElement(By.css('button'));

        element1.clear();
        element1.sendKeys("admin@admin.se");
        element2.clear();
        element2.sendKeys("admin");
        saveScreenshot('snapshot1.png');
        button.click().then(function() {
            browser.sleep(200);
            done();
        });
        browser.sleep(200);
        saveScreenshot('snapshot2.png');
        assertContains("Status:", "h3");

        done();
    });

    test.it("6. Test to go to Front", function(done) {
        this.timeout(4000);
        goToNavLink("Front");
        browser.sleep(500);
        assertH1("Front");
        saveScreenshot('snapshot3.png');
        matchUrl("");

        done();
    });
});
