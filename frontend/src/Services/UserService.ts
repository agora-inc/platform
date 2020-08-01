import { baseApiUrl } from "../config";
import axios from "axios";

const register = (username: string, password: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/add",
      { username: username, password: password },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      localStorage.setItem("user", JSON.stringify(response.data));
      callback(true);
      window.location.reload(false);
    })
    .catch(function (error) {
      callback(false);
    });
};

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
      window.location.reload(false);
    })
    .catch(function (error) {
      callback(false);
    });
};

const logout = () => {
  localStorage.removeItem("user");
  window.location.reload(false);
};

const isLoggedIn = () => {
  const user = localStorage.getItem("user");
  return user !== null;
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export type User = {
  id: number;
  username: string;
};

export const UserService = {
  register,
  login,
  logout,
  isLoggedIn,
  getCurrentUser,
};
