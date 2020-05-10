import { baseApiUrl } from "../config";
import axios from "axios";

const getAllChannels = (callback: any) => {
  axios
    .get(baseApiUrl + "/channels/all", {
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

export type Channel = {
  id: number;
  name: string;
};

export const ChannelService = {
  getAllChannels,
  createChannel,
  getChannelsForUser,
};
