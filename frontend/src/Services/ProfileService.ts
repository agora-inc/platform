import { baseApiUrl } from "../config";
import axios from "axios";
import { get, post } from "../Middleware/httpMiddleware";
import { Topic } from "./TopicService";
import { User } from "./UserService";


const getAllPublicProfiles = (callback: any) => {
  axios
    .get(baseApiUrl + "/profiles/public")
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => console.error(error));
};

const getProfile = (userId: number, callback: any) => {
  get(`profiles/profile?id=${userId}`, callback);
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
    "profiles/update",
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
  get(`profiles/papers/id=${userId}`, callback);
}

const updatePaper = (userId: number, paper: Paper, callback: any) => {
  post(
    "profiles/papers/update",
    {
      user_id: userId,
      paper: paper,
    },
    callback
  );
}

const getTags = (userId: number, callback: any) => {
  get(`profiles/tags/id=${userId}`, callback);
}

const updateTags = (userId: number, tags: string[], callback: any) => {
  post(
    "profiles/tags/update",
    {
      user_id: userId,
      tags: tags,
    },
    callback
  );
}

export type Profile = {
  user: User;
  full_name: string;
  has_photo: boolean;
  open_give_talk: boolean; 
  topics: Topic[];
  tags: string[];
  papers: Paper[];
  twitter_handle?: string
};

export type Paper = {
  id: number;
  title: string;
  authors: string;
  publisher: string;
  link: string;
  year: string;
}

export const ProfileService = {
  getAllPublicProfiles,
  getProfile,
  updateProfile,
  getPapers,
  updatePaper,
  getTags,
  updateTags,
};
