import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} from "matrix-bot-sdk";
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage("./scratch");
import sqlite from "sqlite3";
import * as cron from "node-cron";
import config from "./config.json";
import { MdClient } from "./services/md-client";
import { ChapterDb } from "./db/chapter_db";
import { isBigIntLiteral } from "typescript";

// where you would point a client to talk to a homeserver
const homeserverUrl = config.matrix_server;

// see https://t2bot.io/docs/access_tokens
const accessToken = config.access_token;

// We'll want to make sure the bot doesn't have to do an initial sync every
// time it restarts, so we need to prepare a storage provider. Here we use
// a simple JSON database.
const storage = new SimpleFsStorageProvider("hello-bot.json");

// Now we can create the client and set it up to automatically join rooms.
const client = new MatrixClient(homeserverUrl, accessToken, storage);

AutojoinRoomsMixin.setupOnClient(client);

// Now that the client is all set up and the event handler is registered, start the
// client up. This will start it syncing.
client.start().then(() => {

  let mdCient = new MdClient(config.md_username ?? "", config.md_password);


  console.log(mdCient.local.getRefresh() == '');

  if (
    mdCient.local.getRefresh() == ''
  ) {
    mdCient.login();
  }

  cron.schedule("* * * * *", () => {
    console.log('Start fetching...');

    const sqlite3 = sqlite.verbose();

    const db = new sqlite3.Database("./md.db");

    let dbClient = new ChapterDb(db);



    dbClient.findOne((_, res) => {
      let latestid = res != undefined && res.length > 0 ? res[0].chapter_id : "";

      console.log(`aaaaaaaaaaa latestid ${latestid == "" ? "no id found" : latestid}`);

      let resAll = res != undefined ? res : [];

      console.log(res)

      mdCient
        .feed()
        .then(async (resultFeed) => {
          console.log(`aaaaaaaaaaa resultFeed`);

          console.log(resultFeed);

          const indexLatestId2 = resultFeed.findIndex((e) => e.id == latestid)

          const indexLatestId = indexLatestId2 < 0 ? (indexLatestId2 == 0 ? -1 : resultFeed.length + 1) : indexLatestId2;



          console.log(`aaaaaaaaaaa indexLatestId = ${indexLatestId2}`);

          const indexFilter = resultFeed.splice(0, indexLatestId);

          if (indexFilter.length > 0) {
            dbClient.insert(indexFilter[0].id);
          }

          const reverseIndexFilter = indexFilter.reverse();

          console.log('aaaaaaaaaaa reverseIndexFilter');


         

          reverseIndexFilter.forEach((element) => {
            const message =
              `${element.manga_title} \Chapter: ${element.chapter} \nhttps://mangadex.org/chapter/${element.id}/1 \n`;

              client.sendText(config.room_id, message);

          })

        })
        .catch((err) => {
          console.log(err);
        });
    });
  });



});

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}