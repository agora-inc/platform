import { Tag } from "./TagService";
import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";
import { ChannelService } from "./ChannelService";
import { UserService} from "./UserService";


const getTalkById = (talkId: number, callback: any) => {
  get(`talk/info?id=${talkId}`, callback);
};

const getAllFutureTalks = (limit: number, offset: number, callback: any) => {
  get(`talks/all/future?limit=${limit}&offset=${offset}`, callback);
};

const getAllCurrentTalks = (limit: number, offset: number, callback: any) => {
  get(`talks/all/current?limit=${limit}&offset=${offset}`, callback);
};

const getAllPastTalks = (limit: number, offset: number, callback: any) => {
  get(`talks/all/past?limit=${limit}&offset=${offset}`, callback);
};

const getFutureTalksForTopic = (
  topicId: number,
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `talks/topic/future?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    callback
  );
};

const getAllFutureTalksForTopicWithChildren = (
  limit: number,
  offset: number,
  topicId: number,
  callback: any
) => {
  get(
    `talks/topic/children/future?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    callback
  );
};

const getPastTalksForTopic = (topicId: number, callback: any) => {
  get(`talks/topic/past?topicId=${topicId}`, callback);
};

const getFutureTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/future?channelId=${channelId}`, callback);
};

const getCurrentTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/current?channelId=${channelId}`, callback);
};

const getPastTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/past?channelId=${channelId}`, callback);
};

const getDraftedTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/drafted?channelId=${channelId}`, callback);
};

const getPastTalksForTag = (tagName: string, callback: any) => {
  get(`talks/tag/past?tagName=${tagName}`, callback);
};

const getAvailableFutureTalks = (
  limit: number,
  offset: number,
  userId: number | null,
  callback: any,
) => {
  get(
    `talks/available/future?userId=${userId}&limit=${limit}&offset=${offset}`,
    callback
  );
};

const getAvailableCurrentTalks = (
  limit: number,
  offset: number,
  userId: number | null,
  callback: any,
) => {
  get(
    `talks/available/current?userId=${userId}&limit=${limit}&offset=${offset}`,
    callback
  );
};

const getAvailablePastTalks = (
  limit: number,
  offset: number,
  userId: number | null,
  callback: any,
) => {
  get(
    `talks/available/past?userId=${userId}&limit=${limit}&offset=${offset}`,
    callback
  );
};

const getAvailableFutureTalksForChannel = (
  channelId: number,
  userId: number | null,
  callback: any,
) => {
  get(
    `talks/channel/available/future?channelId=${channelId}&userId=${userId}`,
    callback
  );
};

const getAvailableCurrentTalksForChannel = (
  channelId: number,
  userId: number | null,
  callback: any,
) => {
  get(
    `talks/channel/available/current?channelId=${channelId}&userId=${userId}`,
    callback
  );
};

const getAvailablePastTalksForChannel = (
  channelId: number,
  userId: number | null,
  callback: any,
) => {
  get(
    `talks/channel/available/past?channelId=${channelId}&userId=${userId}`,
    callback
  );
};

const editTalk = (
  talkId: number,
  talkName: string,
  talkDescription: string,
  startDate: string,
  endDate: string,
  talkLink: string,
  talkTags: Tag[],
  showLinkOffset: number,
  visibility: string,
  cardVisibility: string,
  topics: Topic[],
  talkSpeaker: string,
  talkSpeakerURL: string,
  published: number,
  audienceLevel: string,
  callback: any
) => {
  post(
    "talks/edit",
    {
      talkId: talkId,
      talkName: talkName,
      talkDescription: talkDescription,
      startDate: startDate,
      endDate: endDate,
      talkLink: talkLink,
      talkTags: talkTags,
      showLinkOffset: showLinkOffset,
      visibility: visibility,
      cardVisibility: cardVisibility,
      topic1Id: topics[0] ? topics[0].id : 0,
      topic2Id: topics[1] ? topics[1].id : 0,
      topic3Id: topics[2] ? topics[2].id : 0,
      talkSpeaker: talkSpeaker,
      talkSpeakerURL: talkSpeakerURL,
      published: published,
      audienceLevel: audienceLevel
    },
    callback
  );
};

const scheduleTalk = (
  channelId: number,
  channelName: string,
  talkName: string,
  talkDescription: string,
  startDate: string,
  endDate: string,
  talkLink: string,
  talkTags: Tag[],
  showLinkOffset: number,
  visibility: string,
  cardVisibility: string,
  topics: Topic[],
  talkSpeaker: string,
  talkSpeakerURL: string,
  published: number,
  audienceLevel: string,
  callback: any
) => {
  post(
    "talks/create",
    {
      channelId: channelId,
      channelName: channelName,
      talkName: talkName,
      talkDescription: talkDescription,
      startDate: startDate,
      endDate: endDate,
      talkLink: talkLink,
      talkTags: talkTags,
      showLinkOffset: showLinkOffset,
      visibility: visibility,
      cardVisibility: cardVisibility,
      topic1Id: topics.length > 0 ? topics[0].id : null,
      topic2Id: topics.length > 1 ? topics[1].id : null,
      topic3Id: topics.length > 2 ? topics[2].id : null,
      talkSpeaker: talkSpeaker,
      talkSpeakerURL: talkSpeakerURL,
      published: published,
      audienceLevel: audienceLevel
    },
    callback
  );
};

const deleteTalk = (id: number, callback: any) => {
  post(
    "talks/delete",
    {
      id: id,
    },
    callback
  );
};

const addRecordingLink = (id: number, link: string, callback: any) => {
  post(
    "talks/add-recording",
    {
      talkId: id,
      link: link,
    },
    callback
  );
};

const registerForTalk = (
  talkId: number, 
  userId: any,
  name: string, 
  email: string,
  website: any, 
  institution: string, 
  callback: any) => {
  var now = new Date();
  var userHourOffset = - now.getTimezoneOffset() / 60;
  // (NOTE: userHourOffset=-3 if user browser is in GMT-3 right now)
  post(
    "talks/requestaccess/register",
    {
      talkId: talkId,
      userId: userId,
      name: name,
      email: email,
      website: website,
      institution: institution,
      userHourOffset: userHourOffset
    },
    callback
  );
};

const unRegisterForTalk = (talkId: number, userId: any, callback: any) => {
  post(
    "talks/requestaccess/unregister",
    {
      talkId: talkId,
      userId: userId,
    },
    callback
  );
};

const getRegisteredTalksForUser = (userId: number, callback: any) => {
  get(`talks/registered?userId=${userId}`, callback);
};
    

const registrationStatusForTalk = (talkId: number, userId: number, callback: any) => {
  get(`talks/registrationstatus?talkId=${talkId}&userId=${userId}`, callback);
};

const acceptTalkRegistration = (requestRegistrationId: number, callback: any) => {
  post(
    "talks/requestaccess/accept",
    {
      requestRegistrationId: requestRegistrationId,
    },
    callback
    );
  };
  
const refuseTalkRegistration = (requestRegistrationId: number, callback: any) => {
  post(
    "talks/requestaccess/refuse",
    {
      requestRegistrationId: requestRegistrationId,
    },
    callback
    );
  };

  const getTalkRegistrations = (talkId: any, channelId: any, userId: any, callback:any) => {
    // method must be called with either talkId OR channelId OR userId (only one of them). 
    let url = "";
    if (talkId !== null){
      url = `/talks/requestaccess/all?talkId=${talkId}`;
    } else if (channelId !== null){
      url = `/talks/requestaccess/all?channelId=${channelId}`;
    } else if (userId !== null){
      url = `/talks/requestaccess/all?userId=${userId}`;
    }
    get(url, callback);
  }

const saveTalk = (userId: number, talkId: number, callback: any) => {
  post(
    "talks/save",
    {
      talkId: talkId,
      userId: userId,
    },
    callback
  );
};

const unsaveTalk = (userId: number, talkId: number, callback: any) => {
  post(
    "talks/unsave",
    {
      talkId: talkId,
      userId: userId,
    },
    callback
  );
};

const getSavedTalksForUser = (userId: number, callback: any) => {
  get(`talks/saved?userId=${userId}`, callback);
};

const isSaved = (userId: number, talkId: number, callback: any) => {
  get(`talks/issaved?talkId=${talkId}&userId=${userId}`, callback);
};

const getYoutubeThumbnail = (url: string | null, id: number) => {
  if (url && url.includes("youtube")) {
    const ytId = url.split("&")[0].split("=")[1];
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;

  } else if (url && url.includes("youtu.be")) {
    const ytId = url.split("/").pop()
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;

  } else {
    return ""
  }
  
};

const isAvailableToUser = (userId: number, talkId: number, callback: any) => {
  get(`talks/isavailable?talkId=${talkId}&userId=${userId}`, callback);
};

const getViewCountForTalk = (
  talkId: number,
  callback: any
) => {
  get(
    `talks/viewcount/get?talkId=${talkId}`,
    callback
  );
};

const increaseViewCountForTalk = (
  channelId: number,
  callback: any
) => {
  post(
    "talks/viewcount/add",
    { channelId: channelId},
    callback
  );
};

const getTrendingTalks = (callback: any) => {
  get("talks/trending", callback);
};


const getUserRoleInTalk = (talkId: number, userId: number, callback: any) => {
  // query channelId


  //
} 


export const TalkService = {
  getTalkById,
  getAllFutureTalks,
  getAllCurrentTalks,
  getAllPastTalks,
  getFutureTalksForChannel,
  getCurrentTalksForChannel,
  getPastTalksForChannel,
  getDraftedTalksForChannel,
  getFutureTalksForTopic,
  getAllFutureTalksForTopicWithChildren,
  getPastTalksForTopic,
  getPastTalksForTag,
  getAvailableFutureTalks,
  getAvailableCurrentTalks,
  getAvailablePastTalks,
  getAvailableFutureTalksForChannel,
  getAvailableCurrentTalksForChannel,
  getAvailablePastTalksForChannel,
  editTalk,
  scheduleTalk,
  deleteTalk,
  addRecordingLink,
  saveTalk,
  unsaveTalk,
  getSavedTalksForUser,
  isSaved,
  getYoutubeThumbnail,
  isAvailableToUser,
  // talk registration management
  acceptTalkRegistration,
  refuseTalkRegistration,
  registerForTalk,
  unRegisterForTalk,
  registrationStatusForTalk,
  getTalkRegistrations,
  getRegisteredTalksForUser,
  // talk views
  increaseViewCountForTalk,
  getViewCountForTalk,
  // trending
  getTrendingTalks
};

export type Talk = {
  id: number;
  channel_id: number;
  channel_name: string;
  channel_colour: string;
  has_avatar: boolean;
  name: string;
  date: string;
  end_date: string;
  description: string;
  link: string;
  link_available?: boolean;
  recording_link: string;
  tags: Tag[];
  show_link_offset: number;
  visibility: string;
  card_visibility: string;
  topics: Topic[];
  talk_speaker: string;
  talk_speaker_url: string;
  published: number;
  audience_level: string
};
