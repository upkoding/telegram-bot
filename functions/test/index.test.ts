// import  * as admin from 'firebase-admin'
import { config } from 'firebase-functions';
import * as supertest from 'supertest';

const { UpKodingBot } = require("../src/index")

// example xml data
let data = `
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
  <link rel="hub" href="https://pubsubhubbub.appspot.com"/>
  <link rel="self" href="https://www.youtube.com/xml/feeds/videos.xml?channel_id=CHANNEL_ID"/>
  <title>YouTube video feed</title>
  <updated>2015-04-01T19:05:24.552394234+00:00</updated>
  <entry>
    <id>yt:video:VIDEO_ID</id>
    <yt:videoId>VIDEO_ID</yt:videoId>
    <yt:channelId>CHANNEL_ID</yt:channelId>
    <title>Video title</title>
    <link rel="alternate" href="http://www.youtube.com/watch?v=VIDEO_ID"/>
    <author>
    <name>Channel title</name>
    <uri>http://www.youtube.com/channel/CHANNEL_ID</uri>
    </author>
    <published>${new Date(Date.now())}</published>
    <updated>${new Date(Date.now())}</updated>
  </entry>
</feed>
`

describe("make sure receive incoming data from youtube", () => {
  test("testing get method", async () => {
    await supertest(UpKodingBot).get("/youtube/webhook/videos").expect(401)

    const res = await supertest(UpKodingBot).get("/youtube/webhook/videos")
      .query({token: `${config().youtube.webhook_token}`, "hub.challenge": "challenge"})
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')    

    expect(res.text).toEqual("challenge");
  })
  
  test("testing post method", async () => {
    await supertest(UpKodingBot).post("/youtube/webhook/videos").expect(401)

    await supertest(UpKodingBot).post("/youtube/webhook/videos")
      .query({token: `${config().youtube.webhook_token}`}).set('Content-Type', 'application/xml')
      .send(data).expect(200)
  })
})

describe("make sure receive incoming data from telegram", () => {
  
  test("testing post method", async () => {
    await supertest(UpKodingBot).post(`/telegram/webhook/wrongtoken`).expect(404)
    await supertest(UpKodingBot).post(`/telegram/webhook/${config().telegram.bot_token}`).expect(200)
  })
})