import { baseApiUrl } from "../config";
import axios from "axios";
import { get, post } from "../Middleware/httpMiddleware";

const getAllChannels = (limit: number, offset: number, callback: any) => {
  get(`channels/all?limit=${limit}&offset=${offset}`, callback);
};

const getTrendingChannels = (callback: any) => {
  get("channels/trending", callback);
};

const getChannelByName = (name: string, callback: any) => {
  get(`channels/channel?name=${name}`, callback);
};

const createChannel = (
  name: string,
  description: string,
  userId: number,
  callback: any
) => {
  // default description if none
  if (description == "") {
    description =
      "<p> Welcome to <b>" +
      name +
      "</b>! </p> <p>This section will contain general information about us. Stay tuned! </p>";
  }

  post(
    `channels/create`,
    { name: name, description: description, userId: userId },
    callback
  );
};

const getChannelsForUser = (userId: number, roles: string[], callback: any) => {
  const url = `channels/foruser?userId=${userId}&role=${roles.reduce(
    (acc, curr) => acc + `&role=${curr}`
  )}`;
  get(url, callback);
};

const getUsersForChannel = (
  channelId: number,
  roles: string[],
  callback: any
) => {
  const url = `channels/users?channelId=${channelId}&role=${roles.reduce(
    (acc, curr) => acc + `&role=${curr}`
  )}`;
  get(url, callback);
};

const getContactAddresses = (
  // TO TEST
  //
  channelId: number,
  callback: any
) => {
  const url = `channels/contacts?channelId=${channelId}`;
  get(url, callback);
};

const addContactAddress = (
  channelId: number,
  contactAddress: string,
  userId: number,
  callback: any
) => {
  post(
    `channels/contact/add?channelId=${channelId}&contactAddress=${contactAddress}&userId=${userId}`,
    { contactAddress: contactAddress, channelId: channelId, userId: userId },
    callback
  );
};

const removeContactAddress = (
  // TODO: make this into a delete request
  channelId: number,
  contactAddress: string,
  userId: number,
  callback: any
) => {
  const url = `channels/contact/delete?channelId=${channelId}&contactAddress=${contactAddress}&userId=${userId}`;
  get(url, callback);
};

const getRoleInChannel = (userId: number, channelId: number, callback: any) => {
  const url = `channels/user/role?channelId=${channelId}&userId=${userId}`;
  get(url, callback);
};

const addUserToChannel = (
  userId: number,
  channelId: number,
  role: string,
  callback: any
) => {
  post(
    "channels/users/add",
    { userId: userId, channelId: channelId, role: role },
    callback
  );
};

const removeUserFromChannel = (
  userId: number,
  channelId: number,
  callback: any
) => {
  post(
    "channels/users/remove",
    { userId: userId, channelId: channelId },
    callback
  );
};

// const getViewsForChannel = (channelId: number, callback: any) => {
//   axios
//     .get(baseApiUrl + "/channels/viewcount?channelId=" + channelId, {
//       headers: { "Access-Control-Allow-Origin": "*" },
//     })
//     .then(function (response) {updateLongChannelDescription
//       callback(response.data);
//     });
// };

const getFollowerCountForChannel = (channelId: number, callback: any) => {
  get(`channels/followercount?channelId=${channelId}`, callback);
};

const updateChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any
) => {
  post(
    "channels/updatedescription",
    { channelId: channelId, newDescription: newDescription },
    callback
  );
};

const updateLongChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any
) => {
  post(
    "channels/updatelongdescription",
    { channelId: channelId, newDescription: newDescription },
    callback
  );
};

const updateChannelColour = (
  channelId: number,
  newColour: string,
  callback: any
) => {
  post(
    "channels/updatecolour",
    { channelId: channelId, newColour: newColour },
    callback
  );
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

const getDefaultCover = () => {
  return baseApiUrl + `/channels/cover?default=1`;
};

const removeCover = (channelId: number, callback: any) => {
  axios
    .delete(baseApiUrl + "/channgetContactAddressesels/cover", {
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
  getTrendingChannels,
  getChannelByName,
  createChannel,
  getChannelsForUser,
  getUsersForChannel,
  getRoleInChannel,
  getContactAddresses,
  addUserToChannel,
  removeUserFromChannel,
  getFollowerCountForChannel,
  updateChannelColour,
  updateChannelDescription,
  updateLongChannelDescription,
  uploadAvatar,
  getAvatar,
  uploadCover,
  getCover,
  removeCover,
  addContactAddress,
  removeContactAddress,
};
