import * as axios from "axios";
import { MyLocal } from "../local/local";
import { ChapterResponse } from "../models/chapter-response";
import { Token, TokenResponse } from "../models/token-response";
import { isJwtExpired } from "jwt-check-expiration";
import { ResultFeed } from "../models/to_discord_response";
export class MdClient {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.client = axios.default;
    this.local = new MyLocal();
  }

  username: string;

  password: string;

  client: axios.AxiosStatic;

  local: MyLocal;

  // public async refresh():Promise<Token>{
  //   return await this.
  // }

  public async refresh() {
    if (isJwtExpired(this.local.getRefresh())) {
      return await this.login();
    }
    return await this.client({
      method: "post",
      url: "https://api.mangadex.org/auth/refresh",

      headers: { "Content-Type": "application/json" },
      data: {
        token: this.local.getRefresh(),
      },
    })
      .then((result) => {
        let resultData = result.data as TokenResponse;

        console.log(resultData);

        this.local.setRefresh(resultData.token.refresh);

        this.local.setSession(resultData.token.session);

        localStorage;

        return resultData.token;
      })
      .catch((err) => {
        throw err;
      });
  }

  public async login(): Promise<Token> {
    return await this.client({
      method: "post",
      url: "https://api.mangadex.org/auth/login",

      headers: { "Content-Type": "application/json" },
      data: {
        username: this.username,
        password: this.password,
      },
    })
      .then((result) => {
        let resultData = result.data as TokenResponse;

        console.log(resultData);

        this.local.setRefresh(resultData.token.refresh);

        this.local.setSession(resultData.token.session);

        localStorage;

        return resultData.token;
      })
      .catch((err) => {
        throw err;
      });
  }

  public async feed(): Promise<Array<ResultFeed>> {
    if (isJwtExpired(this.local.getSession() ?? "")) {
      await this.refresh();
    }

    let session = this.local.getSession();

    return await this.client({
      method: "get",
      url: "https://api.mangadex.org/user/follows/manga/feed?limit=32&offset=0&translatedLanguage[]=en&includes[]=manga&includes[]=scanlation_group&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[readableAt]=desc",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    })
      .then((res) => {
        let resultData = res.data as ChapterResponse;

        let a: Array<ResultFeed> = resultData.data.map((v) => {
          let result: ResultFeed = {
            id: v.id ?? "",
            manga_title:
              v.relationships.find((e) => e.type == "manga").attributes.title
                .en ?? "",
            chapter: v.attributes.chapter ?? "",
          };
          return result;
        });

        return a;
      })
      .catch((err) => {
        throw err;
      });
  }
}
