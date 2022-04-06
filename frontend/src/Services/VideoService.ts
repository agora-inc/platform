import { get, post } from "../Middleware/httpMiddleware";

import { Tag } from "./TagService";

const getAllVideos = (limit: number, offset: number, callback: any) => {
  get(`videos/all?limit=${limit}&offset=${offset}`, "", callback);
};

const getRecentVideos = (callback: any) => {
  get("videos/recent", "", callback);
};

const getAllVideosForChannel = (
  channelId: number,
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `videos/channel?channelId=${channelId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getAllVideosWithTag = (
  tagName: string,
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `videos/tag?tagName=${tagName}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getVideoById = (id: number, callback: any) => {
  get(`videos/video?id=${id}`, "", callback);
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
  channel_colour: string;
  name: string;
  description: string;
  tags: Tag[];
  image_url: string;
  date: Date;
  views: number;
  url: string;
  chat_id: number;
  has_avatar: boolean;
};
