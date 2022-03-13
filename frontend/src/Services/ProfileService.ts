import { baseApiUrl } from "../config";
import axios from "axios";
import { get, post } from "../Middleware/httpMiddleware";
import { Topic } from "./TopicService";
import { User } from "./UserService";


const getAllNonEmptyProfiles = (
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `profiles/nonempty?limit=${limit}&offset=${offset}`,
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

const getPresentations = (userId: number, callback: any) => {
  get(`profiles/presentations/id=${userId}`, callback);
}

const createProfile = (userId: number, fullName: string, callback: any) => {
  post(
    "profiles/create",
    {
      user_id: userId,
      full_name: fullName,
    },
    callback
  )
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

const updateTopics = (userId: number, topicsId: (number | null)[], callback: any) => {
  axios
    .post(
      baseApiUrl + `/profiles/topics/update`,
      {
        user_id: userId,
        topicsId: topicsId,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback("ok");
    })
    .catch(function (error) {
      callback(error.response.data);
    });
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

const updatePresentation = (userId: number, presentation: Presentation, now: string, callback: any) => {
  post(
    "profiles/presentations/update",
    {
      user_id: userId,
      presentation: presentation,
      now: now,
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

const deletePresentation = (presentation_id: number, callback: any) => {
  post(
    "profiles/presentations/delete",
    {
      presentation_id: presentation_id,
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

const sendTalkInvitation = (invitingUserid: number, invitedUserid: number, channelId: number, date: string, message: string, contactEmail: string, talk_name: string, callback: any) => {
  post(
    "profiles/invitation/speaker",
    {
      inviting_user_id: invitingUserid,
      invited_user_id: invitedUserid,
      channel_id: channelId,
      date: date,
      message: message,
      contact_email: contactEmail,
      presentation_name: talk_name
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

const getProfilePhotoUrl = (userId: number, cacheDelay?: number, callback?: any) => {
  // check if user has profile_pic
  var pictureEndpoint = baseApiUrl + `/profiles/photo?userId=${userId}`
  getProfile(userId, (profile: Profile) => {
    if(!profile.has_photo){
      pictureEndpoint = pictureEndpoint  + "&defaultPic=true";
    }
    if (cacheDelay) {
      pictureEndpoint = pictureEndpoint  + "&ts=" + cacheDelay;
    }
    callback(pictureEndpoint)
  })
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
  has_photo: number;
  open_give_talk: boolean; 
  topics: Topic[];
  tags: string[];
  papers: Paper[];
  presentations: Presentation[];
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

export type Presentation = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  link: string;
  duration: number;
  date_created: string;
}

export const ProfileService = {
  // PROFILE MANAGEMENT
  getAllNonEmptyProfiles,
  getPublicProfilesByTopicRecursive,
  getProfile,
  createProfile,
  updateDetails,
  updateTopics,
  updateBio,
  uploadProfilePhoto,
  getProfilePhotoUrl,
  removeProfilePhoto,
  updatePaper,
  deletePaper,
  getPresentations,
  updatePresentation,
  deletePresentation,
  getTags,
  updateTags,

  // COMMUNICATIONS
  sendTalkInvitation,
};
