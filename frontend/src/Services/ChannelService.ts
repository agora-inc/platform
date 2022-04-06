import { baseApiUrl } from "../config";
import { Topic } from "../Services/TopicService";
import { get, post, del } from "../Middleware/httpMiddleware";

const getAllChannels = (limit: number, offset: number, callback: any) => {
  get(`channels/all?limit=${limit}&offset=${offset}`, "", callback);
};

const getTrendingChannels = (callback: any) => {
  get("channels/trending", "", callback);
};

const getChannelByName = (name: string, callback: any) => {
  get(`channels/channel?name=${name}`, "", callback);
};

const getChannelById = (id: number, callback: any) => {
  get(`channels/channel?id=${id}`, "", callback);
};

const createChannel = (
  name: string,
  description: string,
  userId: number,
  callback: any,
  topics: Topic[],
  token: string
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
    {
      name: name,
      description: description,
      userId: userId,
      topic1Id: topics.length > 0 ? topics[0].id : null,
    },
    token,
    callback
  );
};

const addToMailingList = (
  channelId: number,
  emails: string[],
  callback: any,
  token: string
) => {
  post(
    "/channels/mailinglist/add",
    { channelId: channelId, emails: emails },
    token,
    () => {
      callback("ok");
    }
  );
};

const getMailingList = (channelId: number, callback: any, token: string) => {
  get(`channels/mailinglist?channelId=${channelId}`, token, callback);
};

const removeFromMailingList = (
  channelId: number,
  emails: string[],
  callback: any
) => {};

const addInvitedMembersToChannel = (
  channelId: number,
  emails: string[],
  callback: any,
  token: string
) => {
  post(
    "/channels/invite/add/member",
    { channelId: channelId, emails: emails },
    token,
    () => {
      callback("ok");
    }
  );
};

const addFollowingMembersToChannel = (
  channelId: number,
  emails: string[],
  callback: any,
  token: string
) => {
  post(
    "/channels/invite/add/follower",
    { channelId: channelId, emails: emails },
    token,
    () => {
      callback("ok");
    }
  );
};

const getInvitedMembersForChannel = (
  channelId: number,
  callback: any,
  token: string
) => {
  get(`channels/invite?channelId=${channelId}`, token, callback);
};

const getChannelsForUser = (
  userId: number,
  roles: string[],
  callback: any,
  token: string
) => {
  get(
    `channels/foruser?userId=${userId}&role=${roles.reduce(
      (acc, curr) => acc + `&role=${curr}`
    )}`,
    token,
    callback
  );
};

const getUsersForChannel = (
  channelId: number,
  roles: string[],
  callback: any,
  token: string
) => {
  get(
    `channels/users?channelId=${channelId}&role=${roles.reduce(
      (acc, curr) => acc + `&role=${curr}`
    )}`,
    token,
    callback
  );
};

const getContactAddresses = (
  // Query list of contact addresses from DB
  channelId: number,
  callback: any
) => {
  get(`channels/contacts?channelId=${channelId}`, "", callback);
};

const addContactAddress = (
  channelId: number,
  contactAddress: string,
  userId: number,
  callback: any,
  token: string
) => {
  post(
    `channels/contact/add?channelId=${channelId}&contactAddress=${contactAddress}&userId=${userId}`,
    { contactAddress: contactAddress, channelId: channelId, userId: userId },
    token,
    callback
  );
};

const removeContactAddress = (
  // TODO: make this into a delete request
  channelId: number,
  contactAddress: string,
  userId: number,
  callback: any,
  token: string
) => {
  get(
    `/channels/contact/delete?channelId=${channelId}&contactAddress=${contactAddress}&userId=${userId}`,
    token,
    callback
  );
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
  post(
    "/channel/apply/talk",
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
    "",
    () => {
      callback(true);
    },
    () => {
      callback(false);
    }
  );
};

const getRoleInChannel = (
  userId: number,
  channelId: number,
  callback: any,
  token: string
) => {
  get(
    `channels/user/role?channelId=${channelId}&userId=${userId}`,
    token,
    callback
  );
};

const addUserToChannel = (
  userId: number,
  channelId: number,
  role: string,
  callback: any,
  token: string
) => {
  post(
    "channels/users/add",
    { userId: userId, channelId: channelId, role: role },
    token,
    callback
  );
};

// TODO: make DELETE request
const removeUserFromChannel = (
  userId: number,
  channelId: number,
  callback: any,
  token: string
) => {
  post(
    "channels/users/remove",
    { userId: userId, channelId: channelId },
    token,
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
  get(`channels/followercount?channelId=${channelId}`, "", callback);
};

const updateChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any,
  token: string
) => {
  post(
    "channels/updatedescription",
    { channelId: channelId, newDescription: newDescription },
    token,
    callback
  );
};

const updateLongChannelDescription = (
  channelId: number,
  newDescription: string,
  callback: any,
  token: string
) => {
  post(
    "channels/updatelongdescription",
    { channelId: channelId, newDescription: newDescription },
    token,
    callback
  );
};

const updateChannelColour = (
  channelId: number,
  newColour: string,
  callback: any,
  token: string
) => {
  post(
    "channels/updatecolour",
    { channelId: channelId, newColour: newColour },
    token,
    callback
  );
};

const uploadAvatar = (
  channelId: number,
  image: File,
  callback: any,
  token: string
) => {
  const data = new FormData();
  data.append("channelId", channelId.toString());
  data.append("image", image);
  let current_time = Math.floor(new Date().getTime() / 5000);
  post("/channels/avatar?ts=" + current_time, data, token, callback);
};

const getAvatar = (channelId: number, cacheDelay?: number) => {
  // HACK: we had the ts argument to prevent from caching.
  if (cacheDelay) {
    let current_time = Math.floor(new Date().getTime() / 1000) * cacheDelay;
    return (
      baseApiUrl + `/channels/avatar?channelId=${channelId}&ts=` + current_time
    );
  } else {
    return baseApiUrl + `/channels/avatar?channelId=${channelId}`;
  }
};

const uploadCover = (
  channelId: number,
  image: File,
  callback: any,
  token: string
) => {
  const data = new FormData();
  data.append("channelId", channelId.toString());
  data.append("image", image);
  post("/channels/cover", data, token, callback);
};

const getCover = (channelId: number, cacheDelay?: number) => {
  if (cacheDelay) {
    return (
      baseApiUrl + `/channels/cover?channelId=${channelId}&ts=` + cacheDelay
    );
  } else {
    return baseApiUrl + `/channels/cover?channelId=${channelId}`;
  }
};

const getDefaultCover = () => {
  return baseApiUrl + `/channels/cover?default=1`;
};

const removeCover = (channelId: number, callback: any, token: string) => {
  del(
    "/channels/cover",
    {
      channelId: channelId,
    },
    token,
    callback
  );
};

// TODO: make delete request
const deleteAgora = (id: number, callback: any, token: string) => {
  post("channels/delete", { id }, token, callback);
};

////////////////////////
// Channel Topic methods
////////////////////////

const editChannelTopic = (
  channelId: Number,
  topics: Topic[],
  callback: any,
  token: string
) => {
  post(
    "/channel/edit/topic",
    {
      channelId: channelId,
      topic1Id: topics.length > 0 ? topics[0].id : null,
      topic2Id: topics.length > 1 ? topics[1].id : null,
      topic3Id: topics.length > 2 ? topics[2].id : null,
    },
    token,
    callback
  );
};

const getChannelTopic = (channelId: Number, callback: any) => {
  get(`channels/topics/fetch?channelId=${channelId}`, "", callback);
};

const getChannelsWithTopic = (
  limit: number,
  topicId: number,
  offset: number,
  callback: any
) => {
  get(
    `channels/topics/all?limit=${limit}&topicId=${topicId}&offset=${offset}`,
    "",
    callback
  );
};

/*const getChannelTopic = (channelId: number) => {
  return baseApiUrl + `channels/topics/fetch?channelId=${channelId}`;
};*/

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
  callback: any,
  token: string
) => {
  post(
    "channel/membership/apply",
    {
      id: id,
      userId: userId,
      fullName: fullName,
      position: position,
      institution: institution,
      email: email,
      personalHomepage: personalHomepage,
    },
    token,
    callback
  );
};

const cancelMembershipApplication = (
  id: number,
  userId: number,
  callback: any,
  token: string
) => {
  post(
    "channel/membership/cancel",
    {
      id: id,
      userId: userId,
    },
    token,
    callback
  );
};

const acceptMembershipApplication = (
  id: number,
  userId: number,
  callback: any,
  token: string
) => {
  post(
    "channel/membership/accept",
    {
      id: id,
      userId: userId,
    },
    token,
    callback
  );
};

const getMembershipApplications = (
  channelId: number,
  callback: any,
  token: string,
  userId?: number
) => {
  if (userId === undefined) {
    get(`channel/membership/list?channelId=${channelId}`, token, callback);
  } else {
    get(
      `channel/membership/list?channelId=${channelId}&userId=${userId}`,
      token,
      callback
    );
  }
};

const getViewCountForChannel = (channelId: number, callback: any) => {
  get(`channels/viewcount/get?channelId=${channelId}`, "", callback);
};

const increaseViewCountForChannel = (channelId: number, callback: any) => {
  post("channels/viewcount/add", { channelId: channelId }, "", callback);
};

const getReferralsForChannel = (channelId: number, callback: any) => {
  get(`channels/referralscount/get?channelId=${channelId}`, "", callback);
};

export type Channel = {
  id: number;
  name: string;
  description: string;
  long_description: string;
  colour: string;
  has_avatar: boolean;
  has_cover: boolean;
  topics: Topic[];
};

export const ChannelService = {
  getAllChannels,
  getTrendingChannels,
  getChannelById,
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
  sendTalkApplicationEmail,
  deleteAgora,
  ///////////////////////
  // Mailing List methods
  ///////////////////////
  addToMailingList,
  getMailingList,
  removeFromMailingList,
  addInvitedMembersToChannel,
  getInvitedMembersForChannel,
  ////////////////////////
  // Channel Topic methods
  ////////////////////////
  editChannelTopic,
  getChannelTopic,
  getChannelsWithTopic,
  /////////////////////////
  // Follower method
  ////////////////////////
  addFollowingMembersToChannel,
  /////////////////////
  // membership methods
  /////////////////////
  applyMembership,
  acceptMembershipApplication,
  cancelMembershipApplication,
  getMembershipApplications,
  getViewCountForChannel,
  increaseViewCountForChannel,
  getReferralsForChannel,
};
