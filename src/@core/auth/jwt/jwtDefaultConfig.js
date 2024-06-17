// ** Auth Endpoints
import themeConfig from "../../../configs/themeConfig";
export default {
  loginEndpoint: new URL("authorization/login", themeConfig.backendUrl),
  refreshEndpoint: new URL(
    "authorization/refresh-token",
    themeConfig.backendUrl
  ),

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",
};
