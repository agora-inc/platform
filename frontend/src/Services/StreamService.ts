import { baseApiUrl } from "../config";
import axios from "axios";
import { Tag } from "./TagService";

const createStream = (
  channelId: number,
  channelName: string,
  streamName: string,
  streamDescription: string,
  streamTags: Tag[],
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/streams/create",
      {
        channelId: channelId,
        channelName: channelName,
        streamName: streamName,
        streamDescription: streamDescription,
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

const archiveStream = (streamId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/streams/archive",
      {
        streamId: streamId,
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

export const StreamService = {
  createStream,
  archiveStream,
};

export type Stream = {
  id: number;
  channel_id: number;
  channel_name: string;
  name: string;
};
