import * as functions from "firebase-functions";
import * as express from "express";
import * as TelegramBot from "node-telegram-bot-api";
import youtube from "./youtube.handler";
import telegram from "./telegram.handler";

// runtime config
const config = functions.config();

// initialize telegram bot API
const bot = new TelegramBot(config.telegram.bot_token);

const app = express();
app.use(express.json());

// routes
app.use("/youtube", youtube);
app.use("/telegram", telegram(bot, config));

exports.UpKodingBot = functions.https.onRequest(app);
