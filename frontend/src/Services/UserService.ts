import { baseApiUrl } from "../config";
import axios from "axios";
import { post } from "../Middleware/httpMiddleware";

const getAllPublicUsers = (callback: any) => {
  axios
    .get(baseApiUrl + "/users/public")
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => console.error(error));
};

const register = (
  username: string,
  password: string,
  email: string,
  position: string,
  institution: string,
  refChannel: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/users/add",
      { 
        username: username, 
        password: password, 
        email: email, 
        position: position,
        institution: institution,
        refChannel: refChannel,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      localStorage.setItem("user", JSON.stringify(response.data));
      callback({status: "ok", userId: response.data.id});
      // getting weird error about expecting no arguments
      // window.location.reload(false);
    })
    .catch(function (error) {
      callback({status: error.response.data, userId: -1});
    });
};

const login = (credential: string, password: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/authenticate",
      { credential: credential, password: password },
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

const emailChangePasswordLink = (usernameOrEmail: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/email_change_password_link",
      { usernameOrEmail },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
    .then(function (response) {
      // localStorage.setItem("user", JSON.stringify(response.data));
      callback(true);
    })
    .catch(function (error) {
      console.log("ERROR ON PASSWORD RESET: ", error)
      callback(false);
    });
};

const changePassword = (newPassword: string, code: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/change_password",
      { password: newPassword },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${code}`,
        },
      }
    )
    .then(function (response) {
      // localStorage.setItem("user", JSON.stringify(response.data));
      callback(true);
    })
    .catch(function (error) {
      callback(false);
    });
};

const updateBio = (userId: number, newBio: string, callback: any) => {
  post(
    "users/update_bio",
    {
      userId: userId,
      newBio: newBio,
    },
    callback
  );
};

const updatePublic = (userId: number, _public: boolean, callback: any) => {
  post(
    "users/update_public",
    {
      userId,
      public: _public,
    },
    callback
  );
};

export type User = {
  id: number;
  username: string;
  verified_academic?: boolean;
  public?: boolean;
  email?: string;
  bio?: string | undefined;
  institution?: string | undefined;
  personal_homepage?: string | undefined;
  position?: string | undefined;
};

export const UserService = {
  getAllPublicUsers,
  register,
  login,
  logout,
  isLoggedIn,
  getCurrentUser,
  changePassword,
  emailChangePasswordLink,
  updateBio,
  updatePublic,
};
