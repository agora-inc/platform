import { baseApiUrl } from "../config";
import axios from "axios";

const login = (username: string, password: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/authenticate",
      { username: username, password: password },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      localStorage.setItem("user", JSON.stringify(response.data));
      callback(true);
    })
    .catch(function (error) {
      callback(false);
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const isLoggedIn = () => {
  const user = localStorage.getItem("user");
  return user !== null;
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getLiveUsers = (callback: any) => {
  axios
    .get(baseApiUrl + "/users/live", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const goLive = (username: string | null, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/user/golive",
      { username: username },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback();
    });
};

const stopLive = (username: string | null, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/user/stoplive",
      { username: username },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback();
    });
};

export type User = {
  id: number;
  username: string;
};

export const UserService = {
  login,
  logout,
  isLoggedIn,
  getCurrentUser,
  getLiveUsers,
  goLive,
  stopLive,
};
