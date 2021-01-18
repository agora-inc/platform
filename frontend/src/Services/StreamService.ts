import { baseApiUrl } from "../config";
import axios from "axios";
import { Tag } from "./TagService";
import { ArtService } from "./ArtService";
import { get, post } from "../Middleware/httpMiddleware";


const getAllStreams = (limit: number, offset: number, callback: any) => {
  axios
    .get(`${baseApiUrl}/streams/all?limit=${limit}&offset=${offset}`, {
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
  // const imageUrl = ArtService.generateRandomArt(200, 278);
  axios
    .post(
      baseApiUrl + "/streams/create",
      {
        channelId: channelId,
        channelName: channelName,
        streamName: streamName,
        streamDescription: streamDescription,
        streamTags: streamTags,
        imageUrl: "",
      },
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

const getToken = (
    channelName: string, 
    roleAttendee: number,
    expireTimeInSec: number,
    userAccount: any,
    uid: any,
    callback: any) => {
      let url = "";
      if (userAccount){
        url = `tokens/streaming?channel_name=${channelName}&role_attendee=${roleAttendee}&expire_time_in_sec=${expireTimeInSec}&user_account=${userAccount}`
      }
      else if (uid){
        url = `tokens/streaming?channel_name=${channelName}&role_attendee=${roleAttendee}&expire_time_in_sec=${expireTimeInSec}&uid=${uid}`
      }
      get(url, callback);
};



export const StreamService = {
  getToken,
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
  has_avatar: boolean;
};
