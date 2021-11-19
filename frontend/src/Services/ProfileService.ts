import { baseApiUrl } from "../config";
import axios from "axios";
import { get, post } from "../Middleware/httpMiddleware";
import { Topic } from "./TopicService";
import { User } from "./UserService";

const getAllPublicProfiles = (callback: any) => {
  get(`profile/public`, callback);
}

const getProfile = (userId: number, callback: any) => {
  get(`profile/id=${userId}`, callback);
}

const updateProfile = (
  userId: number,
  open_give_talk: boolean,
  twitter_handle: string,
  topic_id_1: number,
  topic_id_2: number,
  topic_id_3: number,
  callback: any,
) => {
  post(
    "profile/update",
    {
      user_id: userId,
      open_give_talk: open_give_talk,
      twitter_handle: twitter_handle,
      topic_id_1: topic_id_1,
      topic_id_2: topic_id_2,
      topic_id_3: topic_id_3,
    },
    callback
  );
}

const getPapers = (userId: number, callback: any) => {
  get(`profile/papers/id=${userId}`, callback);
}

const updatePapers = (userId: number, papers: Paper[], callback: any) => {
  post(
    "profile/papers/update",
    {
      user_id: userId,
      papers: papers,
    },
    callback
  );
}

const getTags = (userId: number, callback: any) => {
  get(`profile/tags/id=${userId}`, callback);
}

const updateTags = (userId: number, tags: string[], callback: any) => {
  post(
    "profile/tags/update",
    {
      user_id: userId,
      tags: tags,
    },
    callback
  );
}

export type Profile = {
  user: User;
  has_photo: boolean;
  open_give_talk: boolean; 
  topics: Topic[];
  tags: string[];
  papers: string[];
  talks: string[];
  twitter_username: string
};

export type Paper = {
  title: string;
  authors: string;
  publisher: string;
  link: string;
  number: number;
}

export const ProfileService = {
  getAllPublicProfiles,
  getProfile,
  updateProfile,
  getPapers,
  updatePapers,
  getTags,
  updateTags,
};
