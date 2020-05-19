import { baseApiUrl } from "../config";
import axios from "axios";

const getAllScheduledStreams = (callback: any) => {
  axios
    .get(baseApiUrl + "/streams/scheduled/all", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
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

const scheduleStream = (
  channelId: number,
  channelName: string,
  streamName: string,
  streamDescription: string,
  streamDate: string,
  // streamTags: Tag[],
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
        streamDate: streamDate,
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

export const ScheduledStreamService = {
  getAllScheduledStreams,
  getScheduledStreamsForChannel,
  scheduleStream,
};

export type ScheduledStream = {
  id: number;
  channel_id: number;
  channel_name: string;
  name: string;
  date: string;
  description: string;
};
