import { get, post } from "../Middleware/httpMiddleware";
import { baseApiUrl } from "../config";
import axios from "axios";


const getValidSeriesAndNtalks = (url: string, callback: any) => {
	get(`rsscraping/valid?url=${url}`, callback)
}


export const RSScraping = {
	getValidSeriesAndNtalks,
};