import { baseApiUrl } from "../config";
import axios from "axios";
import { Tag } from "./TagService";
import { ArtService } from "./ArtService";

const getAllStreams = (callback: any) => {
  axios
    .get(baseApiUrl + "/streams/all", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getStreamsForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/streams/channel?channelId=" + channelId, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getStreamById = (id: number, callback: any) => {
  axios
    .get(baseApiUrl + "/streams/stream?id=" + id.toString(), {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const createStream = (
  channelId: number,
  channelName: string,
  streamName: string,
  streamDescription: string,
  streamTags: Tag[],
  callback: any
) => {
  const imageUrl = ArtService.generateRandomArt(200, 278);
  axios
    .post(
      baseApiUrl + "/streams/create",
      {
        channelId: channelId,
        channelName: channelName,
        streamName: streamName,
        streamDescription: streamDescription,
        streamTags: streamTags,
        imageUrl: imageUrl,
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

const archiveStream = (streamId: number, del: boolean, callback: any) => {
  axios
    .post(
      baseApiUrl + "/streams/archive",
      {
        streamId: streamId,
        delete: del,
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
  getAllStreams,
  getStreamsForChannel,
  getStreamById,
  createStream,
  archiveStream,
};

export type Stream = {
  id: number;
  channel_id: number;
  channel_name: string;
  name: string;
  description: string;
  from_url: string;
  to_url: string;
  tags: Tag[];
};
