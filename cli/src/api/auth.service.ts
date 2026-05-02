
export class AuthorizationApi {

  login = () => {

  };
  register = () => {};

  setTokens(accessToken: any, refreshToken: any, expiresIn: number) {
    // Access token храним только в памяти (безопаснее)
    this.accessToken = accessToken;
    this.accessTokenExpiry = Date.now() + expiresIn * 1000;

    // Refresh token храним в зашифрованном файле
    this.tokens.set("refreshToken", this.encrypt(refreshToken));
    this.tokens.set("expiresAt", Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  getAccessToken() {
    // Проверяем, не истек ли access token
    if (this.accessToken && this.accessTokenExpiry > Date.now()) {
      return this.accessToken;
    }
    return null;
  }

  getRefreshToken() {
    const encrypted = this.tokens.get("refreshToken");
    if (!encrypted) return null;

    // Проверяем, не истек ли refresh token
    if (this.tokens.get("expiresAt") < Date.now()) {
      this.clearTokens();
      return null;
    }

    return this.decrypt(encrypted);
  }

  clearTokens() {
    this.accessToken = null;
    this.tokens.set("refreshToken", null);
    this.tokens.set("expiresAt", null);
  }
}
