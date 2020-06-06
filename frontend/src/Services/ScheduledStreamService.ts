import { baseApiUrl } from "../config";
import { Tag } from "./TagService";
import axios from "axios";

const getAllScheduledStreams = (
  limit: number,
  offset: number,
  callback: any
) => {
  axios
    .get(
      `${baseApiUrl}/streams/scheduled/all?limit=${limit}&offset=${offset}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
    .then(function (response) {
      callback(response.data);
    });
};

const getScheduledStreamsForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/streams/scheduled/channel?channelId=" + channelId, {
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

export const ScheduledStreamService = {
  getAllScheduledStreams,
  getScheduledStreamsForChannel,
  editScheduledStream,
  scheduleStream,
  isRegisteredForScheduledStream,
  registerForScheduledStream,
  unRegisterForScheduledStream,
  getScheduledStreamsForUser,
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
  tags: Tag[];
};
