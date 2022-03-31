import { Tag } from "./TagService";
import { Topic } from "../Services/TopicService";
import { del, get, post } from "../Middleware/httpMiddleware";
import { baseApiUrl } from "../config";
import axios from "axios";
import { Reminder } from "../Components/Talks/EditTalkModal";

const getTalkById = (talkId: number, callback: any) => {
  get(`talk/info?id=${talkId}`, "", callback);
};

const getAllFutureTalks = (limit: number, offset: number, callback: any) => {
  get(`talks/all/future?limit=${limit}&offset=${offset}`, "", callback);
};

const getAllCurrentTalks = (limit: number, offset: number, callback: any) => {
  get(`talks/all/current?limit=${limit}&offset=${offset}`, "", callback);
};

const getAllPastTalks = (limit: number, offset: number, callback: any) => {
  get(`talks/all/past?limit=${limit}&offset=${offset}`, "", callback);
};

const getFutureTalksForTopic = (
  topicId: number,
  limit: number,
  offset: number,
  callback: any
) => {
  get(
    `talks/topic/future?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getAllFutureTalksForTopicWithChildren = (
  limit: number,
  offset: number,
  topicId: number,
  callback: any
) => {
  get(
    `talks/topic/children/future?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getAllPastTalksForTopicWithChildren = (
  limit: number,
  offset: number,
  topicId: number,
  callback: any
) => {
  get(
    `talks/topic/children/past?topicId=${topicId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getPastTalksForTopic = (topicId: number, callback: any) => {
  get(`talks/topic/past?topicId=${topicId}`, "", callback);
};

const getFutureTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/future?channelId=${channelId}`, "", callback);
};

const getCurrentTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/current?channelId=${channelId}`, "", callback);
};

const getPastTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/past?channelId=${channelId}`, "", callback);
};

const getDraftedTalksForChannel = (channelId: number, callback: any) => {
  get(`talks/channel/drafted?channelId=${channelId}`, "", callback);
};

const getPastTalksForTag = (tagName: string, callback: any) => {
  get(`talks/tag/past?tagName=${tagName}`, "", callback);
};

const getAvailableFutureTalks = (
  limit: number,
  offset: number,
  userId: number | null,
  callback: any
) => {
  get(
    `talks/available/future?userId=${userId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getAvailableCurrentTalks = (
  limit: number,
  offset: number,
  userId: number | null,
  callback: any
) => {
  get(
    `talks/available/current?userId=${userId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getAvailablePastTalks = (
  limit: number,
  offset: number,
  userId: number | null,
  callback: any
) => {
  get(
    `talks/available/past?userId=${userId}&limit=${limit}&offset=${offset}`,
    "",
    callback
  );
};

const getAvailableFutureTalksForChannel = (
  channelId: number,
  userId: number | null,
  callback: any
) => {
  get(
    `talks/channel/available/future?channelId=${channelId}&userId=${userId}`,
    "",
    callback
  );
};

const getAvailableCurrentTalksForChannel = (
  channelId: number,
  userId: number | null,
  callback: any
) => {
  get(
    `talks/channel/available/current?channelId=${channelId}&userId=${userId}`,
    "",
    callback
  );
};

const getAvailablePastTalksForChannel = (
  channelId: number,
  userId: number | null,
  callback: any
) => {
  get(
    `talks/channel/available/past?channelId=${channelId}&userId=${userId}`,
    "",
    callback
  );
};

const editTalk = (
  channelId: number,
  talkId: number,
  talkName: string,
  talkDescription: string,
  startDate: string,
  endDate: string,
  talkLink: string,
  talkTags: Tag[],
  showLinkOffset: number,
  visibility: string,
  cardVisibility: string,
  topics: Topic[],
  talkSpeaker: string,
  talkSpeakerURL: string,
  published: number,
  audienceLevel: string,
  autoAcceptGroup: "Everybody" | "Academics" | "None",
  autoAcceptCustomInstitutions: boolean,
  customInstitutionsIds: number[] | number,
  reminders: Reminder[],
  reminderEmailGroup: string[],
  callback: any,
  token: string
) => {
  post(
    "talks/edit",
    {
      channelId: channelId,
      talkId: talkId,
      talkName: talkName,
      talkDescription: talkDescription,
      startDate: startDate,
      endDate: endDate,
      talkLink: talkLink,
      talkTags: talkTags,
      showLinkOffset: showLinkOffset,
      visibility: visibility,
      cardVisibility: cardVisibility,
      topic1Id: topics.length > 0 ? topics[0].id : null,
      topic2Id: topics.length > 1 ? topics[1].id : null,
      topic3Id: topics.length > 2 ? topics[2].id : null,
      talkSpeaker: talkSpeaker,
      talkSpeakerURL: talkSpeakerURL,
      published: published,
      audienceLevel: audienceLevel,
      reminder1: reminders[0].exist
        ? 24 * reminders[0].days + reminders[0].hours
        : null,
      reminder2: reminders[1].exist
        ? 24 * reminders[1].days + reminders[1].hours
        : null,
      reminderEmailGroup: reminderEmailGroup,
      autoAcceptGroup: autoAcceptGroup,
      autoAcceptCustomInstitutions: autoAcceptCustomInstitutions,
    },
    token,
    () => {
      editAutoAcceptanceCustomInstitutions(
        talkId,
        customInstitutionsIds,
        () => {},
        token
      );
      callback();
    }
  );
};

const scheduleTalk = (
  channelId: number,
  channelName: string,
  talkName: string,
  talkDescription: string,
  startDate: string,
  endDate: string,
  talkLink: string,
  talkTags: Tag[],
  showLinkOffset: number,
  visibility: string,
  cardVisibility: string,
  topics: Topic[],
  talkSpeaker: string,
  talkSpeakerURL: string,
  published: number,
  audienceLevel: string,
  autoAcceptGroup: "Everybody" | "Academics" | "None",
  autoAcceptCustomInstitutions: boolean,
  customInstitutionsIds: number[],
  reminders: Reminder[],
  reminderEmailGroup: string[],
  callback: any,
  token: string
) => {
  // DATA POLISHING
  // NB: we do not accept talks with empty titles, or "TBA", or "TBA". (Remy)
  if (
    talkName == "" ||
    talkName.toLowerCase() == "tba" ||
    talkName.toLowerCase() == "tbd"
  ) {
    // Build new title without topic
    var subtopic = "";
    if (topics) {
      for (let topic of topics) {
        if (subtopic == "") {
          if (!topic.is_primitive_node && topic) {
            subtopic = topic.field;
          }
        }
      }
    }

    var substituedTbaTbds = [
      "Seminar with " + talkSpeaker,
      "Talk by " + talkSpeaker,
      "'" + channelName + "' talk with " + talkSpeaker,
      "Latest advancements with " + talkSpeaker,
      "Recent advancements with " + talkSpeaker,
    ];

    // Build new title with topic
    if (subtopic !== "") {
      substituedTbaTbds.push(
        talkSpeaker + " on " + subtopic,
        "Topics on " + subtopic + " with " + talkSpeaker,
        "Advancements in " + subtopic,
        "Seminar on " + subtopic,
        "Talk on " + subtopic,
        subtopic + " seminar"
      );
    }
    talkName =
      substituedTbaTbds[Math.floor(Math.random() * substituedTbaTbds.length)];
  }

  post(
    "talks/create",
    {
      channelId: channelId,
      channelName: channelName,
      talkName: talkName,
      talkDescription: talkDescription,
      startDate: startDate,
      endDate: endDate,
      talkLink: talkLink,
      talkTags: talkTags,
      showLinkOffset: showLinkOffset,
      visibility: visibility,
      cardVisibility: cardVisibility,
      topic1Id:
        topics.length > 0
          ? topics[0] == undefined
            ? null
            : topics[0].id
          : null,
      topic2Id:
        topics.length > 1
          ? topics[1] == undefined
            ? null
            : topics[1].id
          : null,
      topic3Id:
        topics.length > 2
          ? topics[2] == undefined
            ? null
            : topics[2].id
          : null,
      talkSpeaker: talkSpeaker,
      talkSpeakerURL: talkSpeakerURL,
      published: published,
      audienceLevel: audienceLevel,
      reminder1: reminders[0].exist
        ? 24 * reminders[0].days + reminders[0].hours
        : null,
      reminder2: reminders[1].exist
        ? 24 * reminders[1].days + reminders[1].hours
        : null,
      reminderEmailGroup: reminderEmailGroup,
      autoAcceptGroup: autoAcceptGroup,
      autoAcceptCustomInstitutions: autoAcceptCustomInstitutions,
      customInstitutionsIds: customInstitutionsIds,
    },
    token,
    callback
  );
};

// TODO: make delete request
const deleteTalk = (id: number, callback: any, token: string) => {
  post(
    "talks/delete",
    {
      id: id,
    },
    token,
    callback
  );
};

const addRecordingLink = (
  id: number,
  link: string,
  callback: any,
  token: string
) => {
  post(
    "talks/add-recording",
    {
      talkId: id,
      link: link,
    },
    token,
    callback
  );
};

const registerForTalk = (
  talkId: number,
  userId: any,
  name: string,
  email: string,
  website: any,
  institution: string,
  callback: any,
  token: string
) => {
  var now = new Date();
  var userHourOffset = -now.getTimezoneOffset() / 60;
  // (NOTE: userHourOffset=-3 if user browser is in GMT-3 right now)
  post(
    "talks/requestaccess/register",
    {
      talkId: talkId,
      userId: userId,
      name: name,
      email: email,
      website: website,
      institution: institution,
      userHourOffset: userHourOffset,
    },
    token,
    callback
  );
};

const unRegisterForTalk = (
  talkId: number,
  userId: any,
  callback: any,
  token: string
) => {
  post(
    "talks/requestaccess/unregister",
    {
      talkId: talkId,
      userId: userId,
    },
    token,
    callback
  );
};

const getRegisteredTalksForUser = (
  userId: number,
  callback: any,
  token: string
) => {
  get(`talks/registered?userId=${userId}`, token, callback);
};

const registrationStatusForTalk = (
  talkId: number,
  userId: number,
  callback: any,
  token: string
) => {
  get(
    `talks/registrationstatus?talkId=${talkId}&userId=${userId}`,
    token,
    callback
  );
};

const acceptTalkRegistration = (
  requestRegistrationId: number,
  callback: any,
  token: string
) => {
  post(
    "talks/requestaccess/accept",
    {
      requestRegistrationId: requestRegistrationId,
    },
    token,
    callback
  );
};

const refuseTalkRegistration = (
  requestRegistrationId: number,
  callback: any,
  token: string
) => {
  post(
    "talks/requestaccess/refuse",
    {
      requestRegistrationId: requestRegistrationId,
    },
    token,
    callback
  );
};

const getTalkRegistrations = (
  talkId: any,
  channelId: any,
  userId: any,
  callback: any,
  token: string
) => {
  // method must be called with either talkId OR channelId OR userId (only one of them).
  let url = "";
  if (talkId !== null) {
    url = `/talks/requestaccess/all?talkId=${talkId}`;
  } else if (channelId !== null) {
    url = `/talks/requestaccess/all?channelId=${channelId}`;
  } else if (userId !== null) {
    url = `/talks/requestaccess/all?userId=${userId}`;
  }
  get(url, token, callback);
};

const saveTalk = (
  userId: number,
  talkId: number,
  callback: any,
  token: string
) => {
  post(
    "talks/save",
    {
      talkId: talkId,
      userId: userId,
    },
    token,
    callback
  );
};

const unsaveTalk = (
  userId: number,
  talkId: number,
  callback: any,
  token: string
) => {
  post(
    "talks/unsave",
    {
      talkId: talkId,
      userId: userId,
    },
    token,
    callback
  );
};

const getSavedTalksForUser = (userId: number, callback: any, token: string) => {
  get(`talks/saved?userId=${userId}`, token, callback);
};

const isSaved = (
  userId: number,
  talkId: number,
  callback: any,
  token: string
) => {
  get(`talks/issaved?talkId=${talkId}&userId=${userId}`, token, callback);
};

const getYoutubeThumbnail = (url: string | null, id: number) => {
  if (url && url.includes("youtube")) {
    const ytId = url.split("&")[0].split("=")[1];
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  } else if (url && url.includes("youtu.be")) {
    const ytId = url.split("/").pop();
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  } else {
    return "";
  }
};

const isAvailableToUser = (
  userId: number,
  talkId: number,
  callback: any,
  token: string
) => {
  get(`talks/isavailable?talkId=${talkId}&userId=${userId}`, token, callback);
};

//////////////////
// Slides management
//////////////////
const uploadSlides = async (
  talkId: number,
  slides: File,
  callback: any,
  token: string
) => {
  const data = new FormData();
  data.append("talkId", talkId.toString());
  data.append("slides", slides);
  let ret = await axios
    .post(baseApiUrl + "/talks/slides", data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(function (response) {
      callback(response.data);
    });

  return await getSlides(talkId);
};

const getSlides = async (talkId: number) => {
  var CACHE_DELAY = 500;
  let current_time = Math.floor(new Date().getTime() / 1000) * CACHE_DELAY;
  return {
    url: baseApiUrl + `/talks/slides?talkId=${talkId}&ts=` + current_time,
  };
};

const deleteSlides = async (talkId: number, callback: any, token: string) => {
  let res = await axios
    .delete(baseApiUrl + "/talks/slides", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      data: {
        talkId: talkId,
      },
    })
    .then(function (response) {
      callback(response.data);
    });

  return true;
};

const hasSlides = async (talkId: number, callback: any) => {
  get(`talks/hasslides?talkId=${talkId}`, "", (res: any) => {
    var hasSlides = res.hasSlides;
    if (callback) {
      callback(hasSlides);
    }
    return hasSlides;
  });
};

const uploadSpeakerPhoto = (
  talkId: number,
  image: File,
  callback: any,
  token: string
) => {
  const data = new FormData();
  data.append("talkId", talkId.toString());
  data.append("image", image);

  post("talks/speakerphoto", data, token, callback);
};

const getSpeakerPhoto = (talkId: number, cacheDelay?: number) => {
  if (cacheDelay) {
    return baseApiUrl + `/talks/speakerphoto?talkId=${talkId}&ts=` + cacheDelay;
  } else {
    return baseApiUrl + `/talks/speakerphoto?talkId=${talkId}`;
  }
};

const removeSpeakerPhoto = (talkId: number, callback: any, token: string) => {
  del("talks/speakerphoto", { talkId }, token, callback);
};

const getViewCountForTalk = (talkId: number, callback: any) => {
  get(`talks/viewcount/get?talkId=${talkId}`, "", callback);
};

const increaseViewCountForTalk = (channelId: number, callback: any) => {
  post("talks/viewcount/add", { channelId: channelId }, "", callback);
};

const getTrendingTalks = (callback: any) => {
  get("talks/trending", "", callback);
};

const sendEmailonTalkScheduling = (
  talkId: number,
  callback: any,
  token: string
) => {
  get(`talks/sendemailschedule?talkId=${talkId}`, token, callback);
};

const sendEmailonTalkModification = (
  talkId: number,
  callback: any,
  token: string
) => {
  get(`talks/sendemailedit?talkId=${talkId}`, token, callback);
};

const getReminderTime = (talkId: number, callback: any, token: string) => {
  get(`talks/reminders/time?talkId=${talkId}`, token, callback);
};

const getReminderGroup = (talkId: number, callback: any, token: string) => {
  get(`talks/reminders/group?talkId=${talkId}`, token, callback);
};

const editAutoAcceptanceCustomInstitutions = (
  talkId: number,
  institutionIds: number | number[],
  callback: any,
  token: string
) => {
  post(
    "talks/editCustomInstitutions",
    {
      talkId: talkId,
      institutionIds: institutionIds,
    },
    token,
    callback
  );
};

export const TalkService = {
  getTalkById,
  getAllFutureTalks,
  getAllCurrentTalks,
  getAllPastTalks,
  getFutureTalksForChannel,
  getCurrentTalksForChannel,
  getPastTalksForChannel,
  getDraftedTalksForChannel,
  getFutureTalksForTopic,
  getAllFutureTalksForTopicWithChildren,
  getAllPastTalksForTopicWithChildren,
  getPastTalksForTopic,
  getPastTalksForTag,
  getAvailableFutureTalks,
  getAvailableCurrentTalks,
  getAvailablePastTalks,
  getAvailableFutureTalksForChannel,
  getAvailableCurrentTalksForChannel,
  getAvailablePastTalksForChannel,
  editTalk,
  editAutoAcceptanceCustomInstitutions,
  scheduleTalk,
  deleteTalk,
  addRecordingLink,
  saveTalk,
  unsaveTalk,
  getSavedTalksForUser,
  isSaved,
  getYoutubeThumbnail,
  isAvailableToUser,
  // Speaker photo
  uploadSpeakerPhoto,
  getSpeakerPhoto,
  removeSpeakerPhoto,
  // Talk registration management
  sendEmailonTalkScheduling,
  sendEmailonTalkModification,
  getReminderTime,
  getReminderGroup,
  // talk registration management
  acceptTalkRegistration,
  refuseTalkRegistration,
  registerForTalk,
  unRegisterForTalk,
  registrationStatusForTalk,
  getTalkRegistrations,
  getRegisteredTalksForUser,
  // Slides management
  uploadSlides,
  getSlides,
  deleteSlides,
  hasSlides,
  // talk views
  increaseViewCountForTalk,
  getViewCountForTalk,
  // trending
  getTrendingTalks,
  // post-processing
};

export type Talk = {
  id: number;
  channel_id: number;
  channel_name: string;
  channel_colour: string;
  has_avatar: boolean;
  name: string;
  date: string;
  end_date: string;
  description: string;
  link: string;
  link_available?: boolean;
  recording_link: string;
  tags: Tag[];
  show_link_offset: number;
  visibility: string;
  card_visibility: string;
  topics: Topic[];
  talk_speaker: string;
  talk_speaker_url: string;
  published: number;
  audience_level: string;
  has_speaker_photo: number;
};
