import * as express from "express";
import * as functions from "firebase-functions";
import * as TelegramBot from "node-telegram-bot-api";

const router = express.Router();

/**
 * Telegram bot middleware
 * @param bot <TelegramBot>
 * @param config <functions.config.Config>
 */
export default function (bot: TelegramBot, config: functions.config.Config) {
  const webhookUrl = `https://us-central1-upkoding.cloudfunctions.net/UpKodingBot/telegram/webhook/${config.telegram.bot_token}`;
  bot
    .setWebHook(webhookUrl)
    .then(() => console.log("webhook registered"))
    .catch((err) => console.log("failed registering webhook: " + err.message));

  // Message handlers
  bot.on("message", async (msg: TelegramBot.Message) => {
    await bot.sendMessage(msg.chat.id, "I'm alive!, your message: " + msg.text);
  });

  // webhook route
  router.post(
    `/webhook/${config.telegram.bot_token}`,
    (req: express.Request, res: express.Response) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    }
  );

  return router;
}
