import { Tag } from "./TagService";
import { ArtService } from "./ArtService";
import { get, post } from "../Middleware/httpMiddleware";

const getAllStreams = (limit: number, offset: number, callback: any) => {
  get(`streams/all?limit=${limit}&offset=${offset}`, "", callback);
};

const getStreamsForChannel = (channelId: number, callback: any) => {
  get(`streams/channel?channelId=${channelId}`, "", callback);
};

const getStreamById = (id: number, callback: any) => {
  get(`streams/stream?id=${id}`, "", callback);
};

const createStream = (
  channelId: number,
  channelName: string,
  streamName: string,
  streamDescription: string,
  streamTags: Tag[],
  callback: any,
  token: string
) => {
  // const imageUrl = ArtService.generateRandomArt(200, 278);
  post(
    "/streams/create",
    {
      channelId: channelId,
      channelName: channelName,
      streamName: streamName,
      streamDescription: streamDescription,
      streamTags: streamTags,
      imageUrl: "",
    },
    token,
    callback
  );
};

const archiveStream = (
  streamId: number,
  del: boolean,
  callback: any,
  token: string
) => {
  post(
    "/streams/archive",
    {
      streamId: streamId,
      delete: del,
    },
    token,
    callback
  );
};

const getToken = (
  channelName: string,
  roleAttendee: number,
  expireTimeInSec: number,
  userAccount: any,
  uid: any,
  callback: any
) => {
  let url = "";
  if (uid) {
    url = `tokens/streaming?channel_name=${channelName}&role_attendee=${roleAttendee}&expire_time_in_sec=${expireTimeInSec}&uid=${uid}`;
  } else if (userAccount) {
    url = `tokens/streaming?channel_name=${channelName}&role_attendee=${roleAttendee}&expire_time_in_sec=${expireTimeInSec}&user_account=${userAccount}`;
  }
  get(url, "", callback);
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
