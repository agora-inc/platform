import { Tag } from "./TagService";
import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";

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

const getPastTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/past?channelId=${channelId}`, callback);
};

const getDraftedTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/drafted?channelId=${channelId}`, callback);
};

const getPastTalksForTag = (tagName: string, callback: any) => {
  get(`talks/tag/past?tagName=${tagName}`, callback);
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
  topics: Topic[],
  talkSpeaker: string,
  talkSpeakerURL: string,
  published: boolean,
  callback: any
) => {
  console.log("PUBBB", published)
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
      topic1Id: topics[0] ? topics[0].id : 0,
      topic2Id: topics[1] ? topics[1].id : 0,
      topic3Id: topics[2] ? topics[2].id : 0,
      talkSpeaker: talkSpeaker,
      talkSpeakerURL: talkSpeakerURL,
      published: published ? 1 : 0,
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
  topics: Topic[],
  talkSpeaker: string,
  talkSpeakerURL: string,
  published: boolean,
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
      topic1Id: topics.length > 0 ? topics[0].id : null,
      topic2Id: topics.length > 1 ? topics[1].id : null,
      topic3Id: topics.length > 2 ? topics[2].id : null,
      talkSpeaker: talkSpeaker,
      talkSpeakerURL: talkSpeakerURL,
      published: published ? 1 : 0,
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

const isRegisteredForTalk = (talkId: number, userId: number, callback: any) => {
  get(`talks/isregistered?talkId=${talkId}&userId=${userId}`, callback);
};

const registerForTalk = (talkId: number, userId: number, callback: any) => {
  post(
    "talks/register",
    {
      talkId: talkId,
      userId: userId,
    },
    callback
  );
};

const unRegisterForTalk = (talkId: number, userId: number, callback: any) => {
  post(
    "talks/unregister",
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
  if (!url || !url.includes("youtube")) {
    return "";
  }
  const ytId = url.split("&")[0].split("=")[1];
  return `https://img.youtube.com/vi/${ytId}/0.jpg`;
};

const isAvailableToUser = (userId: number, talkId: number, callback: any) => {
  get(`talks/isavailable?talkId=${talkId}&userId=${userId}`, callback);
};

export const TalkService = {
  getAllFutureTalks,
  getAllCurrentTalks,
  getAllPastTalks,
  getFutureTalksForChannel,
  getPastTalksForChannel,
  getDraftedTalksForChannel,
  getFutureTalksForTopic,
  getAllFutureTalksForTopicWithChildren,
  getPastTalksForTopic,
  getPastTalksForTag,
  editTalk,
  scheduleTalk,
  deleteTalk,
  addRecordingLink,
  isRegisteredForTalk,
  registerForTalk,
  unRegisterForTalk,
  getRegisteredTalksForUser,
  saveTalk,
  unsaveTalk,
  getSavedTalksForUser,
  isSaved,
  getYoutubeThumbnail,
  isAvailableToUser,
};

export type Talk = {
  id: number;
  channel_id: number;
  channel_name: string;
  channel_colour: string;
  name: string;
  date: string;
  end_date: string;
  description: string;
  has_avatar: boolean;
  link: string;
  recording_link: string;
  tags: Tag[];
  show_link_offset: number;
  visibility: string;
  topics: Topic[];
  talk_speaker: string;
  talk_speaker_url: string;
  published: boolean
};
