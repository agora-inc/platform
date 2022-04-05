import { baseApiUrl } from "../config";
import { get, post, del } from "../Middleware/httpMiddleware";
import { Topic } from "./TopicService";
import { User } from "./UserService";

const getAllNonEmptyProfiles = (
  limit: number,
  offset: number,
  callback: any
) => {
  get(`profiles/nonempty?limit=${limit}&offset=${offset}`, "", callback);
};

const getPublicProfilesByTopicRecursive = (
  topicId: number,
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `profiles/public/topic?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getProfile = (userId: number, callback: any) => {
  get(`profiles/profile?id=${userId}`, "", callback);
};

const getPresentations = (userId: number, callback: any) => {
  get(`profiles/presentations/id=${userId}`, "", callback);
};

const createProfile = (
  userId: number,
  fullName: string,
  callback: any,
  token: string
) => {
  post(
    "profiles/create",
    {
      user_id: userId,
      full_name: fullName,
    },
    token,
    callback
  );
};

const updateDetails = (
  userId: number,
  dbKey: string,
  value: string,
  callback: any,
  token: string
) => {
  post(
    "profiles/details/update",
    {
      user_id: userId,
      dbKey: dbKey,
      value: value,
    },
    token,
    callback
  );
};

const updateTopics = (
  userId: number,
  topicsId: (number | null)[],
  callback: any,
  token: string
) => {
  post(
    "/profiles/topics/update",
    {
      user_id: userId,
      topicsId: topicsId,
    },
    token,
    () => {
      callback("ok");
    },
    (err: any) => {
      callback(err.response.data);
    }
  );
};

const updatePaper = (
  userId: number,
  paper: Paper,
  callback: any,
  token: string
) => {
  post(
    "profiles/papers/update",
    {
      user_id: userId,
      paper: paper,
    },
    token,
    callback
  );
};

const updatePresentation = (
  userId: number,
  presentation: Presentation,
  now: string,
  callback: any,
  token: string
) => {
  post(
    "profiles/presentations/update",
    {
      user_id: userId,
      presentation: presentation,
      now: now,
    },
    token,
    callback
  );
};

const updateBio = (
  userId: number,
  bio: string,
  callback: any,
  token: string
) => {
  post(
    "profiles/bio/update",
    {
      user_id: userId,
      bio: bio,
    },
    token,
    callback
  );
};

// TODO: make delete request
const deletePaper = (paper_id: number, callback: any, token: string) => {
  post(
    "profiles/papers/delete",
    {
      paper_id: paper_id,
    },
    token,
    callback
  );
};

// TODO: make delete request
const deletePresentation = (
  presentation_id: number,
  callback: any,
  token: string
) => {
  post(
    "profiles/presentations/delete",
    {
      presentation_id: presentation_id,
    },
    token,
    callback
  );
};

const getTags = (userId: number, callback: any) => {
  get(`profiles/tags/id=${userId}`, "", callback);
};

const updateTags = (
  userId: number,
  tags: string[],
  callback: any,
  token: string
) => {
  post(
    "profiles/tags/update",
    {
      user_id: userId,
      tags: tags,
    },
    token,
    callback
  );
};

const sendTalkInvitation = (
  invitingUserid: number,
  invitedUserid: number,
  channelId: number,
  date: string,
  message: string,
  contactEmail: string,
  talk_name: string,
  callback: any,
  token: string
) => {
  post(
    "profiles/invitation/speaker",
    {
      inviting_user_id: invitingUserid,
      invited_user_id: invitedUserid,
      channel_id: channelId,
      date: date,
      message: message,
      contact_email: contactEmail,
      presentation_name: talk_name,
    },
    token,
    callback
  );
};

const uploadProfilePhoto = (
  userId: number,
  image: File,
  callback: any,
  token: string
) => {
  const data = new FormData();
  data.append("userId", userId.toString());
  data.append("image", image);

  post("/profiles/photo", data, token, callback);
};

const getProfilePhotoUrl = (
  userId: number,
  cacheDelay?: number,
  callback?: any
) => {
  // check if user has profile_pic
  var pictureEndpoint = baseApiUrl + `/profiles/photo?userId=${userId}`;
  getProfile(userId, (profile: Profile) => {
    if (!profile.has_photo) {
      pictureEndpoint = pictureEndpoint + "&defaultPic=true";
    }
    if (cacheDelay) {
      pictureEndpoint = pictureEndpoint + "&ts=" + cacheDelay;
    }
    callback(pictureEndpoint);
  });
};

const removeProfilePhoto = (userId: number, callback: any, token: string) => {
  del("/profiles/photo", { userId }, token, callback);
};

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
};

export type Presentation = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  link: string;
  duration: number;
  date_created: string;
};

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
