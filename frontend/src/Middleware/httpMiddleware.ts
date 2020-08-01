import axios from "axios";
import { baseApiUrl } from "../config";
import { UserService } from "../Services/UserService";

const parseJwt = (token: string) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const isTokenExpired = (token: string) => {
  let parsed = parseJwt(token);
  let now = new Date().getTime() / 1000;
  return now > parsed.exp;
};

const getAxiosRequestConfig = (token: string) => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const get = async (
  url: string,
  onResponse: Function,
  onError?: Function
) => {
  let user = localStorage.getItem("user");
  let userObj = { id: -1, accessToken: "", refreshToken: "" };
  let tokenExpired = true;

  if (user !== null) {
    userObj = JSON.parse(user);
    let accessToken = userObj.accessToken;
    if (accessToken) {
      tokenExpired = isTokenExpired(accessToken);
    }
  }

  if (user !== null && tokenExpired) {
    let response = await axios.post(
      `${baseApiUrl}/refreshtoken`,
      { userId: userObj.id },
      getAxiosRequestConfig(userObj.refreshToken)
    );

    let accessToken = response.data.accessToken;
    userObj.accessToken = accessToken;
    localStorage.setItem("user", JSON.stringify(userObj));
  }

  axios
    .get(`${baseApiUrl}/${url}`, getAxiosRequestConfig(userObj.accessToken))
    .then((response) => {
      onResponse(response.data);
    })
    .catch((error) => {
      onError && onError(error);
    });
};

export const post = async (
  url: string,
  data: object,
  onResponse: Function,
  onError?: Function
) => {
  let user = localStorage.getItem("user");
  let userObj = { id: -1, accessToken: "", refreshToken: "" };
  let tokenExpired = true;

  if (user !== null) {
    userObj = JSON.parse(user);
    let accessToken = userObj.accessToken;
    tokenExpired = isTokenExpired(accessToken);
  }

  if (user !== null && tokenExpired) {
    let response = await axios.post(
      `${baseApiUrl}/refreshtoken`,
      { userId: userObj.id },
      getAxiosRequestConfig(userObj.refreshToken)
    );

    let accessToken = response.data.accessToken;
    userObj.accessToken = accessToken;
    localStorage.setItem("user", JSON.stringify(userObj));
  }

  axios
    .post(
      `${baseApiUrl}/${url}`,
      data,
      getAxiosRequestConfig(userObj.accessToken)
    )
    .then((response) => {
      onResponse(response.data);
    })
    .catch((error) => {
      onError && onError(error);
    });
};
