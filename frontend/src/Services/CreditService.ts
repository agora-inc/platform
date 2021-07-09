// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";

const getUsedStreamCreditForTalk = (talkId: number, callback: any) => {
  get(`/credits/talk/used?talkId=${talkId}`, callback);
};

const getAvailableStreamCreditForChannel = (talkId: number, callback: any) => {
    get(`/credits/channel/available?channelId=${talkId}`, callback);
  };
  
const getAvailableStreamCreditForTalk = (talkId: number, callback: any) => {
get(`/credits/talk/available?talkId=${talkId}`, callback);
};
  
const addStreamCreditToTalk = (talkId: number, increment: BigInt, callback: any) => {
    get(`/credits/talk/add?talkId=${talkId}&increment=${increment}`, callback);
    };

const addStreamingCreditToChannel = (channelId: number, increment: BigInt, callback: any) => {
    get(`/credits/channel/add?talkId=${channelId}&increment=${increment}`, callback);
    };

const upgradeStreamTalkByOne = (talkId: number, callback: any) => {
    get(`/credits/talk/increment?talkId=${talkId}`, callback);
    };

const getMaxAudienceForCreditForTalk = (talkId: number, callback: any) => {
    get(`/credits/talk/max_audience?talkId=${talkId}`, callback);
    };
    

export const CreditService = {
    // stream credits
    getUsedStreamCreditForTalk,
    getAvailableStreamCreditForChannel,
    getAvailableStreamCreditForTalk,
    addStreamCreditToTalk,
    addStreamingCreditToChannel,
    upgradeStreamTalkByOne,
    getMaxAudienceForCreditForTalk
};
