export class MyLocal {
  sessionKey = "session";
  refreshKey = "refresh";

  public setSession(session: string) {
    console.log('setSession');

    localStorage.setItem(this.sessionKey, session);
  }

  public getSession(): string {
    console.log('getSession');

    return localStorage.getItem(this.sessionKey) ?? "";
  }

  public setRefresh(refresh: string) {
    console.log('setRefresh');

    localStorage.setItem(this.refreshKey, refresh);
  }

  public getRefresh(): string {
    console.log('getRefresh');

    return localStorage.getItem(this.refreshKey) ?? "";
  }
}
