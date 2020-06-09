import { baseApiUrl } from "../config";
import { Tag } from "./TagService";
import { ArtService } from "./ArtService";
import axios from "axios";

const getAllFutureScheduledStreams = (
  limit: number,
  offset: number,
  callback: any
) => {
  axios
    .get(
      `${baseApiUrl}/streams/scheduled/all/future?limit=${limit}&offset=${offset}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getAllPastScheduledStreams = (
  limit: number,
  offset: number,
  callback: any
) => {
  axios
    .get(
      `${baseApiUrl}/streams/scheduled/all/past?limit=${limit}&offset=${offset}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getFutureScheduledStreamsForChannel = (
  channelId: number,
  callback: any
) => {
  axios
    .get(
      baseApiUrl + "/streams/scheduled/channel/future?channelId=" + channelId,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getPastScheduledStreamsForChannel = (
  channelId: number,
  callback: any
) => {
  axios
    .get(
      baseApiUrl + "/streams/scheduled/channel/past?channelId=" + channelId,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getPastScheduledStreamsForTag = (tagName: string, callback: any) => {
  axios
    .get(baseApiUrl + "/streams/scheduled/tag/past?tagName=" + tagName, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const editScheduledStream = (
  streamId: number,
  streamName: string,
  streamDescription: string,
  startDate: string,
  endDate: string,
  streamLink: string,
  streamTags: Tag[],
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/streams/scheduled/edit",
      {
        streamId: streamId,
        streamName: streamName,
        streamDescription: streamDescription,
        startDate: startDate,
        endDate: endDate,
        streamLink: streamLink,
        streamTags: streamTags,
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

const scheduleStream = (
  channelId: number,
  channelName: string,
  streamName: string,
  streamDescription: string,
  startDate: string,
  endDate: string,
  streamLink: string,
  streamTags: Tag[],
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/streams/scheduled/create",
      {
        channelId: channelId,
        channelName: channelName,
        streamName: streamName,
        streamDescription: streamDescription,
        startDate: startDate,
        endDate: endDate,
        streamLink: streamLink,
        streamTags: streamTags,
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

const deleteScheduledStream = (id: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/streams/scheduled/delete",
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
      baseApiUrl + "/streams/scheduled/add-recording",
      {
        streamId: id,
        link: link,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const isRegisteredForScheduledStream = (
  streamId: number,
  userId: number,
  callback: any
) => {
  axios
    .get(
      baseApiUrl +
        `/streams/scheduled/isregistered?streamId=${streamId}&userId=${userId}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data.is_registered);
    });
};

const registerForScheduledStream = (
  streamId: number,
  userId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/streams/scheduled/register",
      {
        streamId: streamId,
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

const unRegisterForScheduledStream = (
  streamId: number,
  userId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/streams/scheduled/unregister",
      {
        streamId: streamId,
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

const getScheduledStreamsForUser = (userId: number, callback: any) => {
  axios
    .get(baseApiUrl + `/streams/scheduled/foruser?userId=${userId}`, {
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

export const ScheduledStreamService = {
  getAllFutureScheduledStreams,
  getAllPastScheduledStreams,
  getFutureScheduledStreamsForChannel,
  getPastScheduledStreamsForChannel,
  getPastScheduledStreamsForTag,
  editScheduledStream,
  scheduleStream,
  deleteScheduledStream,
  addRecordingLink,
  isRegisteredForScheduledStream,
  registerForScheduledStream,
  unRegisterForScheduledStream,
  getScheduledStreamsForUser,
  getYoutubeThumbnail,
};

export type ScheduledStream = {
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
