process.env.NTBA_FIX_319 = "1"; //https://github.com/yagop/node-telegram-bot-api/issues/540

import * as functions from "firebase-functions";
import * as express from "express";
import * as TelegramBot from "node-telegram-bot-api";
// import * as admin from "firebase-admin";
import youtube from "./youtube";
import telegram from "./telegram";

// runtime config
const config = functions.config();

// initiaize firebase admin
// admin.initializeApp();

// initialize telegram bot API
const bot = new TelegramBot(config.telegram.bot_token);

const app = express();
app.use(express.json());

// routes
app.use("/youtube", youtube(bot, config));
app.use("/telegram", telegram(bot, config));

exports.UpKodingBot = functions.https.onRequest(app);
