"use strict";

//save the log
var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

//webscraping
const puppeteer = require("puppeteer");

async function scrapeHumbleBundle(gameName, browser) {
  const URL = "https://www.humblebundle.com/store/search?search=" + gameName;
  let page = await browser.newPage().catch((err) => {
    console.log(err);
  }); //open a new page
  await page.goto(URL, { waitUntil: "networkidle0" }).catch((err) => {
    console.log(err);
  }); //access the page

  let items_details = await page
    .evaluate(() => {
      //Extract each items's basic details
      let table = document.querySelector(".entities-list");
      let item_panels = Array.from(table.children);
      let site = "HumbleBundle";

      // Loop through each item and get their details
      let items_info = item_panels.slice(0, 6).map((item_panel) => {
        let img = item_panel.querySelector(".entity-image").getAttribute("src");
        let price = item_panel.querySelector(".price").textContent;
        let title = item_panel.querySelector(".entity-title").textContent;
        let href = window.location.href;
        return { site, href, title, price, img };
      });
      return items_info;
    })
    .catch((err) => {
      console.log(err);
    });

  //console.log(items_details);
  // Close the page when everything is done
  await page.close();
  return new Promise((resolve, reject) => {
    resolve(items_details);
    setTimeout(function () {
      reject("HumbleBundle do not response.");
    }, 5000);
  });
}

async function scrapeGamesPlanet(gameName, browser) {
  const URL = "https://de.gamesplanet.com/search?query=" + gameName;
  let page = await browser.newPage().catch((err) => {
    console.log(err);
  });
  await page.goto(URL, { waitUntil: "networkidle0" }).catch((err) => {
    console.log(err);
  });

  let items_details = await page
    .evaluate(() => {
      document
        .querySelector(
          "body > div.container > div > div.col-12.col-xl-10.gp-xl-main > div > div:nth-child(1) > h2"
        )
        .remove();
      document
        .querySelector(
          "body > div.container > div > div.col-12.col-xl-10.gp-xl-main > div > div:nth-child(1) > nav"
        )
        .remove();

      let table = document.querySelector(
        "body > div.container > div > div.col-12.col-xl-10.gp-xl-main > div > div:nth-child(1)"
      );
      let item_panels = Array.from(table.children);
      let site = "GamesPlanet";

      //console.log(item_panels);

      let items_info = item_panels.slice(0, 6).map((item_panel) => {
        let img = item_panel.querySelector("img").getAttribute("src");
        let price = item_panel.querySelector(".price_current").textContent;
        let title = item_panel.querySelector("h4").textContent;
        let href = window.location.href;
        return { site, href, title, price, img };
      });
      return items_info;
    })
    .catch((err) => {
      console.log(err);
    });

  //console.log(items_details);
  await page.close();
  return new Promise((resolve, reject) => {
    resolve(items_details);
    setTimeout(function () {
      reject("HumbleBundle do not response.");
    }, 5000);
  });
}

async function scrapeGamersGate(gameName, browser) {
  const URL = "https://www.gamersgate.com/de/games/?query=" + gameName;
  let page = await browser.newPage().catch((err) => {
    console.log(err);
  });
  await page.goto(URL, { waitUntil: "networkidle0" }).catch((err) => {
    console.log(err);
  });

  let items_details = await page
    .evaluate(() => {
      let table = document.querySelector(
        "body > main > section > div > div > div.column.column-content > div > div.catalog-list-decorator > div"
      );
      console.log("test");
      let item_panels = Array.from(table.children);
      let site = "GamersGate";

      //console.log(item_panels);

      let items_info = item_panels.slice(0, 6).map((item_panel) => {
        let img = item_panel.querySelector("img").getAttribute("src");
        let price = item_panel.querySelector(
          ".catalog-item--price"
        ).textContent;
        let title = item_panel.querySelector(
          ".catalog-item--title"
        ).textContent;
        let href = window.location.href;
        return { site, href, title, price, img };
      });
      return items_info;
    })
    .catch((err) => {
      console.log(err);
    });

  // console.log(items_details);
  await page.close();
  return new Promise((resolve, reject) => {
    resolve(items_details);
    setTimeout(function () {
      reject("HumbleBundle do not response.");
    }, 5000);
  });
}

async function scrapeSteam(gameName, browser) {
  const URL = "https://store.steampowered.com/search/?term=" + gameName;
  let page = await browser.newPage(); //open a new page
  await page.goto(URL, { waitUntil: "networkidle0" }); //access the podcasts page

  let items_details = await page
    .evaluate(() => {
      //Extract each item's basic details
      let table = document.querySelector("#search_resultsRows");
      console.log("test");
      let item_panels = Array.from(table.children);
      let site = "Steam";

      //console.log(item_panels);

      //console.log(item_panels);
      // Loop through each item and get their details
      let items_info = item_panels.slice(0, 6).map((item_panel) => {
        let img = item_panel.querySelector("img").getAttribute("src");
        let price = item_panel.querySelector(
          "div.col.search_price.responsive_secondrow"
        ).textContent;
        let title = item_panel.querySelector(".title").textContent;
        let href = window.location.href;
        return { site, href, title, price, img };
      });
      return items_info;
    })
    .catch((err) => {
      console.log(err);
    });

  //console.log(items_details);
  await page.close();
  return new Promise((resolve, reject) => {
    resolve(items_details);
    setTimeout(function () {
      reject("HumbleBundle do not response.");
    }, 5000);
  });
}

async function scrapeProton(gameName, browser) {
  const URL = "https://www.protondb.com/search?q=" + gameName;
  let page = await browser.newPage().catch((err) => {
    console.log(err);
  });
  await page.goto(URL, { waitUntil: "networkidle0" }).catch((err) => {
    console.log(err);
  });
  let items_details = await page
    .evaluate(() => {
      let table = document.querySelector(
        "#root > div.App__Root-sc-1j88ygk-0.ellHxy.root > main > div > div.ui__Flex-sc-1aw7ha-0.ui__Row-sc-1aw7ha-4.GameLayout__Container-bchls3-0.GameLayout__MobileUpContainer-bchls3-1.joYCnk.dUZlrr.bLUVvJ.iMfPuz"
      );
      console.log(table);
      let item_panels = Array.from(table.children);
      let site = "Proton";

      //console.log(item_panels);

      let items_info = item_panels.slice(0, 6).map((item_panel) => {
        let img = item_panel.querySelector("img").getAttribute("src");
        let price = item_panel.querySelector(
          "div > span.Summary__GrowingSpan-sc-18cac2b-1"
        ).innerHTML;
        let title = item_panel.querySelector(
          ".GameSlice__Title-z84s99-2.etrWhy"
        ).textContent;
        let href = window.location.href;
        return { site, href, title, price, img };
      });
      return items_info;
    })
    .catch((err) => {
      console.log(err);
    });

  // console.log(items_details);
  await page.close();
  return new Promise((resolve, reject) => {
    resolve(items_details);
    setTimeout(function () {
      reject("Proton do not response.");
    }, 5000);
  });
}

async function scrapeTheWeb(name, browser) {
  const promises = [];
  let HumbleBundle = scrapeHumbleBundle(name, browser).catch((err) => {
    console.log(err);
  });
  let Proton = scrapeProton(name, browser).catch((err) => {
    console.log(err);
  });
  let GamesPlanet = scrapeGamesPlanet(name, browser).catch((err) => {
    console.log(err);
  });
  let GamersGate = scrapeGamersGate(name, browser).catch((err) => {
    console.log(err);
  });
  let Steam = scrapeSteam(name, browser).catch((err) => {
    console.log(err);
  });
  promises.push(Proton);
  promises.push(Steam);
  promises.push(HumbleBundle);
  promises.push(GamesPlanet);
  promises.push(GamersGate);
  return Promise.all(promises);
}

async function getTheStuff(name) {
  let browser = await puppeteer.launch({ devtools: false }).catch((err) => {
    console.log(err);
  });

  let test = await scrapeTheWeb(name, browser).catch((err) => {
    console.log(err);
  });

  //console.log(test);
  await browser.close();
  return test;
}

//webserver
const express = require("express");
let app = express();
let server = app.listen(3000);
app.use(express.static("public"));
const port = 3000;

console.log(`GamesHunter listening at http://localhost:${port}`);

let socket = require("socket.io");

let io = socket(server);

io.sockets.on("connection", newConnection);

function newConnection(socket) {
  console.log("new Connection: " + socket.id);
  socket.on("task", workAtTask);

  async function workAtTask(data) {
    console.log(data);
    let result = await getTheStuff(data.submit);
    //console.log(result);
    socket.emit("result", result);
  }
}
