import { get, post } from "../Middleware/httpMiddleware";
import { baseApiUrl } from "../config";
import axios from "axios";


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
		callback
	)
}


export const RSScraping = {
	getValidSeriesAndNtalks,
	getChannelAllTalks
};