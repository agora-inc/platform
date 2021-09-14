import { get, post } from "../Middleware/httpMiddleware";
import { baseApiUrl } from "../config";
import axios from "axios";



const createAgoraGetTalkIds = (
	url: string,
	userId: number,
	topic_1_id: number,
	callback: any
) => {
	post(
		`rsscraping/createAgora`,
		{
			url: url,
			user_id: userId, 
			topic_1_id: topic_1_id, 
		},
		callback,
	)
} 

const scheduleAllTalks = (
	url: string,
	channelId: number, 
	channelName: string, 
	idx: number[],
	topic_1_id: number,
	audienceLevel: string, 
	visibility: string,
	autoAcceptGroup: string,
	callback: any
) => {
	post(
		`rsscraping/allTalks`,
		{
			url: url,
			channel_id: channelId, 
			channel_name: channelName, 
			idx: idx,
			topic_1_id: topic_1_id, 
			audience_level: audienceLevel, 
			visibility: visibility,
			auto_accept_group: autoAcceptGroup,
		},
		callback,
	)
} 



/*
const scrapeScheduleTalk = (
	url: string, 
	talkId: number, 
	channelId: number, 
	channelName: string, 
	topic_1_id: number, 
	audienceLevel: string, 
	visibility: string, 
	autoAcceptGroup: string,
	callback: any,
) => {
	post(
		`rsscraping/scheduleTalk`,
		{
			url: url, 
			talk_id: talkId, 
			channel_id: channelId, 
			channel_name: channelName, 
			topic_1_id: topic_1_id, 
			audience_level: audienceLevel, 
			visibility: visibility, 
			auto_accept_group: autoAcceptGroup
		},
		callback
	)
}
*/


/*
const getValidSeriesAndNtalks = (url: string, callback: any) => {
	get(`rsscraping/valid?url=${url}`, callback)
}

const getChannelAllTalks = (
	url: string,
	userId: number,
	topic_1_id: number,
	audienceLevel: string, 
	visibility: string,
	autoAcceptGroup: string,
	callback: any
) => {
	post(
		`rsscraping/allTalks`,
		{
			url: url,
			user_id: userId, 
			topic_1_id: topic_1_id, 
			audience_level: audienceLevel, 
			visibility: visibility,
			auto_accept_group: autoAcceptGroup,
		},
		callback,
	)
} */

/*
	axios
		.post(
			baseApiUrl + `/rsscraping/allTalks`,
			{
				url: url,
				user_id: userId, 
				topic_1_id: topic_1_id, 
				audience_level: audienceLevel, 
				visibility: visibility,
				auto_accept_group: autoAcceptGroup,
			},
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			}
		)
		.then(function (response) {
			callback(response);
		})
		.catch(function (error) {
			console.log("ERROR", error)
			callback({channelId: -1, channelName: ""});
		});
*/


export const RSScraping = {
	createAgoraGetTalkIds,
	scheduleAllTalks,
	// scrapeScheduleTalk,
	// getValidSeriesAndNtalks,
	// getChannelAllTalks
};