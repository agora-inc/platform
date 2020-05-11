import { baseApiUrl } from "../config";
import axios from "axios";
import { User } from "./UserService";

const getAllChannels = (callback: any) => {
  axios
    .get(baseApiUrl + "/channels/all", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getChannelByName = (name: string, callback: any) => {
  axios
    .get(baseApiUrl + "/channels/channel?name=" + name, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const createChannel = (name: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/users/authenticate",
      { name: name },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getChannelsForUser = (userId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/channels/foruser?userId=" + userId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getUsersForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/channels/users?channelId=" + channelId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const isUserInChannel = (userId: number, channelId: number, callback: any) => {
  getUsersForChannel(channelId, (users: User[]) => {
    callback(users.some((user) => user.id === userId));
  });
};

export type Channel = {
  id: number;
  name: string;
};

export const ChannelService = {
  getAllChannels,
  getChannelByName,
  createChannel,
  getChannelsForUser,
  getUsersForChannel,
  isUserInChannel,
};
