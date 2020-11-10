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

const addInvitedMembersToChannel = (channelId: number, emails: string[], callback: any) => {
  axios
    .post(
      baseApiUrl + `/channels/invite/add`,
      { channelId: channelId, emails: emails },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback("ok");
    })
    .catch(function (error) {
      callback(error.response.data);
    });
};

const getInvitedMembersForChannel = (channelId: number, callback: any) => {
  const url = `channels/invite?channelId=${channelId}`;
  get(url, callback)
}

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
  // Query list of contact addresses from DB
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
  const url =
    baseApiUrl +
    `/channels/contact/delete?channelId=${channelId}&contactAddress=${contactAddress}&userId=${userId}`;
  get(url, callback);
};

const sendTalkApplicationEmail = (
  // note: administrator email addresses are queried in the backend.
  channel_id: number,
  agora_name: string,
  speaker_name: string,
  speaker_title: string,
  speaker_affiliation: string,
  speaker_personal_website: string,
  speaker_email: string,
  talk_title: string,
  talk_abstract: string,
  talk_topics: string,
  personal_message: string,
  callback: any
) => {
  const url = baseApiUrl + "/channel/apply/talk";
  axios
    .post(
      url,
      {
        channel_id,
        agora_name,
        speaker_name,
        speaker_title,
        speaker_affiliation,
        speaker_personal_website,
        speaker_email,
        talk_title,
        talk_abstract,
        talk_topics,
        personal_message,
      },
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
      callback(false);
    });
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
    { channelId: channelId, newDescription: newDescription},
    callback
  );
};

const updateLongChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any
) => {
  var newDescriptionUtf8 = unescape( encodeURIComponent(newDescription));
  var newDescriptionUtf8withoutDoubleQuote = newDescriptionUtf8.replace("\"", "\'")
  post(
    "channels/updatelongdescription",
    { channelId: channelId, newDescription: newDescriptionUtf8withoutDoubleQuote },
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
  // console.log(data.get("image"));
  // HACK: we had the ts argument to prevent from caching.
  let current_time = Math.floor(new Date().getTime() / 5000);
  axios.post(baseApiUrl + "/channels/avatar?ts=" + current_time, data).then(function (response) {
    callback(response.data);
  });
};

const getAvatar = (channelId: number, cacheDelay?: number) => {
  // HACK: we had the ts argument to prevent from caching.
  if (cacheDelay) {
    let current_time = Math.floor(new Date().getTime() / 1000) * cacheDelay;
    return baseApiUrl + `/channels/avatar?channelId=${channelId}&ts=` + current_time;
  } else {
    return baseApiUrl + `/channels/avatar?channelId=${channelId}`;
  }
  
};

const uploadCover = (channelId: number, image: File, callback: any) => {
  const data = new FormData();
  data.append("channelId", channelId.toString());
  data.append("image", image);
  // console.log(data.get("image"));

  // const options = {
  //   method: 'POST',
  //   body: data,
  //   // If you add this, upload won't work
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // };

  // fetch(baseApiUrl + "/channels/cover", options);

  axios.post(baseApiUrl + "/channels/cover", data,       {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then(function (response) {
    callback(response.data);
  });
};

const getCover = (channelId: number, cacheDelay?: number) => {
  if (cacheDelay) {
    return baseApiUrl + `/channels/cover?channelId=${channelId}&ts=` + cacheDelay;
  } else {
    return baseApiUrl + `/channels/cover?channelId=${channelId}`;
  }
  
};

const getDefaultCover = () => {
  return baseApiUrl + `/channels/cover?default=1`;
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

const deleteAgora = (id: number, callback: any) => {
  post("channels/delete", { id }, callback);
};

///////////////////////
// Membership methods
///////////////////////
const applyMembership = (
  id: number,
  userId: string,
  fullName: string,
  position: string,
  institution: string,
  email: string,
  personalHomepage: string,
  callback: any) => {
    post(
      "channel/membership/apply", 
      {
        id: id, 
        userId: userId,
        fullName: fullName,
        position: position,
        institution: institution,
        email: email,
        personalHomepage: personalHomepage
      }, 
    callback);
};

const cancelMembershipApplication = (
  id: number,
  userId: number, 
  callback: any) => {
  post(
    "channel/membership/cancel", 
    {
      id: id,
      userId: userId
    }, callback);
};

const acceptMembershipApplication = (
  id: number,
  userId: number, 
  callback: any) => {
  post(
    "channel/membership/accept", 
    {
      id: id,
      userId: userId
     }, 
    callback);
};

const getMembershipApplications = (
  channelId: number, 
  callback: any,
  userId?: number) => {
  if (userId === undefined){
    get(
      `channel/membership/list?channelId=${channelId}`, 
      callback);
  }
  else {
    get(
      `channel/membership/list?channelId=${channelId}&userId=${userId}`, 
      callback);
  }
}

const getViewCountForChannel = (
  channelId: number,
  callback: any
) => {
  get(
    `channels/viewcount/get?channelId=${channelId}`,
    callback
  );
};

const increaseViewCountForChannel = (
  channelId: number,
  callback: any
) => {
  post(
    "channels/viewcount/add",
    { channelId: channelId},
    callback
  );
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
  addInvitedMembersToChannel,
  getInvitedMembersForChannel,
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
  sendTalkApplicationEmail,
  deleteAgora,
  /////////////////////
  // membership methods
  /////////////////////
  applyMembership,
  acceptMembershipApplication,
  cancelMembershipApplication,
  getMembershipApplications,
  getViewCountForChannel,
  increaseViewCountForChannel
};
