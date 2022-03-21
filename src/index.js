import bodyParser from "body-parser";
import express from "express";
import { Telegraf } from "telegraf";
//const axios = require('axios').default;
import axios from "axios";



/*
  TELEGRAM_BOT_TOKEN is an environment variable
  that should be configured on Railway
*/
if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("Please add a bot token");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
let img, object;

bot.start(ctx => ctx.reply("Welcome"));
//bot.hears("hello", ctx => {
//  ctx.reply("Hello to you too!");
//});

bot.on("text", async(ctx) => {
    ctx.reply("сек...")
    await getRandomID(ctx, ctx.message.text)
})


function getRandomID(ctx, query) {
  axios.get(url + 'search?hasImages=true&q=' + query)
  .then(res => {

    let random = Math.round(Math.random() * res.data.total);
    object = res.data.objectIDs[random];

    axios.get(url + 'objects/' + object)
    .then(res => {
      img = res.data.primaryImage
  
//  ctx.replyWithPhoto(img)
    ctx.reply(img)
    })
      .catch(err => {
        ctx.reply("error")
    })
  })
  .catch(err => {
    ctx.reply("error")
  })
}

bot.launch();

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  res.json({ Hello: "World" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
