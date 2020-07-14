import { baseApiUrl } from "../config";
import { Tag } from "./TagService";
import { ArtService } from "./ArtService";
import axios from "axios";
import { Topic } from "../Services/TopicService";

const getAllFutureTalks = (limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/talks/all/future?limit=${limit}&offset=${offset}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getAllCurrentTalks = (limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/talks/all/current?limit=${limit}&offset=${offset}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getAllPastTalks = (limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/talks/all/past?limit=${limit}&offset=${offset}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getFutureTalksForTopic = (topicId: number, limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/talks/topic/future?topicId=${topicId}&limit=${limit}&offset=${offset}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getAllFutureTalksForTopicWithChildren = (limit: number, offset: number, topicId: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/talks/topic/children/future?topicId=${topicId}&limit=${limit}&offset=${offset}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getPastTalksForTopic = (topicId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/talks/topic/past?topicId=" + topicId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getFutureTalksForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/talks/channel/future?channelId=" + channelId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getPastTalksForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/talks/channel/past?channelId=" + channelId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getPastTalksForTag = (tagName: string, callback: any) => {
  axios
    .get(baseApiUrl + "/talks/tag/past?tagName=" + tagName, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
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
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/talks/edit",
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
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
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
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/talks/create",
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
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    })
    .catch(function (error) {
      callback(false);
    });
};

const deleteTalk = (id: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/talks/delete",
      {
        id: id,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const addRecordingLink = (id: number, link: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/talks/add-recording",
      {
        talkId: id,
        link: link,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const isRegisteredForTalk = (talkId: number, userId: number, callback: any) => {
  axios
    .get(baseApiUrl + `/talks/isregistered?talkId=${talkId}&userId=${userId}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data.is_registered);
    });
};

const registerForTalk = (talkId: number, userId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/talks/register",
      {
        talkId: talkId,
        userId: userId,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const unRegisterForTalk = (talkId: number, userId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/talks/unregister",
      {
        talkId: talkId,
        userId: userId,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const getRegisteredTalksForUser = (userId: number, callback: any) => {
  axios
    .get(baseApiUrl + `/talks/registered?userId=${userId}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const saveTalk = (userId: number, talkId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/talks/save",
      {
        talkId: talkId,
        userId: userId,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const unsaveTalk = (userId: number, talkId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/talks/unsave",
      {
        talkId: talkId,
        userId: userId,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const getSavedTalksForUser = (userId: number, callback: any) => {
  axios
    .get(baseApiUrl + `/talks/saved?userId=${userId}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const isSaved = (userId: number, talkId: number, callback: any) => {
  axios
    .get(baseApiUrl + `/talks/issaved?talkId=${talkId}&userId=${userId}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data.is_saved);
    });
};

const getYoutubeThumbnail = (url: string | null, id: number) => {
  if (!url || !url.includes("youtube")) {
    // return ArtService.generateRandomArt(150, 350, id);
    return "";
  }
  const ytId = url.split("&")[0].split("=")[1];
  return `https://img.youtube.com/vi/${ytId}/0.jpg`;
};

const isAvailableToUser = (userId: number, talkId: number, callback: any) => {
  axios
    .get(baseApiUrl + `/talks/isavailable?talkId=${talkId}&userId=${userId}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

export const TalkService = {
  getAllFutureTalks,
  getAllCurrentTalks,
  getAllPastTalks,
  getFutureTalksForChannel,
  getPastTalksForChannel,
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
};
