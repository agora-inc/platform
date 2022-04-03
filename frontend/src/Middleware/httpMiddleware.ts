import axios, { AxiosPromise } from "axios";
import { baseApiUrl } from "../config";

const getRequestHeaders = (token: string) => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const get = (
  url: string,
  token: string,
  callback: (data: any) => void,
  onError?: (err: any) => void
) => {
  axios
    .get(`${baseApiUrl}/${url}`, {
      headers: getRequestHeaders(token),
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      onError && onError(error);
    });
};

export const post = (
  url: string,
  data: object | FormData,
  token: string,
  callback: (data: any) => void,
  onError?: (err: any) => void
) => {
  axios
    .post(`${baseApiUrl}/${url}`, data, {
      headers: getRequestHeaders(token),
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      onError && onError(error);
    });
};

export const del = (
  url: string,
  data: object,
  token: string,
  callback: (data: any) => void,
  onError?: (err: any) => void
) => {
  axios
    .delete(`${baseApiUrl}/${url}`, {
      data,
      headers: getRequestHeaders(token),
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      onError && onError(error);
    });
};

// export const get = async (
//   url: string,
//   onResponse: Function,
//   onError?: Function
// ) => {
//   let user = localStorage.getItem("user");
//   let userObj = { id: -1, accessToken: "", refreshToken: "" };
//   let tokenExpired = true;

//   if (user !== null) {
//     userObj = JSON.parse(user);
//     let accessToken = userObj.accessToken;
//     if (accessToken) {
//       tokenExpired = isTokenExpired(accessToken);
//     }
//   }

//   if (user !== null && tokenExpired) {
//     let response = await axios.post(
//       `${baseApiUrl}/refreshtoken`,
//       { userId: userObj.id },
//       getAxiosRequestConfig(userObj.refreshToken)
//     );

//     let accessToken = response.data.accessToken;
//     userObj.accessToken = accessToken;
//     localStorage.setItem("user", JSON.stringify(userObj));
//   }

//   axios
//     .get(`${baseApiUrl}/${url}`, getAxiosRequestConfig(userObj.accessToken))
//     .then((response) => {
//       onResponse(response.data);
//     })
//     .catch((error) => {
//       onError && onError(error);
//     });
// };

// export const post = async (
//   url: string,
//   data: object,
//   onResponse: Function,
//   onError?: Function
// ) => {
//   let user = localStorage.getItem("user");
//   let userObj = { id: -1, accessToken: "", refreshToken: "" };
//   let tokenExpired = true;

//   if (user !== null) {
//     userObj = JSON.parse(user);
//     let accessToken = userObj.accessToken;
//     tokenExpired = isTokenExpired(accessToken);
//   }

//   if (user !== null && tokenExpired) {
//     let response = await axios.post(
//       `${baseApiUrl}/refreshtoken`,
//       { userId: userObj.id },
//       getAxiosRequestConfig(userObj.refreshToken)
//     );

//     let accessToken = response.data.accessToken;
//     userObj.accessToken = accessToken;
//     localStorage.setItem("user", JSON.stringify(userObj));
//   }

//   axios
//     .post(
//       `${baseApiUrl}/${url}`,
//       data,
//       getAxiosRequestConfig(userObj.accessToken)
//     )
//     .then((response) => {
//       onResponse(response.data);
//     })
//     .catch((error) => {
//       onError && onError(error);
//     });
// };
