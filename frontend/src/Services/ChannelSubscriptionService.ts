// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";

export interface ChannelSubscription {
    channelId: string;
    product_id: string;
    status: "active" | "checkout" | "cancelled" | "unpaid" | "interrupted";
    user_id: string;
}

const getActiveSubscriptionForChannel = (
    channelId: number,
    productId: number,
    callback: any) => {
    get(`subscriptions/channel?channelId=${channelId}&productId=${productId}`, callback);
    };
    

const getAllActiveSubscriptionsForChannel = (
    channelId: number,
    callback: any) => {
    get(`subscriptions/channel/all?channelId=${channelId}`, callback);
    };
    

const cancelSubscriptionForChannel = (
    channelId: number,
    productId: number,
    callback: any) => {
    get(`subscriptions/channel/cancel?channelId=${channelId}&productId=${productId}`, callback);
};

export const ChannelSubscriptionService = {
    getActiveSubscriptionForChannel,
    getAllActiveSubscriptionsForChannel,
    cancelSubscriptionForChannel
};
