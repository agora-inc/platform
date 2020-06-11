import { baseApiUrl } from "../config";
import { Tag } from "./TagService";
import { ArtService } from "./ArtService";
import axios from "axios";

const getAllFutureTalks = (limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/talks/all/future?limit=${limit}&offset=${offset}`, {
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

const getYoutubeThumbnail = (url: string | null, id: number) => {
  if (!url || !url.includes("youtube")) {
    // return ArtService.generateRandomArt(150, 350, id);
    return "";
  }
  const ytId = url.split("&")[0].split("=")[1];
  return `https://img.youtube.com/vi/${ytId}/0.jpg`;
};

export const TalkService = {
  getAllFutureTalks,
  getAllPastTalks,
  getFutureTalksForChannel,
  getPastTalksForChannel,
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
  getYoutubeThumbnail,
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
};
