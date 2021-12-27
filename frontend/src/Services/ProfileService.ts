import { baseApiUrl } from "../config";
import axios from "axios";
import { get, post } from "../Middleware/httpMiddleware";
import { Topic } from "./TopicService";
import { User } from "./UserService";


const getAllPublicProfiles = (
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `profiles/public?limit=${limit}&offset=${offset}`,
    callback
  );
};

const getPublicProfilesByTopicRecursive = (
  topicId: number,
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `profiles/public/topic?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    callback
  );
};

const getProfile = (userId: number, callback: any) => {
  get(`profiles/profile?id=${userId}`, callback);
}

const updateProfile = (
  userId: number,
  open_give_talk: boolean,
  twitter_handle: string,
  google_scholar_link: string,
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
      google_scholar_link: google_scholar_link,
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

const updateDetails = (userId: number, dbKey: string, value: string, callback: any) => {
  post(
    "profiles/details/update",
    {
      user_id: userId,
      dbKey: dbKey,
      value: value,
    },
    callback
  )
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

const updateBio = (userId: number, bio: string, callback: any) => {
  post(
    "profiles/bio/update",
    {
      user_id: userId,
      bio: bio,
    },
    callback
  );
}

const deletePaper = (paper_id: number, callback: any) => {
  post(
    "profiles/papers/delete",
    {
      paper_id: paper_id,
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

const uploadProfilePhoto = (userId: number, image: File, callback: any) => {
  const data = new FormData();
  data.append("userId", userId.toString());
  data.append("image", image);

  axios.post(baseApiUrl + "/profiles/photo", data,       {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then(function (response) {
    callback(response.data);
  });
};

const getProfilePhoto = (userId: number, cacheDelay?: number) => {
  if (cacheDelay) {
    return baseApiUrl + `/profiles/photo?userId=${userId}&ts=` + cacheDelay;
  } else {
    return baseApiUrl + `/profiles/photo?userId=${userId}`;
  }
};

const removeProfilePhoto = (userId: number, callback: any) => {
  axios
    .delete(
      baseApiUrl + "/profiles/photo", {
        data: {userId: userId},
        headers: {"Access-Control-Allow-Origin": "*"},
    },)
    .then(function (response) {
      callback(response.data);
    });
}

export type Profile = {
  user: User;
  full_name: string;
  has_photo: boolean;
  open_give_talk: boolean; 
  topics: Topic[];
  tags: string[];
  papers: Paper[];
  twitter_handle?: string;
  google_scholar_link?: string;
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
  getPublicProfilesByTopicRecursive,
  getProfile,
  updateProfile,
  updateDetails,
  updateBio,
  uploadProfilePhoto,
  getProfilePhoto,
  removeProfilePhoto,
  getPapers,
  updatePaper,
  deletePaper, 
  getTags,
  updateTags,
};
