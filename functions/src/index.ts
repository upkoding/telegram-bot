process.env.NTBA_FIX_319 = "1"; //https://github.com/yagop/node-telegram-bot-api/issues/540

import * as functions from "firebase-functions";
import * as express from "express";
import * as TelegramBot from "node-telegram-bot-api";
import * as admin from "firebase-admin";
import youtube from "./youtube";
import telegram from "./telegram";

// runtime config
const config = functions.config();

// initiaize firebase admin
admin.initializeApp();

// initialize telegram bot API
const bot = new TelegramBot(config.telegram.bot_token);

const app = express();
app.use(express.json());

// routes
app.use("/youtube", youtube(bot, config));
app.use("/telegram", telegram(bot, config));

exports.UpKodingBot = functions.https.onRequest(app);

exports.EnglishDayReminder = functions.pubsub
  .schedule("0 8 * * FRI")
  .timeZone("Asia/Jakarta")
  .onRun(async (context: functions.EventContext) => {
    const msg = `
✨✨✨✨✨✨
Pagi semuanya, <b>ingat ya hari ini adalah hari berbahasa Inggris</b>.

<i>Jadi usahakan ketika bertanya, menjawab atau sharing kita menggunakan bahasa Inggris</i>.
Tidak harus sempurna, yang penting berani karena kita sama-sama belajar disini.

Have a nice day everyone!
✨✨✨✨✨✨
      `;
    await bot.sendMessage(config.telegram.group_id, msg, {
      parse_mode: "HTML",
    });
    return true;
  });
