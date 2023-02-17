export class MyLocal {
  sessionKey = "session";
  refreshKey = "refresh";

  public setSession(session: string) {
    localStorage.setItem(this.sessionKey, session);
  }

  public getSession(): string {
    return localStorage.getItem(this.sessionKey) ?? "";
  }

  public setRefresh(refresh: string) {
    localStorage.setItem(this.refreshKey, refresh);
  }

  public getRefresh(): string {
    return localStorage.getItem(this.refreshKey) ?? "";
  }
}
