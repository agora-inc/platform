import { baseApiUrl } from "../config";
import axios from "axios";
import { Tag } from "./TagService";

const getAllVideos = (callback: any) => {
  axios
    .get(baseApiUrl + "/videos/all", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getRecentVideos = (callback: any) => {
  axios
    .get(baseApiUrl + "/videos/recent", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getAllVideosForChannel = (channelId: number, callback: any) => {
  axios
    .get(baseApiUrl + "/videos/channel?channelId=" + channelId.toString(), {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getAllVideosWithTag = (tagName: string, callback: any) => {
  axios
    .get(baseApiUrl + "/videos/tag?tagName=" + tagName, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

const getVideoById = (id: number, callback: any) => {
  axios
    .get(baseApiUrl + "/videos/video?id=" + id.toString(), {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
};

export const VideoService = {
  getAllVideos,
  getRecentVideos,
  getAllVideosForChannel,
  getAllVideosWithTag,
  getVideoById,
};

export type Video = {
  id: number;
  channel_id: number;
  channel_name: string;
  name: string;
  description: string;
  tags: Tag[];
  image_url: string;
  date: Date;
  views: number;
};
