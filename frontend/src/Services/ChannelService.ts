import { baseApiUrl } from "../config";
import axios from "axios";
import { User } from "./UserService";
import { base } from "grommet";

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

const getRoleInChannel = (userId: number, channelId: number, callback: any) => {
  axios
    .get(
      baseApiUrl +
        `/channels/user/role?channelId=${channelId}&userId=${userId}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
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

const updateLongChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any
) => {
  // escape double quotes for href in HTML using regex (reason: JSON issue with double quotes inside double quotes)
  var re = "\"";
  var newDescriptionSkipped = newDescription.replace(new RegExp(re, 'g'), "\\\"");
  console.log(newDescriptionSkipped)


  axios
  .post(
    baseApiUrl + "/channels/updatelongdescription",
    { channelId: channelId, newDescription: newDescriptionSkipped},
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
  axios.post(baseApiUrl + "/channels/avatar", data).then(function (response) {
    callback(response.data);
  });
};

const getAvatar = (channelId: number) => {
  return baseApiUrl + `/channels/avatar?channelId=${channelId}`;
};

const uploadCover = (channelId: number, image: File, callback: any) => {
  const data = new FormData();
  data.append("channelId", channelId.toString());
  data.append("image", image);
  console.log(data.get("image"));
  axios.post(baseApiUrl + "/channels/cover", data).then(function (response) {
    callback(response.data);
  });
};

const getCover = (channelId: number) => {
  return baseApiUrl + `/channels/cover?channelId=${channelId}`;
};

const removeCover = (channelId: number, callback: any) => {
  axios
    .delete(baseApiUrl + "/channels/cover", {
      headers: { "Access-Control-Allow-Origin": "*" },
      data: {
        channelId: channelId,
      },
    })
    .then(() => callback());
};

export type Channel = {
  id: number;
  name: string;
  description: string;
  long_description: string;
  colour: string;
  has_avatar: boolean;
  has_cover: boolean;
};

export const ChannelService = {
  getAllChannels,
  getChannelByName,
  createChannel,
  getChannelsForUser,
  getUsersForChannel,
  getRoleInChannel,
  addUserToChannel,
  removeUserFromChannel,
  getViewsForChannel,
  getFollowerCountForChannel,
  updateChannelColour,
  updateChannelDescription,
  updateLongChannelDescription,
  uploadAvatar,
  getAvatar,
  uploadCover,
  getCover,
  removeCover,
};
