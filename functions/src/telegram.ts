import * as express from "express";
import * as functions from "firebase-functions";
import * as TelegramBot from "node-telegram-bot-api";
import { ytChannelsMessage } from "./resources/yt_channels";
import { latestVideosMessage, playlistMessage } from "./resources/my_channel";

const router = express.Router();

/**
 * Telegram bot webhook handler
 * @param bot <TelegramBot>
 * @param config <functions.config.Config>
 */
export default function (bot: TelegramBot, config: functions.config.Config) {
  const webhookUrl = `https://us-central1-upkoding.cloudfunctions.net/UpKodingBot/telegram/webhook/${config.telegram.bot_token}`;
  bot
    .setWebHook(webhookUrl)
    .then(() => console.log("webhook registered"))
    .catch((err) => console.log("failed registering webhook: " + err.message));

  // -- Admin command handlers --
  // Return user info (useful to get user's numeric Telegram ID)
  bot.onText(/\/probe_me/, async (msg: TelegramBot.Message) => {
    // only bot admin can call this
    if (msg.chat.username === config.telegram.admin_username) {
      await bot.sendMessage(msg.chat.id, JSON.stringify(msg.chat));
    }
  });

  // Return group info (useful to get group's numeric Telegram ID)
  bot.onText(/\/probe_group/, async (msg: TelegramBot.Message) => {
    // only bot admin can call this
    if (msg.from?.id === parseInt(config.telegram.admin_id)) {
      // info about group sent to the bot admin
      await bot.sendMessage(config.telegram.admin_id, JSON.stringify(msg.chat));
    }
  });

  // -- Message handlers --
  bot.onText(/\/start/, async (msg: TelegramBot.Message) => {
    const text = `
Halo kak ${msg.from?.first_name},

Perkenalkan saya <a href="https://github.com/upkoding/telegram-bot">UpKodingBot</a>, berikut command yang tersedia:

/channels - Daftar channel Youtube belajar programming
/videos - Daftar video terbaru dari Bli Eka Putra
/playlists - Daftar playlist yang ada di channel UpKoding
/tentang - Tentang UpKodingBot

Mau bantu ngembangin? cek kodenya <a href="https://github.com/upkoding/telegram-bot">disini</a> ya.`;
    await bot.sendMessage(msg.chat.id, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/tentang/, async (msg: TelegramBot.Message) => {
    const text = `
Halo kak ${msg.from?.first_name}, berikut info tentang saya:

- Dibuat pakai <a href="https://nodejs.org">NodeJS</a>
- Di-coding dengan <a href="https://www.typescriptlang.org">Typescript</a>
- Saya jalan sebagai <a href="https://firebase.google.com/docs/functions">Firebase Functions</a>
- Ingatan saya ada di <a href="https://firebase.google.com/docs/firestore">Firestore</a>

Kakak mau bantu ngembangin? cek kodenya <a href="https://github.com/upkoding/telegram-bot">disini</a> ya.`;
    await bot.sendMessage(msg.chat.id, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/channels/, async (msg: TelegramBot.Message) => {
    await bot.sendMessage(msg.chat.id, ytChannelsMessage(), {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/videos/, async (msg: TelegramBot.Message) => {
    const text = await latestVideosMessage();
    await bot.sendMessage(msg.chat.id, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/playlists/, async (msg: TelegramBot.Message) => {
    const text = await playlistMessage();
    await bot.sendMessage(msg.chat.id, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  // bot.on("message", async (msg: TelegramBot.Message) => {
  //   await bot.sendMessage(config.telegram.admin_id, JSON.stringify(msg));
  // });

  // webhook route
  router.post(
    `/webhook/${config.telegram.bot_token}`,
    (req: express.Request, res: express.Response) => {
      bot.processUpdate(req.body); // receive incoming messages & emit bot
      res.sendStatus(200);
    }
  );

  return router;
}
