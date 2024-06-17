import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";
import toast from "react-hot-toast";
import { X } from "react-feather";
import { IoTimerOutline } from "react-icons/io5";

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getToken();

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (!this.isAlreadyFetchingAccessToken) {
              this.isAlreadyFetchingAccessToken = true;
              // Refresh the access token
              await this.refreshToken();
              this.isAlreadyFetchingAccessToken = false; // Reset flag on successful refresh
            }

            // Retry the original request with the new access token
            const accessToken = this.getToken();
            originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;

            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh token fails, handle the error
            console.error("Refresh token failed", refreshError);
            // Performing logout or other error handling here
            this.logoutUser();

            // For now, just reject the original request's promise
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args);
  }

  async refreshToken() {
    const response = await axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
    const { accessToken, refreshToken } = response.data;
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
    return response;
  }

  logoutUser() {
    localStorage.removeItem("userData");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");

    toast(
      (t) => (
        <div className="d-flex">
          <div className="me-1">
            {/* <Avatar size="sm" color="success" icon={<Coffee size={12} />} /> */}
            <IoTimerOutline size={16} />
          </div>
          <div className="d-flex justify-content-between align-items-center gap-1">
            <span>Session Expired! User logged out.</span>
            <div className="d-flex justify-content-between align-items-center">
              <X
                size={16}
                className="cursor-pointer"
                onClick={() => toast.dismiss(t.id)}
              />
            </div>
          </div>
        </div>
      ),
      {
        duration: 500,
      }
    );

    setTimeout(() => {
      // Redirect to the login page
      window.location.href = "/login";
    }, 1510);
  }
}
