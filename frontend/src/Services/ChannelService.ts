import { baseApiUrl } from "../config";
import axios from "axios";
import { User } from "./UserService";

const getAllChannels = (limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/channels/all?limit=${limit}&offset=${offset}`, {
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

const createChannel = (
  name: string,
  description: string,
  userId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/channels/create",
      { name: name, description: description, userId: userId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getChannelsForUser = (userId: number, roles: string[], callback: any) => {
  axios
    .get(
      baseApiUrl +
        `/channels/foruser?userId=${userId}&role=${roles.reduce(
          (acc, curr) => acc + `&role=${curr}`
        )}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getUsersForChannel = (
  channelId: number,
  roles: string[],
  callback: any
) => {
  axios
    .get(
      baseApiUrl +
        `/channels/users?channelId=${channelId}&role=${roles.reduce(
          (acc, curr) => acc + `&role=${curr}`
        )}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const isUserInChannel = (
  userId: number,
  channelId: number,
  roles: string[],
  callback: any
) => {
  getUsersForChannel(channelId, roles, (users: User[]) => {
    callback(users.some((user) => user.id === userId));
  });
};

const addUserToChannel = (
  userId: number,
  channelId: number,
  role: string,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/channels/users/add",
      { userId: userId, channelId: channelId, role: role },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const removeUserFromChannel = (
  userId: number,
  channelId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/channels/users/remove",
      { userId: userId, channelId: channelId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getViewsForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/channels/viewcount?channelId=" + channelId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getFollowerCountForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/channels/followercount?channelId=" + channelId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const updateChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/channels/updatedescription",
      { channelId: channelId, newDescription: newDescription },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const updateChannelColour = (
  channelId: number,
  newColour: string,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/channels/updatecolour",
      { channelId: channelId, newColour: newColour },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const uploadAvatar = (channelId: number, image: File, callback: any) => {
  const data = new FormData();
  data.append("channelId", channelId.toString());
  data.append("image", image);
  console.log(data.get("image"));
  axios
    .post(baseApiUrl + "/channels/uploadavatar", data)
    .then(function (response) {
      callback(response.data);
    });
};

export type Channel = {
  id: number;
  name: string;
  description: string;
  colour: string;
  has_avatar: boolean;
};

export const ChannelService = {
  getAllChannels,
  getChannelByName,
  createChannel,
  getChannelsForUser,
  getUsersForChannel,
  isUserInChannel,
  addUserToChannel,
  removeUserFromChannel,
  getViewsForChannel,
  getFollowerCountForChannel,
  updateChannelColour,
  updateChannelDescription,
  uploadAvatar,
};
